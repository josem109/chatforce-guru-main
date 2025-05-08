import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface CobranzaDia {
  dia: string;
  monto: number;
}

interface CobranzaLineChartProps {
  data: CobranzaDia[];
}

export function CobranzaLineChart({ data }: CobranzaLineChartProps) {
  return (
    <ChartContainer
      config={{ cobranza: { color: "#2563eb", label: "Cobranza" } }}
      className="aspect-[2/1] max-h-56"
    >
      <LineChart
        data={data}
        layout="horizontal"
        margin={{ top: 16, right: 32, left: 32, bottom: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="dia" />
        <YAxis type="number" tickFormatter={(v) => `$${v}`} />
        <Tooltip formatter={(v) => `$${v}`} />
        <Line
          type="monotone"
          dataKey="monto"
          stroke="#2563eb"
          strokeWidth={3}
          dot
        />
      </LineChart>
    </ChartContainer>
  );
}
