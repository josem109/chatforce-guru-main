import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Factura {
  numero: string;
  fecha: string;
  montoOriginal: number;
  montoPendiente: number;
}

interface FacturasGridProps {
  facturas: Factura[];
  selectedFacturas: Factura[];
  onSelectionChange: (facturas: Factura[]) => void;
}

export const FacturasGrid: React.FC<FacturasGridProps> = ({
  facturas,
  selectedFacturas,
  onSelectionChange,
}) => {
  const handleFacturaSelection = (factura: Factura, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedFacturas, factura]);
    } else {
      onSelectionChange(
        selectedFacturas.filter((f) => f.numero !== factura.numero)
      );
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
              <Checkbox
                checked={selectedFacturas.length === facturas.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange(facturas);
                  } else {
                    onSelectionChange([]);
                  }
                }}
              />
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto Original
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto Pendiente
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {facturas.map((factura) => (
            <tr key={factura.numero}>
              <td className="px-3 py-2 whitespace-nowrap">
                <Checkbox
                  checked={selectedFacturas.some(
                    (f) => f.numero === factura.numero
                  )}
                  onCheckedChange={(checked) =>
                    handleFacturaSelection(factura, checked as boolean)
                  }
                />
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                {factura.numero}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                {factura.fecha}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                ${factura.montoOriginal.toFixed(2)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                ${factura.montoPendiente.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
