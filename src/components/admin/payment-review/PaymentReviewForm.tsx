import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { PendingPayment } from "@/lib/mockData";

interface PaymentReviewFormProps {
  payments: PendingPayment[];
  onProcessed: (approved: PendingPayment[], rejected: PendingPayment[]) => void;
}

interface RejectedPayment extends PendingPayment {
  comments: string;
}

export const PaymentReviewForm: React.FC<PaymentReviewFormProps> = ({
  payments,
  onProcessed,
}) => {
  const [rejectedPayments, setRejectedPayments] = useState<RejectedPayment[]>(
    []
  );
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const handleReject = (payment: PendingPayment) => {
    if (rejectedPayments.some((p) => p.id === payment.id)) {
      // Si ya está rechazado, lo quitamos de rechazados
      setRejectedPayments(rejectedPayments.filter((p) => p.id !== payment.id));
      const newComments = { ...comments };
      delete newComments[payment.id];
      setComments(newComments);
    } else {
      // Si no está rechazado, lo agregamos a rechazados
      setRejectedPayments([
        ...rejectedPayments,
        { ...payment, comments: comments[payment.id] || "" },
      ]);
    }
  };

  const handleCommentChange = (paymentId: string, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [paymentId]: comment,
    }));
    // Actualizar también el comentario en rejectedPayments si existe
    if (rejectedPayments.some((p) => p.id === paymentId)) {
      setRejectedPayments(
        rejectedPayments.map((p) =>
          p.id === paymentId ? { ...p, comments: comment } : p
        )
      );
    }
  };

  const isPaymentRejected = (paymentId: string) => {
    return rejectedPayments.some((p) => p.id === paymentId);
  };

  const isValid = () => {
    // Un pago rechazado debe tener comentarios
    const allRejectedHaveComments = rejectedPayments.every(
      (p) => p.comments && p.comments.trim().length > 0
    );

    // Todos los pagos deben estar procesados (aprobados o rechazados)
    const allPaymentsProcessed = payments.every(
      (payment) =>
        rejectedPayments.some((p) => p.id === payment.id) || // está rechazado
        !isPaymentRejected(payment.id) // está aprobado (no está en rechazados)
    );

    return allRejectedHaveComments || allPaymentsProcessed;
  };

  const handleSubmit = () => {
    const approved = payments.filter(
      (payment) =>
        !rejectedPayments.some((rejected) => rejected.id === payment.id)
    );
    onProcessed(approved, rejectedPayments);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.clientName}</TableCell>
              <TableCell>{payment.reference}</TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell>
                {payment.date instanceof Date
                  ? payment.date.toLocaleDateString()
                  : new Date(payment.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                ${payment.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={
                        !isPaymentRejected(payment.id) ? "default" : "outline"
                      }
                      onClick={() => handleReject(payment)}
                      className="w-28"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        isPaymentRejected(payment.id)
                          ? "destructive"
                          : "outline"
                      }
                      onClick={() => handleReject(payment)}
                      className="w-28"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                  {isPaymentRejected(payment.id) && (
                    <Textarea
                      placeholder="Motivo del rechazo"
                      value={comments[payment.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(payment.id, e.target.value)
                      }
                      className="text-sm"
                      rows={2}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit} disabled={!isValid()}>
          Procesar Pagos
        </Button>
      </div>
    </div>
  );
};
