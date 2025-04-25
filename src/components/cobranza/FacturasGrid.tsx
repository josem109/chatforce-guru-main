import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Factura {
  numero: string;
  fecha: string;
  montoOriginal: number;
  montoPendiente: number;
}

interface FacturasGridProps {
  selectedFacturas: string[];
  onSelectionChange: (selected: string[]) => void;
}

// Datos ficticios para las facturas
const facturasMock: Factura[] = [
  {
    numero: "F001",
    fecha: "2023-01-15",
    montoOriginal: 1000,
    montoPendiente: 1000,
  },
  {
    numero: "F002",
    fecha: "2023-02-20",
    montoOriginal: 2000,
    montoPendiente: 2000,
  },
  {
    numero: "F003",
    fecha: "2023-03-10",
    montoOriginal: 1500,
    montoPendiente: 1500,
  },
  {
    numero: "F004",
    fecha: "2023-04-05",
    montoOriginal: 3000,
    montoPendiente: 3000,
  },
  {
    numero: "F005",
    fecha: "2023-05-12",
    montoOriginal: 2500,
    montoPendiente: 2500,
  },
];

export const FacturasGrid: React.FC<FacturasGridProps> = ({
  selectedFacturas,
  onSelectionChange,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(facturasMock.map((factura) => factura.numero));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectFactura = (numero: string) => {
    if (selectedFacturas.includes(numero)) {
      onSelectionChange(selectedFacturas.filter((n) => n !== numero));
    } else {
      onSelectionChange([...selectedFacturas, numero]);
    }
  };

  const totalSeleccionado = facturasMock
    .filter((factura) => selectedFacturas.includes(factura.numero))
    .reduce((sum, factura) => sum + factura.montoPendiente, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handleSelectAll}>
          {selectAll ? "Deseleccionar Todo" : "Seleccionar Todo"}
        </Button>
        <div className="text-sm text-muted-foreground">
          Total Seleccionado: ${totalSeleccionado.toFixed(2)}
        </div>
      </div>

      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seleccionar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto Original
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto Pendiente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facturasMock.map((factura) => (
              <tr key={factura.numero}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedFacturas.includes(factura.numero)}
                    onCheckedChange={() => handleSelectFactura(factura.numero)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {factura.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {factura.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${factura.montoOriginal.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${factura.montoPendiente.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
