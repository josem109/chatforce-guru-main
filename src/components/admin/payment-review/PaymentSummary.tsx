import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface PendingPayment {
  id: string;
  clientName: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  reference: string;
  status: "pending_review" | "approved" | "rejected";
  comments?: string;
}

interface PaymentSummaryProps {
  payments: PendingPayment[];
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ payments }) => {
  const approvedPayments = payments.filter((p) => p.status === "approved");
  const rejectedPayments = payments.filter((p) => p.status === "rejected");
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Resumen de Revisión</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Pagos</div>
            <div className="text-2xl font-semibold">{payments.length}</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Aprobados</div>
            <div className="text-2xl font-semibold text-green-500">
              {approvedPayments.length}
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Rechazados</div>
            <div className="text-2xl font-semibold text-red-500">
              {rejectedPayments.length}
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.clientName}</TableCell>
                <TableCell>{payment.reference}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {payment.status === "approved" ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    {payment.status === "approved" ? "Aprobado" : "Rechazado"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${payment.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                ${totalAmount.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
