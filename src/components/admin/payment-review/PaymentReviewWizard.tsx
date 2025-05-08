import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { toast } from "@/hooks/use-toast";
import { PendingPaymentsGrid } from "./PendingPaymentsGrid";
import { PaymentReviewForm } from "./PaymentReviewForm";
import { PaymentSummary } from "./PaymentSummary";
import { mockPendingPayments, PendingPayment } from "@/lib/mockData";
import { generatePaymentProcessSummary } from "@/lib/admin/pdfGenerator";
import { Download, FileCheck } from "lucide-react";

interface PaymentReviewWizardProps {
  isOpen: boolean;
  onClose: () => void;
  payments: PendingPayment[];
  onComplete?: (summary: {
    approved: PendingPayment[];
    rejected: PendingPayment[];
    totalApproved: number;
    totalRejected: number;
  }) => void;
}

const STEPS = ["Selección", "Revisión", "Confirmación", "Resumen"];

const INITIAL_STATE = {
  currentStep: 0,
  selectedPayments: [],
  processedPayments: {
    approved: [],
    rejected: [],
  },
};

export const PaymentReviewWizard: React.FC<PaymentReviewWizardProps> = ({
  isOpen,
  onClose,
  payments: initialPayments = [],
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayments, setSelectedPayments] = useState<PendingPayment[]>(
    []
  );
  const [processedPayments, setProcessedPayments] = useState<{
    approved: PendingPayment[];
    rejected: PendingPayment[];
  }>({
    approved: [],
    rejected: [],
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSelectedPayments([]);
      setProcessedPayments({ approved: [], rejected: [] });
    }
  }, [isOpen]);

  const handleClose = () => {
    if (currentStep === STEPS.length - 1) {
      const summary = {
        approved: processedPayments.approved,
        rejected: processedPayments.rejected,
        totalApproved: processedPayments.approved.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
        totalRejected: processedPayments.rejected.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
      };
      onComplete?.(summary);
    } else {
      // Mostrar toast de cancelación si no estamos en el paso final
      toast({
        title: "Revisión cancelada",
        description: "La revisión de pagos ha sido cancelada.",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }

    setCurrentStep(0);
    setSelectedPayments([]);
    setProcessedPayments({ approved: [], rejected: [] });
    onClose();
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    try {
      // Calcular totales
      const totalApproved = processedPayments.approved.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const totalRejected = processedPayments.rejected.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Mostrar notificación de éxito
      toast({
        title: "Proceso completado",
        description: `Se han procesado ${selectedPayments.length} pagos exitosamente.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });

      // Avanzar al paso final
      handleNext();
    } catch (error) {
      console.error("Error al finalizar el proceso:", error);
      toast({
        title: "Error",
        description: "Hubo un error al procesar los pagos",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      const summary = {
        approved: processedPayments.approved,
        rejected: processedPayments.rejected,
        totalApproved: processedPayments.approved.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
        totalRejected: processedPayments.rejected.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
      };

      const doc = generatePaymentProcessSummary(summary);
      const fileName = `resumen-pagos-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF generado exitosamente",
        description: "El resumen ha sido descargado",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast({
        title: "Error al generar PDF",
        description:
          "No se pudo generar el documento. Por favor, intente nuevamente.",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    toast({
      title: "Revisión cancelada",
      description: "La revisión de pagos ha sido cancelada.",
      className: "bg-red-50 border-red-200 text-red-800",
    });
    handleClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PendingPaymentsGrid
            payments={initialPayments}
            selectedPayments={selectedPayments}
            onSelectionChange={setSelectedPayments}
          />
        );
      case 1:
        return (
          <PaymentReviewForm
            payments={selectedPayments}
            onProcessed={(approved, rejected) => {
              setProcessedPayments({ approved, rejected });
              handleNext();
            }}
          />
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Resumen de procesamiento</h3>
              <div className="space-y-2">
                <p>Pagos aprobados: {processedPayments.approved.length}</p>
                <p>Pagos rechazados: {processedPayments.rejected.length}</p>
                <p>Total de pagos: {selectedPayments.length}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleFinish}>Finalizar proceso</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center space-y-4">
              <FileCheck className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-xl font-medium">¡Proceso completado!</h3>
              <p className="text-muted-foreground">
                Se han procesado {selectedPayments.length} pagos exitosamente.
              </p>
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Resumen PDF</span>
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Revisión de Pagos Pendientes</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm">
                <span>{STEPS[currentStep]}</span>
                <span>{`${currentStep + 1} de ${STEPS.length}`}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {renderStepContent()}
          </div>

          <DialogFooter>
            {currentStep === STEPS.length - 1 ? (
              <Button variant="outline" onClick={handleClose}>
                Cerrar
              </Button>
            ) : (
              <div className="flex justify-between w-full">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    Anterior
                  </Button>
                )}
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                {currentStep === 0 && (
                  <Button
                    onClick={handleNext}
                    disabled={selectedPayments.length === 0}
                  >
                    Siguiente
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar revisión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cancelar la revisión? Se perderán
              todos los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              No, continuar revisión
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
