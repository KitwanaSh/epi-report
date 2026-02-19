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
  ReferenceLine,
  Cell,
} from "recharts";
import type { ChartContent } from "@/types";

interface ChartBlockProps {
  content: ChartContent;
}

// Colors
const COLOR_PREVIOUS_YEAR = "#CBD5E1";
const COLOR_CURRENT_YEAR = "#0EA5E9";
const COLOR_BORROWED = "#93C5FD";
const COLOR_LETHALITY = "#DC2626";
const COLOR_SEPARATOR = "#1A1A1A";

export default function ChartBlock({ content }: ChartBlockProps) {
  const {
    title,
    x_label,
    y_bar_label,
    y_line_label,
    current_year,
    previous_year,
    separator_index,
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

  // Build chart data with unique X axis keys
  const chartData = data.map((point, index) => ({
    ...point,
    // Create unique key for X axis since week labels can repeat across groups
    xKey: index,
    // Display label for X axis
    displayLabel: point.label,
    // Bar value (single bar per data point, colored by group)
    barCases: point.cases,
    barDeaths: point.deaths,
  }));

  // Calculate max values for Y axis
  const maxCases = Math.max(...data.map((d) => d.cases), 1);
  const maxLethality = Math.max(...data.map((d) => d.lethality), 1);

  // Separator position (between last previous_year point and first current_trend point)
  const separatorPosition = separator_index - 0.5;

  return (
    <div className="my-6">
      {/* Chart Title */}
      {title && (
        <p className="text-[14px] font-bold text-text-primary mb-4 text-center">
          {title}
        </p>
      )}

      {/* Year Group Labels */}
      <div className="flex justify-center gap-0 mb-2">
        <div className="flex-1 text-center">
          <span className="text-[13px] font-bold text-text-secondary">
            {previous_year}
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[13px] font-bold text-text-primary">
            {current_year}
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-surface-white rounded-card border border-surface-border shadow-card p-4">
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E0E0E0"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="xKey"
              tick={({ x, y, payload }: any) => {
                const point = chartData[payload.value];
                if (!point) return <g />;

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={14}
                      textAnchor="middle"
                      fill={
                        point.group === "previous_year"
                          ? "#94A3B8"
                          : point.borrowed
                            ? "#60A5FA"
                            : "#1A1A1A"
                      }
                      fontSize={12}
                      fontFamily="Times New Roman, Arial, serif"
                      fontWeight={point.group === "current_trend" && !point.borrowed ? "bold" : "normal"}
                    >
                      {point.displayLabel}
                    </text>
                  </g>
                );
              }}
              axisLine={{ stroke: "#E0E0E0" }}
              tickLine={{ stroke: "#E0E0E0" }}
              interval={0}
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

            {/* Y Axis Left — Cases */}
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

            {/* Y Axis Right — Lethality */}
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

            {/* Vertical Separator Line */}
            <ReferenceLine
              yAxisId="left"
              x={separatorPosition}
              stroke={COLOR_SEPARATOR}
              strokeWidth={2}
              strokeDasharray="6 4"
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
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                const point = payload[0]?.payload;
                if (!point) return null;

                const yearLabel = point.year;
                const groupLabel =
                  point.group === "previous_year"
                    ? `${previous_year}`
                    : point.borrowed
                      ? `${point.year} (tendance)`
                      : `${current_year}`;

                return (
                  <div
                    className="bg-white border border-surface-border rounded-card shadow-card-md p-3"
                    style={{ fontFamily: "Times New Roman, Arial, serif" }}
                  >
                    <p className="font-bold text-[13px] mb-1">
                      {point.displayLabel} — {groupLabel}
                    </p>
                    <p className="text-[13px] text-text-secondary">
                      Cas : {point.cases.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-[13px] text-text-secondary">
                      Décès : {point.deaths.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-[13px]" style={{ color: COLOR_LETHALITY }}>
                      Létalité : {point.lethality}%
                    </p>
                  </div>
                );
              }}
            />

            {/* Bars — Cases (colored by group) */}
            <Bar
              yAxisId="left"
              dataKey="barCases"
              name="Cas"
              radius={[3, 3, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.group === "previous_year"
                      ? COLOR_PREVIOUS_YEAR
                      : entry.borrowed
                        ? COLOR_BORROWED
                        : COLOR_CURRENT_YEAR
                  }
                />
              ))}
            </Bar>

            {/* Line — Lethality (single continuous line) */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="lethality"
              name="Létalité (%)"
              stroke={COLOR_LETHALITY}
              strokeWidth={2}
              dot={{
                fill: COLOR_LETHALITY,
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: COLOR_LETHALITY,
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 6,
              }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="mt-3 pt-3 border-t border-surface-border">
          <div className="flex flex-wrap justify-center gap-5 text-[12px] text-text-muted">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-3 rounded-sm"
                style={{ backgroundColor: COLOR_PREVIOUS_YEAR }}
              />
              Cas {previous_year}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-3 rounded-sm"
                style={{ backgroundColor: COLOR_CURRENT_YEAR }}
              />
              Cas {current_year}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-3 rounded-sm"
                style={{ backgroundColor: COLOR_BORROWED }}
              />
              Tendance (fin {previous_year})
            </span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-8 border-t-2"
                style={{ borderColor: COLOR_LETHALITY }}
              />
              Létalité (%)
            </span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-8 border-t-2 border-dashed"
                style={{ borderColor: COLOR_SEPARATOR }}
              />
              Séparateur
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}