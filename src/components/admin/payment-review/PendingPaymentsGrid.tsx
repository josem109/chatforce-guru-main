import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { PaymentProofModal } from "./PaymentProofModal";
import { PendingPayment } from "@/lib/mockData";

interface PendingPaymentsGridProps {
  payments: PendingPayment[];
  selectedPayments: PendingPayment[];
  onSelectionChange: (payments: PendingPayment[]) => void;
}

export const PendingPaymentsGrid: React.FC<PendingPaymentsGridProps> = ({
  payments = [],
  selectedPayments = [],
  onSelectionChange,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<{
    url: string;
    reference: string;
  } | null>(null);

  const handleToggleAll = () => {
    if (selectedPayments.length === payments.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...payments]);
    }
  };

  const handleTogglePayment = (payment: PendingPayment) => {
    const isSelected = selectedPayments.some((p) => p.id === payment.id);
    if (isSelected) {
      onSelectionChange(selectedPayments.filter((p) => p.id !== payment.id));
    } else {
      onSelectionChange([...selectedPayments, payment]);
    }
  };

  const handleViewProof = (payment: PendingPayment) => {
    setSelectedImage({
      url: payment.paymentProofUrl,
      reference: payment.reference,
    });
  };

  if (!Array.isArray(payments) || !Array.isArray(selectedPayments)) {
    return <div>No hay pagos pendientes para mostrar.</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  payments.length > 0 &&
                  selectedPayments.length === payments.length
                }
                onCheckedChange={handleToggleAll}
              />
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="w-24">Comprobante</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <Checkbox
                  checked={selectedPayments.some((p) => p.id === payment.id)}
                  onCheckedChange={() => handleTogglePayment(payment)}
                />
              </TableCell>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewProof(payment)}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedImage && (
        <PaymentProofModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          paymentReference={selectedImage.reference}
        />
      )}
    </>
  );
};
