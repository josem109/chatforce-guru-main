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
import { FacturasGrid } from "./FacturasGrid.tsx";
import { MontoCobroInput } from "./MontoCobroInput";
import { PagosGrid } from "./PagosGrid";
import { ResumenCobranza } from "./ResumenCobranza";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdfGenerator";

interface CobranzaWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCobranzaComplete: (resumen: {
    facturas: any[];
    pagos: any[];
    montoTotal: number;
    comprobante: string;
  }) => void;
}

type WizardStep = "facturas" | "monto" | "pagos" | "confirmacion";

const steps: WizardStep[] = ["facturas", "monto", "pagos", "confirmacion"];

// Datos ficticios para las facturas
const facturasMock = [
  {
    numero: "F001",
    fecha: "2023-01-15",
    montoOriginal: 1000,
    montoPendiente: 1000,
  },
  {
    numero: "F002",
    fecha: "2023-02-20",
    montoOriginal: 2000,
    montoPendiente: 2000,
  },
  {
    numero: "F003",
    fecha: "2023-03-10",
    montoOriginal: 1500,
    montoPendiente: 1500,
  },
  {
    numero: "F004",
    fecha: "2023-04-05",
    montoOriginal: 3000,
    montoPendiente: 3000,
  },
  {
    numero: "F005",
    fecha: "2023-05-12",
    montoOriginal: 2500,
    montoPendiente: 2500,
  },
];

export const CobranzaWizard: React.FC<CobranzaWizardProps> = ({
  isOpen,
  onClose,
  onCobranzaComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("facturas");
  const [selectedFacturas, setSelectedFacturas] = useState<string[]>([]);
  const [montoCobro, setMontoCobro] = useState<number>(0);
  const [isMontoValid, setIsMontoValid] = useState<boolean>(true);
  const [pagos, setPagos] = useState<any[]>([]);
  const [isPagosValid, setIsPagosValid] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Calcular el monto máximo basado en las facturas seleccionadas
  const montoMaximo = facturasMock
    .filter((factura) => selectedFacturas.includes(factura.numero))
    .reduce((sum, factura) => sum + factura.montoPendiente, 0);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleMontoChange = (monto: number, isValid: boolean) => {
    setMontoCobro(monto);
    setIsMontoValid(isValid);
  };

  const handlePagosChange = (newPagos: any[], isValid: boolean) => {
    setPagos(newPagos);
    setIsPagosValid(isValid);
  };

  // Validar si se puede avanzar al siguiente paso
  const canProceed = () => {
    switch (currentStep) {
      case "facturas":
        return selectedFacturas.length > 0;
      case "monto":
        return montoCobro > 0 && isMontoValid;
      case "pagos":
        return isPagosValid;
      default:
        return true;
    }
  };

  const handleFinish = async () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCobranza = async () => {
    try {
      const facturasSeleccionadas = facturasMock.filter((factura) =>
        selectedFacturas.includes(factura.numero)
      );

      // Generar PDF
      let comprobantePDF;
      try {
        comprobantePDF = await generatePDF({
          facturas: facturasSeleccionadas,
          pagos,
          montoTotal: montoCobro,
          fecha: new Date().toISOString(),
        });
      } catch (pdfError) {
        console.error("Error generando PDF:", pdfError);
        throw new Error("No se pudo generar el comprobante PDF");
      }

      // Notificar completación
      onCobranzaComplete({
        facturas: facturasSeleccionadas,
        pagos,
        montoTotal: montoCobro,
        comprobante: comprobantePDF,
      });

      // Mostrar mensaje de éxito
      toast({
        title: "Cobranza procesada con éxito",
        description:
          "El comprobante ha sido generado y está listo para descargar.",
        variant: "default",
        className: "bg-green-500 text-white border-0",
      });

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al procesar la cobranza:", error);
      toast({
        title: "Error al procesar la cobranza",
        description:
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al procesar la cobranza. Por favor, intente nuevamente.",
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

  const renderStepContent = () => {
    switch (currentStep) {
      case "facturas":
        return (
          <FacturasGrid
            selectedFacturas={selectedFacturas}
            onSelectionChange={setSelectedFacturas}
          />
        );
      case "monto":
        return (
          <MontoCobroInput
            montoMaximo={montoMaximo}
            onMontoChange={handleMontoChange}
          />
        );
      case "pagos":
        return (
          <PagosGrid
            montoMaximo={montoCobro}
            onPagosChange={handlePagosChange}
          />
        );
      case "confirmacion":
        const facturasSeleccionadas = facturasMock.filter((factura) =>
          selectedFacturas.includes(factura.numero)
        );
        return (
          <ResumenCobranza
            facturas={facturasSeleccionadas}
            pagos={pagos}
            montoTotal={montoCobro}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Proceso de Cobranza</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-muted-foreground mt-2">
              Paso {currentStepIndex + 1} de {steps.length}
            </div>
          </div>

          <div className="mt-6">{renderStepContent()}</div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>

            <div className="space-x-2">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
              )}
              {currentStepIndex === steps.length - 1 ? (
                <Button onClick={handleFinish} disabled={!canProceed()}>
                  Finalizar
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Siguiente
                </Button>
              )}
            </div>
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
