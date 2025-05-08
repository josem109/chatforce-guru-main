import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PendingPayment } from "../types/AdminChatTypes";

interface PaymentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: PendingPayment[];
  onApprove: (paymentId: string) => void;
  onReject: (paymentId: string, reason: string) => void;
}

export const PaymentReviewModal: React.FC<PaymentReviewModalProps> = ({
  isOpen,
  onClose,
  payments,
  onApprove,
  onReject,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Revisión de Pagos Pendientes</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <h4 className="font-medium">{payment.clientName}</h4>
                <p className="text-sm text-muted-foreground">
                  ${payment.amount} - {payment.paymentMethod}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ref: {payment.reference}
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => onApprove(payment.id)}>
                  Aprobar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onReject(payment.id, "")}
                >
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
