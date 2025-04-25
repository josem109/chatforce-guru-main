import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Pago {
  id: string;
  banco: string;
  referencia: string;
  tipoPago: string;
  monto: number;
  archivo: File | null;
}

interface PagosGridProps {
  montoMaximo: number;
  onPagosChange: (pagos: Pago[], isValid: boolean) => void;
}

const bancos = [
  "Banco Provincial",
  "Banco Nacional de Crédito",
  "Banco Mercantil",
  "Bancaribe",
];

const tiposPago = [
  "Divisas Efectivo",
  "Transferencia Divisas",
  "Transferencia Bolívares",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const PagosGrid: React.FC<PagosGridProps> = ({
  montoMaximo,
  onPagosChange,
}) => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string>("");

  const handleAddPago = () => {
    const newPago: Pago = {
      id: Date.now().toString(),
      banco: "",
      referencia: "",
      tipoPago: "",
      monto: 0,
      archivo: null,
    };
    setPagos([...pagos, newPago]);
  };

  const handleRemovePago = (id: string) => {
    setPagos(pagos.filter((pago) => pago.id !== id));
  };

  const handlePagoChange = (id: string, field: keyof Pago, value: any) => {
    const updatedPagos = pagos.map((pago) => {
      if (pago.id === id) {
        return { ...pago, [field]: value };
      }
      return pago;
    });
    setPagos(updatedPagos);
    validatePagos(updatedPagos);
  };

  const handleFileChange = (id: string, file: File | null) => {
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("Solo se permiten archivos PDF, JPG y PNG");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("El archivo no debe superar los 5MB");
        return;
      }
    }
    handlePagoChange(id, "archivo", file);
  };

  const validatePagos = (pagosToValidate: Pago[]) => {
    // Validar que todos los campos estén completos
    const todosLosCamposCompletos = pagosToValidate.every(
      (pago) =>
        pago.banco &&
        pago.referencia &&
        pago.tipoPago &&
        pago.monto > 0 &&
        pago.archivo
    );

    // Validar que la suma de los montos no exceda el máximo
    const sumaMontos = pagosToValidate.reduce(
      (sum, pago) => sum + pago.monto,
      0
    );
    const montoValido = sumaMontos <= montoMaximo;

    // Validar que no haya referencias duplicadas
    const referencias = pagosToValidate.map((pago) => pago.referencia);
    const referenciasUnicas = new Set(referencias).size === referencias.length;

    if (!todosLosCamposCompletos) {
      setError("Todos los campos son obligatorios");
      onPagosChange(pagosToValidate, false);
      return;
    }

    if (!montoValido) {
      setError(
        `La suma de los montos ($${sumaMontos.toFixed(
          2
        )}) no puede exceder el monto máximo ($${montoMaximo.toFixed(2)})`
      );
      onPagosChange(pagosToValidate, false);
      return;
    }

    if (!referenciasUnicas) {
      setError("No pueden haber números de referencia duplicados");
      onPagosChange(pagosToValidate, false);
      return;
    }

    setError("");
    onPagosChange(pagosToValidate, true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Registro de Pagos</Label>
        <Button
          variant="outline"
          onClick={handleAddPago}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Pago
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Banco
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referencia
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archivo
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Select
                    value={pago.banco}
                    onValueChange={(value) =>
                      handlePagoChange(pago.id, "banco", value)
                    }
                  >
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Seleccionar banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancos.map((banco) => (
                        <SelectItem key={banco} value={banco}>
                          {banco}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Input
                    value={pago.referencia}
                    onChange={(e) =>
                      handlePagoChange(pago.id, "referencia", e.target.value)
                    }
                    placeholder="Referencia"
                    className="w-[120px] h-8"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Select
                    value={pago.tipoPago}
                    onValueChange={(value) =>
                      handlePagoChange(pago.id, "tipoPago", value)
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposPago.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Input
                    type="number"
                    value={pago.monto}
                    onChange={(e) =>
                      handlePagoChange(
                        pago.id,
                        "monto",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    className="w-[100px] h-8"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(pago.id, e.target.files?.[0] || null)
                      }
                      className="w-[120px] h-8"
                    />
                    {pago.archivo && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm text-muted-foreground">
                              {pago.archivo.name.slice(0, 8)}...
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{pago.archivo.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePago(pago.id)}
                    className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground">
          Monto máximo disponible: ${montoMaximo.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Monto total registrado: $
          {pagos.reduce((sum, pago) => sum + pago.monto, 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};
