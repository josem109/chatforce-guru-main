import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PendingPayment } from "@/lib/mockData";

interface ProcessedPaymentSummary {
  approved: PendingPayment[];
  rejected: PendingPayment[];
  totalApproved: number;
  totalRejected: number;
}

export const generatePaymentProcessSummary = (
  summary: ProcessedPaymentSummary
) => {
  // Crear el documento PDF
  const doc = new jsPDF();

  // Configurar fuente para caracteres especiales
  doc.setFont("helvetica");

  // Obtener el ancho de la página
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título y fecha
  doc.setFontSize(16);
  doc.text("Resumen de Procesamiento de Pagos", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(11);
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Fecha: ${currentDate}`, pageWidth / 2, 30, { align: "center" });

  // Resumen general
  const summaryData = [
    [
      "Total de pagos procesados",
      `${summary.approved.length + summary.rejected.length}`,
    ],
    ["Pagos aprobados", `${summary.approved.length}`],
    ["Pagos rechazados", `${summary.rejected.length}`],
    ["Monto total aprobado", `$${summary.totalApproved.toFixed(2)}`],
    ["Monto total rechazado", `$${summary.totalRejected.toFixed(2)}`],
  ];

  // Tabla de resumen
  autoTable(doc, {
    startY: 40,
    head: [["Concepto", "Valor"]],
    body: summaryData,
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    theme: "grid",
  });

  // Pagos aprobados
  if (summary.approved.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Cliente", "Referencia", "Método", "Fecha", "Monto"]],
      body: summary.approved.map((payment) => [
        payment.clientName,
        payment.reference,
        payment.paymentMethod,
        new Date(payment.date).toLocaleDateString("es-ES"),
        `$${payment.amount.toFixed(2)}`,
      ]),
      headStyles: {
        fillColor: [46, 204, 113],
        textColor: 255,
      },
      styles: {
        fontSize: 9,
      },
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text("Pagos Aprobados", 14, data.settings.startY - 10);
      },
    });
  }

  // Pagos rechazados
  if (summary.rejected.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Cliente", "Referencia", "Método", "Fecha", "Monto", "Motivo"]],
      body: summary.rejected.map((payment) => [
        payment.clientName,
        payment.reference,
        payment.paymentMethod,
        new Date(payment.date).toLocaleDateString("es-ES"),
        `$${payment.amount.toFixed(2)}`,
        payment.comments || "No especificado",
      ]),
      headStyles: {
        fillColor: [231, 76, 60],
        textColor: 255,
      },
      styles: {
        fontSize: 9,
      },
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text("Pagos Rechazados", 14, data.settings.startY - 10);
      },
    });
  }

  // Agregar pie de página con numeración
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
};
