import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ResumenCobranzaProps {
  facturas: Array<{
    numero: string;
    fecha: string;
    montoOriginal: number;
    montoPendiente: number;
  }>;
  pagos: Array<{
    id: string;
    banco: string;
    referencia: string;
    tipoPago: string;
    monto: number;
    archivo: File | null;
  }>;
  montoTotal: number;
}

export const ResumenCobranza: React.FC<ResumenCobranzaProps> = ({
  facturas,
  pagos,
  montoTotal,
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Resumen de Cobranza</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Facturas Seleccionadas</h4>
          <div className="bg-muted/50 rounded-lg p-3">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground">
                    Número
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.numero}>
                    <td className="text-sm">{factura.numero}</td>
                    <td className="text-sm">{factura.fecha}</td>
                    <td className="text-sm text-right">
                      ${factura.montoPendiente.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-2">Pagos Registrados</h4>
          <div className="bg-muted/50 rounded-lg p-3">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground">
                    Banco
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground">
                    Referencia
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td className="text-sm">{pago.banco}</td>
                    <td className="text-sm">{pago.referencia}</td>
                    <td className="text-sm">{pago.tipoPago}</td>
                    <td className="text-sm text-right">
                      ${pago.monto.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Monto Total Pagado:</span>
          <span className="text-lg font-semibold">
            ${montoTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};
