"use client";

import type { TableContent } from "@/types";

interface TableBlockProps {
  content: TableContent;
}

export default function TableBlock({ content }: TableBlockProps) {
  const { title, columns, rows } = content;

  return (
    <div className="my-6">
      {/* Table Title */}
      {title && (
        <p className="text-[14px] font-bold text-text-primary mb-3">
          {title}
        </p>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-card shadow-card border border-surface-border">
        <table className="report-table">
          {/* Header */}
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIndex) => {
              const isLastRow = rowIndex === rows.length - 1;
              const isTotalRow = row.maladie === "TOTAL";

              return (
                <tr
                  key={rowIndex}
                  className={isTotalRow ? "font-bold bg-primary-light" : ""}
                >
                  {/* Disease Name */}
                  <td className={isTotalRow ? "font-bold" : ""}>
                    {row.maladie}
                  </td>

                  {/* Cases */}
                  <td className="text-right">
                    {formatNumber(row.cas)}
                  </td>

                  {/* Deaths */}
                  <td className="text-right">
                    {formatNumber(row.deces)}
                  </td>

                  {/* Lethality */}
                  <td className="text-right">
                    {row.letalite > 0 ? `${row.letalite}%` : "0%"}
                  </td>

                  {/* Observation */}
                  <td>
                    <ObservationBadge observation={row.observation} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Format numbers with French locale (space as thousands separator)
 */
function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

/**
 * Render observation with appropriate styling
 */
function ObservationBadge({ observation }: { observation: string }) {
  if (!observation || observation === "") {
    return <span className="text-text-muted">—</span>;
  }

  if (observation === "RAS") {
    return (
      <span className="text-[13px] text-text-muted">
        RAS
      </span>
    );
  }

  // Determine color based on content
  let colorClass = "text-text-secondary";

  if (observation.toLowerCase().includes("hausse")) {
    colorClass = "text-status-error";
  } else if (observation.toLowerCase().includes("baisse")) {
    colorClass = "text-status-success";
  } else if (observation.toLowerCase().includes("stable")) {
    colorClass = "text-primary-dark";
  } else if (observation.toLowerCase().includes("nouveaux") || observation.toLowerCase().includes("premiers")) {
    colorClass = "text-status-error";
  }

  return (
    <span className={`text-[13px] ${colorClass}`}>
      {observation}
    </span>
  );
}