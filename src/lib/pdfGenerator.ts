import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface GeneratePDFParams {
  facturas: Array<{
    numero: string;
    fecha: string;
    montoPendiente: number;
  }>;
  pagos: Array<{
    banco: string;
    referencia: string;
    tipoPago: string;
    monto: number;
  }>;
  montoTotal: number;
  fecha: string;
}

export const generatePDF = async ({
  facturas,
  pagos,
  montoTotal,
  fecha,
}: GeneratePDFParams): Promise<string> => {
  try {
    // Crear nuevo documento PDF
    const doc = new jsPDF();

    // Configurar fuente
    doc.setFont("helvetica");

    // Título
    doc.setFontSize(20);
    doc.text("Comprobante de Cobranza", 105, 20, { align: "center" });

    // Información general
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(fecha).toLocaleDateString()}`, 20, 40);
    doc.text(`Número de Comprobante: ${Date.now()}`, 20, 50);

    // Facturas
    doc.setFontSize(14);
    doc.text("Facturas Procesadas", 20, 70);

    const facturasData = facturas.map((factura) => [
      factura.numero,
      factura.fecha,
      `$${factura.montoPendiente.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Número", "Fecha", "Monto"]],
      body: facturasData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Pagos
    const finalY = (doc as any).lastAutoTable.finalY || 75;
    doc.setFontSize(14);
    doc.text("Pagos Registrados", 20, finalY + 20);

    const pagosData = pagos.map((pago) => [
      pago.banco,
      pago.referencia,
      pago.tipoPago,
      `$${pago.monto.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: finalY + 25,
      head: [["Banco", "Referencia", "Tipo", "Monto"]],
      body: pagosData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Total
    const finalY2 = (doc as any).lastAutoTable.finalY || finalY + 25;
    doc.setFontSize(14);
    doc.text(`Monto Total: $${montoTotal.toFixed(2)}`, 20, finalY2 + 20);

    // Firma y sello
    doc.setFontSize(12);
    doc.text("_____________________", 40, finalY2 + 50);
    doc.text("Firma Autorizada", 50, finalY2 + 60);

    doc.text("_____________________", 150, finalY2 + 50);
    doc.text("Sello", 165, finalY2 + 60);

    // Nota al pie
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Color gris para la nota
    const nota =
      "Nota: Esta cobranza debe ser validada y aprobada por el equipo de finanzas.";
    const pageHeight = doc.internal.pageSize.height;
    doc.text(nota, 20, pageHeight - 20, {
      maxWidth: doc.internal.pageSize.width - 40,
    });
    doc.setTextColor(0, 0, 0); // Restaurar color negro para futuros textos

    // Convertir a base64
    const pdfBase64 = doc.output("datauristring");
    return pdfBase64;
  } catch (error) {
    console.error("Error generando PDF:", error);
    throw new Error("Error al generar el PDF");
  }
};
