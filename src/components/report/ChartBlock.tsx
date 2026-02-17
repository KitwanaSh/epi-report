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
  const {
    title,
    x_label,
    y_bar_label,
    y_line_label,
    current_year,
    previous_year,
    data,
  } = content;

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
  const allCases = data.flatMap((d) => [
    d.current_year_cases,
    d.previous_year_cases,
  ]);
  const allLethality = data.flatMap((d) => [
    d.current_year_lethality,
    d.previous_year_lethality,
  ]);
  const maxLethality = Math.max(...allLethality, 1);

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
        <ResponsiveContainer width="100%" height={380}>
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
              tick={{
                fontSize: 13,
                fontFamily: "Times New Roman, Arial, serif",
                fill: "#666666",
              }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              label={{
                value: x_label,
                position: "insideBottom",
                offset: -10,
                style: {
                  fontSize: 13,
                  fontFamily: "Times New Roman, Arial, serif",
                  fill: "#666666",
                },
              }}
            />

            {/* Y Axis Left — Cases (Bars) */}
            <YAxis
              yAxisId="left"
              tick={{
                fontSize: 13,
                fontFamily: "Times New Roman, Arial, serif",
                fill: "#666666",
              }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              label={{
                value: y_bar_label,
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: {
                  fontSize: 13,
                  fontFamily: "Times New Roman, Arial, serif",
                  fill: "#666666",
                },
              }}
            />

            {/* Y Axis Right — Lethality (Lines) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{
                fontSize: 13,
                fontFamily: "Times New Roman, Arial, serif",
                fill: "#666666",
              }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              label={{
                value: y_line_label,
                angle: 90,
                position: "insideRight",
                offset: 10,
                style: {
                  fontSize: 13,
                  fontFamily: "Times New Roman, Arial, serif",
                  fill: "#666666",
                },
              }}
              domain={[0, Math.ceil(maxLethality * 1.3)]}
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
              formatter={(value: number, name: string) => {
                if (name.includes("Létalité")) return [`${value}%`, name];
                return [value.toLocaleString("fr-FR"), name];
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
                fontSize: 12,
                paddingTop: 16,
              }}
            />

            {/* ===== PREVIOUS YEAR (left bars, first in order) ===== */}

            {/* Bars — Previous Year Cases */}
            <Bar
              yAxisId="left"
              dataKey="previous_year_cases"
              name={`Cas ${previous_year}`}
              fill="#CBD5E1"
              radius={[3, 3, 0, 0]}
              maxBarSize={35}
            />

            {/* ===== CURRENT YEAR (right bars, second in order) ===== */}

            {/* Bars — Current Year Cases */}
            <Bar
              yAxisId="left"
              dataKey="current_year_cases"
              name={`Cas ${current_year}`}
              fill="#0EA5E9"
              radius={[3, 3, 0, 0]}
              maxBarSize={35}
            />

            {/* ===== LETHALITY LINES ===== */}

            {/* Line — Previous Year Lethality */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="previous_year_lethality"
              name={`Létalité ${previous_year} (%)`}
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{
                fill: "#94A3B8",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#94A3B8",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 6,
              }}
            />

            {/* Line — Current Year Lethality */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="current_year_lethality"
              name={`Létalité ${current_year} (%)`}
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

        {/* Chart Legend Explanation */}
        <div className="mt-3 pt-3 border-t border-surface-border">
          <div className="flex flex-wrap justify-center gap-6 text-[12px] text-text-muted">
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-3 bg-[#CBD5E1] rounded-sm" />
              Cas {previous_year}
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-3 bg-[#0EA5E9] rounded-sm" />
              Cas {current_year}
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-8 border-t-2 border-dashed border-[#94A3B8]" />
              Létalité {previous_year}
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-8 border-t-2 border-[#DC2626]" />
              Létalité {current_year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}