import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Legend,
} from "recharts";

export interface ClienteDeuda {
  cliente: string;
  deuda: number;
}

interface ClientesDeudaParetoChartProps {
  data: ClienteDeuda[];
}

export function ClientesDeudaParetoChart({
  data,
}: ClientesDeudaParetoChartProps) {
  // Ordenar de mayor a menor y calcular porcentaje acumulado
  const sorted = [...data].sort((a, b) => b.deuda - a.deuda);
  const total = sorted.reduce((sum, c) => sum + c.deuda, 0);
  let acumulado = 0;
  const paretoData = sorted.map((c) => {
    acumulado += c.deuda;
    return {
      ...c,
      porcentaje: +((acumulado / total) * 100).toFixed(2),
    };
  });

  return (
    <ChartContainer
      config={{
        deuda: { color: "#f59e42", label: "Deuda" },
        pareto: { color: "#2563eb", label: "Acumulado (%)" },
      }}
      className="aspect-[2/1] max-h-56"
    >
      <BarChart
        data={paretoData}
        margin={{ top: 16, right: 32, left: 32, bottom: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cliente" />
        <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(v, name) => (name === "porcentaje" ? `${v}%` : `$${v}`)}
        />
        <Bar yAxisId="left" dataKey="deuda" fill="#f59e42" name="Deuda" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="porcentaje"
          stroke="#2563eb"
          strokeWidth={2}
          dot
          name="Acumulado (%)"
        />
        <Legend />
      </BarChart>
    </ChartContainer>
  );
}
