import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ClientAccount } from "@/lib/mockData";
import { generateAccountStatementPDF } from "@/lib/admin/accountStatementPDF";
import { toast } from "@/hooks/use-toast";

interface AccountStatementProps {
  client: ClientAccount;
}

export const AccountStatement: React.FC<AccountStatementProps> = ({
  client,
}) => {
  const handleDownloadPDF = () => {
    try {
      const doc = generateAccountStatementPDF(client);
      const fileName = `estado-cuenta-${client.code}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF generado exitosamente",
        description: "El estado de cuenta ha sido descargado",
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast({
        title: "Error al generar PDF",
        description:
          "No se pudo generar el documento. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Contenido existente del estado de cuenta */}

      {/* Botón de descarga */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Descargar Estado de Cuenta</span>
        </Button>
      </div>
    </div>
  );
};
