import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FacturasGrid } from "./FacturasGrid";
import { PagosGrid } from "./PagosGrid";
import { ResumenCobranza } from "./ResumenCobranza";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdfGenerator";
import { facturasMock } from "@/lib/mockData";

interface Factura {
  numero: string;
  fecha: string;
  montoOriginal: number;
  montoPendiente: number;
}

interface Pago {
  id: string;
  banco: string;
  referencia: string;
  tipoPago: string;
  monto: number;
  fechaValor: string;
  archivo: File | null;
}

interface CobranzaWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCobranzaComplete: (resumen: {
    facturas: Factura[];
    pagos: Pago[];
    montoTotal: number;
    comprobante: string;
  }) => void;
}

type WizardStep = "seleccion" | "pagos" | "confirmacion";

const steps: WizardStep[] = ["seleccion", "pagos", "confirmacion"];

export const CobranzaWizard: React.FC<CobranzaWizardProps> = ({
  isOpen,
  onClose,
  onCobranzaComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("seleccion");
  const [selectedFacturas, setSelectedFacturas] = useState<Factura[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [montoCobro, setMontoCobro] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleFacturaSelection = (facturas: Factura[]) => {
    setSelectedFacturas(facturas);
    const montoTotal = facturas.reduce(
      (sum, factura) => sum + factura.montoPendiente,
      0
    );
    setMontoCobro(montoTotal);
  };

  const handlePagosChange = (newPagos: Pago[], isValid: boolean) => {
    setPagos(newPagos);
  };

  const handleConfirmCobranza = async () => {
    try {
      // Generar PDF
      let comprobantePDF;
      try {
        comprobantePDF = await generatePDF({
          facturas: selectedFacturas,
          pagos: pagos,
          montoTotal: montoCobro,
        });
      } catch (error) {
        console.error("Error al generar PDF:", error);
        throw new Error("Error al generar el comprobante PDF");
      }

      // Enviar resumen al chat
      onCobranzaComplete({
        facturas: selectedFacturas,
        pagos: pagos,
        montoTotal: montoCobro,
        comprobante: comprobantePDF,
      });

      // Cerrar wizard
      onClose();
    } catch (error) {
      console.error("Error al procesar cobranza:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al procesar la cobranza",
        variant: "destructive",
      });
    }
  };

  const handleCancelCobranza = () => {
    setShowConfirmDialog(false);
    toast({
      title: "Cobranza cancelada",
      description: "La cobranza ha sido cancelada por el usuario.",
      variant: "destructive",
    });
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case "seleccion":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Selección de Facturas</h3>
            <FacturasGrid
              facturas={facturasMock}
              selectedFacturas={selectedFacturas}
              onSelectionChange={handleFacturaSelection}
            />
          </div>
        );
      case "pagos":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Registro de Pagos</h3>
            <PagosGrid
              montoMaximo={montoCobro}
              onPagosChange={handlePagosChange}
            />
          </div>
        );
      case "confirmacion":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Resumen de Cobranza</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Facturas Seleccionadas
                  </h4>
                  <div className="bg-white/5 rounded-lg p-3">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground">
                            Número
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground">
                            Fecha
                          </th>
                          <th className="text-right text-xs font-medium text-muted-foreground">
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFacturas.map((factura) => (
                          <tr key={factura.numero}>
                            <td className="text-sm">{factura.numero}</td>
                            <td className="text-sm">{factura.fecha}</td>
                            <td className="text-sm text-right">
                              ${factura.montoPendiente.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Pagos Registrados
                  </h4>
                  <div className="bg-white/5 rounded-lg p-3">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground">
                            Banco
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground">
                            Referencia
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground">
                            Tipo
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground">
                            Fecha Valor
                          </th>
                          <th className="text-right text-xs font-medium text-muted-foreground">
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagos.map((pago) => (
                          <tr key={pago.id}>
                            <td className="text-sm">{pago.banco}</td>
                            <td className="text-sm">{pago.referencia}</td>
                            <td className="text-sm">{pago.tipoPago}</td>
                            <td className="text-sm">{pago.fechaValor}</td>
                            <td className="text-sm text-right">
                              ${pago.monto.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Monto Total a Pagar:</span>
                  <span className="font-semibold">
                    ${montoCobro.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep("pagos")}
              >
                Atrás
              </Button>
              <Button
                type="button"
                onClick={handleConfirmCobranza}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Confirmar Cobranza
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Proceso de Cobranza</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-muted-foreground mt-2">
              Paso {currentStepIndex + 1} de {steps.length}
            </div>
          </div>

          <div className="mt-6">{renderStep()}</div>

          <div className="flex justify-between mt-6">
            {currentStep !== "seleccion" && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setCurrentStep(
                    currentStep === "pagos" ? "seleccion" : "pagos"
                  )
                }
              >
                Atrás
              </Button>
            )}
            {currentStep !== "confirmacion" && (
              <Button
                type="button"
                onClick={() =>
                  setCurrentStep(
                    currentStep === "seleccion" ? "pagos" : "confirmacion"
                  )
                }
                className="bg-primary text-white hover:bg-primary/90"
              >
                Siguiente
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cobranza</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea procesar la cobranza? Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCobranza}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCobranza}>
              Procesar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
