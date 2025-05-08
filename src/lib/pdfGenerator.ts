import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Factura {
  numero: string;
  fecha: string;
  montoOriginal: number;
  montoPendiente: number;
}

interface Pago {
  id: string;
  banco: string;
  referencia: string;
  tipoPago: string;
  monto: number;
  fechaValor: string;
  archivo: File | null;
}

interface GeneratePDFParams {
  facturas: Factura[];
  pagos: Pago[];
  montoTotal: number;
}

export const generatePDF = async ({
  facturas,
  pagos,
  montoTotal,
}: GeneratePDFParams): Promise<string> => {
  try {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text("Comprobante de Cobranza", 20, 20);

    // Información general
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 40);

    // Facturas procesadas
    doc.setFontSize(14);
    doc.text("Facturas Procesadas", 20, 60);

    const facturasData = facturas.map((factura) => [
      factura.numero,
      factura.fecha,
      `$${factura.montoPendiente.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Número", "Fecha", "Monto"]],
      body: facturasData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Pagos registrados
    doc.setFontSize(14);
    doc.text("Pagos Registrados", 20, (doc as any).lastAutoTable.finalY + 20);

    const pagosData = pagos.map((pago) => [
      pago.banco,
      pago.referencia,
      pago.tipoPago,
      pago.fechaValor,
      `$${pago.monto.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [["Banco", "Referencia", "Tipo", "Fecha Valor", "Monto"]],
      body: pagosData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Monto total
    doc.setFontSize(14);
    doc.text(
      `Monto Total: $${montoTotal.toFixed(2)}`,
      20,
      (doc as any).lastAutoTable.finalY + 20
    );

    // Nota de validación
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      "Nota: Esta cobranza debe ser validada y aprobada por el equipo de finanzas.",
      20,
      (doc as any).lastAutoTable.finalY + 40
    );

    // Restaurar color de texto
    doc.setTextColor(0, 0, 0);

    // Generar PDF como base64
    return doc.output("datauristring");
  } catch (error) {
    console.error("Error generando PDF:", error);
    throw new Error("No se pudo generar el comprobante PDF");
  }
};
