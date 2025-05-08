import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AccountStatusItem {
  clientName: string;
  invoiceNumber: string;
  dueDate: Date | string;
  originalAmount: number;
  pendingAmount: number;
}

interface AccountStatusGridProps {
  items: AccountStatusItem[];
  onDownloadPDF?: () => void;
}

export const AccountStatusGrid: React.FC<AccountStatusGridProps> = ({
  items = [], // Valor por defecto
  onDownloadPDF,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha inválida";
    }
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No hay información de estado de cuenta disponible.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>No. Factura</TableHead>
            <TableHead>Fecha Vencimiento</TableHead>
            <TableHead className="text-right">Monto Original</TableHead>
            <TableHead className="text-right">Monto Pendiente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.clientName}</TableCell>
              <TableCell>{item.invoiceNumber}</TableCell>
              <TableCell>{formatDate(item.dueDate)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.originalAmount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.pendingAmount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {onDownloadPDF && (
        <div className="flex justify-end">
          <Button
            onClick={onDownloadPDF}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Descargar PDF</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountStatusGrid;
