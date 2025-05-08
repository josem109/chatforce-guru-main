import React, { useState } from "react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { mockPendingPayments } from "../lib/mockData";

interface PaymentReviewWizardProps {
  onComplete: (result: {
    approved: number;
    rejected: number;
    total: number;
  }) => void;
  onCancel: () => void;
}

export const PaymentReviewWizard: React.FC<PaymentReviewWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [reviewedPayments, setReviewedPayments] = useState<{
    [key: string]: { approved: boolean; comment: string };
  }>({});

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    const result = {
      approved: Object.values(reviewedPayments).filter((p) => p.approved)
        .length,
      rejected: Object.values(reviewedPayments).filter((p) => !p.approved)
        .length,
      total: Object.keys(reviewedPayments).length,
    };
    onComplete(result);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Revisión de Pagos Pendientes</h2>
            <Button variant="ghost" onClick={onCancel}>
              ×
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>

          {/* Step content */}
          <div className="mb-6">
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Selección de Pagos
                </h3>
                <div className="max-h-[400px] overflow-y-auto">
                  {mockPendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center p-2 hover:bg-muted/50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPayments((prev) => [
                              ...prev,
                              payment.id,
                            ]);
                          } else {
                            setSelectedPayments((prev) =>
                              prev.filter((id) => id !== payment.id)
                            );
                          }
                        }}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">{payment.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          Monto: ${payment.amount} • Ref: {payment.reference}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Revisión de Pagos
                </h3>
                <div className="max-h-[400px] overflow-y-auto space-y-4">
                  {selectedPayments.map((paymentId) => {
                    const payment = mockPendingPayments.find(
                      (p) => p.id === paymentId
                    );
                    return (
                      <div key={paymentId} className="border p-4 rounded">
                        <h4 className="font-medium">{payment?.clientName}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Monto: ${payment?.amount} • Ref: {payment?.reference}
                        </p>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant={
                              reviewedPayments[paymentId]?.approved
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setReviewedPayments((prev) => ({
                                ...prev,
                                [paymentId]: {
                                  ...prev[paymentId],
                                  approved: true,
                                },
                              }))
                            }
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              reviewedPayments[paymentId]?.approved === false
                                ? "destructive"
                                : "outline"
                            }
                            onClick={() =>
                              setReviewedPayments((prev) => ({
                                ...prev,
                                [paymentId]: {
                                  ...prev[paymentId],
                                  approved: false,
                                },
                              }))
                            }
                          >
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Resumen</h3>
                <div className="space-y-4">
                  <p>Total de pagos revisados: {selectedPayments.length}</p>
                  <p>
                    Pagos aprobados:{" "}
                    {
                      Object.values(reviewedPayments).filter((p) => p.approved)
                        .length
                    }
                  </p>
                  <p>
                    Pagos rechazados:{" "}
                    {
                      Object.values(reviewedPayments).filter((p) => !p.approved)
                        .length
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handlePrevious}
            >
              {currentStep === 1 ? "Cancelar" : "Anterior"}
            </Button>
            <Button
              onClick={currentStep === 3 ? handleFinish : handleNext}
              disabled={
                (currentStep === 1 && selectedPayments.length === 0) ||
                (currentStep === 2 &&
                  Object.keys(reviewedPayments).length !==
                    selectedPayments.length)
              }
            >
              {currentStep === 3 ? "Finalizar" : "Siguiente"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
