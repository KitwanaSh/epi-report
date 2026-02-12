"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartContent } from "@/types";

interface ChartBlockProps {
  content: ChartContent;
}

export default function ChartBlock({ content }: ChartBlockProps) {
  const { title, x_label, y_bar_label, y_line_label, data } = content;

  // Don't render chart if no data
  if (!data || data.length === 0) {
    return (
      <div className="my-6 p-8 bg-surface-light rounded-card border border-surface-border text-center">
        <p className="text-text-muted text-[14px]">
          Aucune donnée disponible pour ce graphique.
        </p>
      </div>
    );
  }

  // Find max values for Y axis scaling
  const maxCases = Math.max(...data.map((d) => d.cases), 1);
  const maxLethality = Math.max(...data.map((d) => d.lethality), 1);

  return (
    <div className="my-6">
      {/* Chart Title */}
      {title && (
        <p className="text-[14px] font-bold text-text-primary mb-4 text-center">
          {title}
        </p>
      )}

      {/* Chart Container */}
      <div className="bg-surface-white rounded-card border border-surface-border shadow-card p-4">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E0E0E0"
              vertical={false}
            />

            {/* X Axis — Weeks */}
            <XAxis
              dataKey="week"
              tick={{ fontSize: 13, fontFamily: "Times New Roman, Arial, serif", fill: "#666666" }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              label={{
                value: x_label,
                position: "insideBottom",
                offset: -10,
                style: { fontSize: 13, fontFamily: "Times New Roman, Arial, serif", fill: "#666666" },
              }}
            />

            {/* Y Axis Left — Cases (Bars) */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 13, fontFamily: "Times New Roman, Arial, serif", fill: "#666666" }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              label={{
                value: y_bar_label,
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { fontSize: 13, fontFamily: "Times New Roman, Arial, serif", fill: "#666666" },
              }}
            />

            {/* Y Axis Right — Lethality (Line) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 13, fontFamily: "Times New Roman, Arial, serif", fill: "#666666" }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              label={{
                value: y_line_label,
                angle: 90,
                position: "insideRight",
                offset: 10,
                style: { fontSize: 13, fontFamily: "Times New Roman, Arial, serif", fill: "#666666" },
              }}
              domain={[0, Math.ceil(maxLethality * 1.2)]}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                fontFamily: "Times New Roman, Arial, serif",
                fontSize: 13,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: 8,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
              }}
              formatter={(value: number | undefined, name: string | undefined) => {
                if (value === undefined || name === undefined) return ["", ""];
                if (name === "Cas") return [value.toLocaleString("fr-FR"), name];
                if (name === "Décès") return [value.toLocaleString("fr-FR"), name];
                if (name === "Létalité (%)") return [`${value}%`, name];
                return [value, name];
              }}
              labelStyle={{
                fontWeight: "bold",
                marginBottom: 4,
              }}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{
                fontFamily: "Times New Roman, Arial, serif",
                fontSize: 13,
                paddingTop: 16,
              }}
            />

            {/* Bars — Cases */}
            <Bar
              yAxisId="left"
              dataKey="cases"
              name="Cas"
              fill="#0EA5E9"
              radius={[3, 3, 0, 0]}
              maxBarSize={50}
            />

            {/* Bars — Deaths */}
            <Bar
              yAxisId="left"
              dataKey="deaths"
              name="Décès"
              fill="#1A1A1A"
              radius={[3, 3, 0, 0]}
              maxBarSize={50}
            />

            {/* Line — Lethality */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="lethality"
              name="Létalité (%)"
              stroke="#DC2626"
              strokeWidth={2}
              dot={{
                fill: "#DC2626",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#DC2626",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 6,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}