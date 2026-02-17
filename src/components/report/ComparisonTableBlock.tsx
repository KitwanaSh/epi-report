"use client";

import type { ComparisonTableContent } from "@/types";

interface ComparisonTableBlockProps {
  content: ComparisonTableContent;
}

export default function ComparisonTableBlock({
  content,
}: ComparisonTableBlockProps) {
  const { title, current_year, previous_year, weeks_shown, rows } = content;

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
        <table className="w-full border-collapse text-[13px]">
          {/* Header Row 1 — Main Groups */}
          <thead>
            <tr className="bg-primary text-white">
              {/* Disease Name */}
              <th
                rowSpan={2}
                className="px-3 py-2 text-left font-bold border-r border-primary-dark align-bottom"
              >
                Maladie
              </th>

              {/* Previous Year Cumulative */}
              <th
                colSpan={2}
                className="px-3 py-2 text-center font-bold border-r border-primary-dark"
              >
                Cumul S1-S{weeks_shown[weeks_shown.length - 1]} / {previous_year}
              </th>

              {/* Current Year Cumulative */}
              <th
                colSpan={2}
                className="px-3 py-2 text-center font-bold border-r border-primary-dark"
              >
                Cumul S1-S{weeks_shown[weeks_shown.length - 1]} / {current_year}
              </th>

              {/* Weekly Breakdown */}
              {weeks_shown.map((week) => (
                <th
                  key={week}
                  colSpan={2}
                  className="px-3 py-2 text-center font-bold border-r border-primary-dark last:border-r-0"
                >
                  Semaine {week}
                </th>
              ))}
            </tr>

            {/* Header Row 2 — Sub-columns */}
            <tr className="bg-primary-dark text-white text-[12px]">
              {/* Previous Year sub-columns */}
              <th className="px-2 py-1.5 text-center border-r border-primary">
                Cas
              </th>
              <th className="px-2 py-1.5 text-center border-r border-primary">
                Décès
              </th>

              {/* Current Year sub-columns */}
              <th className="px-2 py-1.5 text-center border-r border-primary">
                Cas
              </th>
              <th className="px-2 py-1.5 text-center border-r border-primary">
                Décès
              </th>

              {/* Weekly sub-columns */}
              {weeks_shown.map((week) => (
                <WeekSubHeaders key={week} />
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIndex) => {
              // Determine if cumulative current > previous (year-over-year increase)
              const yearIncrease =
                row.cumul_current_cases > row.cumul_previous_cases;
              const yearDecrease =
                row.cumul_current_cases < row.cumul_previous_cases;

              return (
                <tr
                  key={rowIndex}
                  className={`
                    border-b border-surface-border
                    ${rowIndex % 2 === 1 ? "bg-surface-light" : "bg-white"}
                    hover:bg-primary-light transition-colors
                  `}
                >
                  {/* Disease Name */}
                  <td className="px-3 py-2 font-bold text-text-primary border-r border-surface-border">
                    {row.maladie}
                  </td>

                  {/* Previous Year Cumulative */}
                  <td className="px-2 py-2 text-center text-text-secondary border-r border-surface-border">
                    {formatNumber(row.cumul_previous_cases)}
                  </td>
                  <td className="px-2 py-2 text-center text-text-secondary border-r border-surface-border">
                    {formatNumber(row.cumul_previous_deaths)}
                  </td>

                  {/* Current Year Cumulative */}
                  <td
                    className={`px-2 py-2 text-center font-bold border-r border-surface-border ${
                      yearIncrease
                        ? "text-status-error"
                        : yearDecrease
                          ? "text-status-success"
                          : "text-text-primary"
                    }`}
                  >
                    {formatNumber(row.cumul_current_cases)}
                  </td>
                  <td
                    className={`px-2 py-2 text-center font-bold border-r border-surface-border ${
                      row.cumul_current_deaths > row.cumul_previous_deaths
                        ? "text-status-error"
                        : "text-text-primary"
                    }`}
                  >
                    {formatNumber(row.cumul_current_deaths)}
                  </td>

                  {/* Weekly Breakdown */}
                  {row.weekly_breakdown.map((wb, wbIndex) => (
                    <WeekCells
                      key={wbIndex}
                      cases={wb.cases}
                      deaths={wb.deaths}
                    />
                  ))}
                </tr>
              );
            })}

            {/* Totals Row */}
            <TotalsRow rows={rows} weeksShown={weeks_shown} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================
// Sub-Components
// =============================================================

function WeekSubHeaders() {
  return (
    <>
      <th className="px-2 py-1.5 text-center border-r border-primary">
        Cas
      </th>
      <th className="px-2 py-1.5 text-center border-r border-primary last:border-r-0">
        Déc.
      </th>
    </>
  );
}

function WeekCells({ cases, deaths }: { cases: number; deaths: number }) {
  return (
    <>
      <td className="px-2 py-2 text-center border-r border-surface-border">
        {formatNumber(cases)}
      </td>
      <td className="px-2 py-2 text-center border-r border-surface-border last:border-r-0">
        {deaths > 0 ? (
          <span className="text-status-error font-bold">
            {formatNumber(deaths)}
          </span>
        ) : (
          <span className="text-text-muted">{formatNumber(deaths)}</span>
        )}
      </td>
    </>
  );
}

function TotalsRow({
  rows,
  weeksShown,
}: {
  rows: ComparisonTableBlockProps["content"]["rows"];
  weeksShown: number[];
}) {
  const totalPrevCases = rows.reduce(
    (sum, r) => sum + r.cumul_previous_cases,
    0
  );
  const totalPrevDeaths = rows.reduce(
    (sum, r) => sum + r.cumul_previous_deaths,
    0
  );
  const totalCurrCases = rows.reduce(
    (sum, r) => sum + r.cumul_current_cases,
    0
  );
  const totalCurrDeaths = rows.reduce(
    (sum, r) => sum + r.cumul_current_deaths,
    0
  );

  // Weekly totals
  const weeklyTotals = weeksShown.map((_, weekIdx) => {
    const totalCases = rows.reduce(
      (sum, r) => sum + (r.weekly_breakdown[weekIdx]?.cases || 0),
      0
    );
    const totalDeaths = rows.reduce(
      (sum, r) => sum + (r.weekly_breakdown[weekIdx]?.deaths || 0),
      0
    );
    return { cases: totalCases, deaths: totalDeaths };
  });

  return (
    <tr className="bg-primary-light font-bold border-t-2 border-primary">
      <td className="px-3 py-2 text-text-primary border-r border-surface-border">
        TOTAL
      </td>
      <td className="px-2 py-2 text-center border-r border-surface-border">
        {formatNumber(totalPrevCases)}
      </td>
      <td className="px-2 py-2 text-center border-r border-surface-border">
        {formatNumber(totalPrevDeaths)}
      </td>
      <td className="px-2 py-2 text-center border-r border-surface-border">
        {formatNumber(totalCurrCases)}
      </td>
      <td className="px-2 py-2 text-center border-r border-surface-border">
        {formatNumber(totalCurrDeaths)}
      </td>
      {weeklyTotals.map((wt, idx) => (
        <WeekCells key={idx} cases={wt.cases} deaths={wt.deaths} />
      ))}
    </tr>
  );
}

// Fix the type for TotalsRow
interface ComparisonTableBlockProps {
  content: ComparisonTableContent;
}

function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}