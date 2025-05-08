import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ClientAccount, Invoice, Payment } from "@/lib/mockData";

export const generateAccountStatementPDF = (client: ClientAccount) => {
  const doc = new jsPDF();

  // Configurar fuente
  doc.setFont("helvetica");

  // Obtener el ancho de la página
  const pageWidth = doc.internal.pageSize.getWidth();

  // Función helper para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Función helper para formatear fecha
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let currentY = 20; // Inicializamos la posición Y

  // Encabezado
  doc.setFontSize(20);
  doc.text("Estado de Cuenta", pageWidth / 2, currentY, { align: "center" });
  currentY += 20;

  // Información del cliente
  doc.setFontSize(12);
  doc.text("Información del Cliente", 14, currentY);
  currentY += 5;

  const clientInfo = [
    ["Cliente:", client.name],
    ["Código:", client.code],
    ["Email:", client.email],
    ["Teléfono:", client.phone],
    ["Fecha de emisión:", formatDate(new Date())],
  ];

  autoTable(doc, {
    startY: currentY,
    body: clientInfo,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

  // Resumen de cuenta
  doc.setFontSize(12);
  doc.text("Resumen de Cuenta", 14, currentY);

  const accountSummary = [
    ["Balance actual:", formatCurrency(client.currentBalance)],
    ["Límite de crédito:", formatCurrency(client.creditLimit)],
    [
      "Crédito disponible:",
      formatCurrency(client.creditLimit - client.currentBalance),
    ],
    ["Última compra:", formatDate(client.lastPurchaseDate)],
  ];

  autoTable(doc, {
    startY: currentY + 5,
    body: accountSummary,
    theme: "striped",
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [66, 139, 202],
    },
  });

  currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

  // Facturas pendientes
  doc.setFontSize(12);
  doc.text("Facturas Pendientes", 14, currentY);

  const pendingInvoices = client.invoices
    .filter((inv) => inv.status !== "paid")
    .map((invoice) => [
      invoice.number,
      formatDate(invoice.date),
      formatDate(invoice.dueDate),
      formatCurrency(invoice.amount),
      formatCurrency(invoice.balance),
      invoice.status === "overdue" ? "Vencida" : "Pendiente",
    ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Número", "Fecha", "Vencimiento", "Monto", "Balance", "Estado"]],
    body: pendingInvoices,
    theme: "striped",
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [231, 76, 60],
    },
  });

  currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

  // Últimos pagos
  doc.setFontSize(12);
  doc.text("Últimos Pagos", 14, currentY);

  const recentPayments = client.payments
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map((payment) => [
      formatDate(payment.date),
      payment.reference,
      payment.method,
      payment.invoiceNumber,
      formatCurrency(payment.amount),
    ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Fecha", "Referencia", "Método", "Factura", "Monto"]],
    body: recentPayments,
    theme: "striped",
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [46, 204, 113],
    },
  });

  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
};
