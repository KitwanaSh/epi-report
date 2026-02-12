"use client";

import type { ContentBlock, TableContent, ChartContent } from "@/types";
import MarkdownBlock from "./MarkdownBlock";
import TableBlock from "./TableBlock";
import ChartBlock from "./ChartBlock";

interface ReportViewerProps {
  blocks: ContentBlock[];
  year: number;
  week: number;
}

export default function ReportViewer({ blocks, year, week }: ReportViewerProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print Button */}
      <div className="flex justify-end mb-3 no-print">
        <button
          onClick={handlePrint}
          className="text-[13px] text-primary hover:text-primary-dark transition-colors"
        >
          Imprimer / Enregistrer en PDF
        </button>
      </div>

      {/* Report Document */}
      <div className="bg-surface-white rounded-card shadow-card-md border border-surface-border">
        {/* Report Header Bar */}
        <div className="px-8 py-4 border-b border-surface-border bg-surface-light rounded-t-card">
          <p className="text-[13px] text-text-muted text-center">
            République Démocratique du Congo — Ministère de la Santé — Semaine épidémiologique S{week}/{year}
          </p>
        </div>

        {/* Report Content */}
        <div className="px-8 py-6">
          {blocks.map((block, index) => (
            <ReportBlock key={index} block={block} />
          ))}
        </div>

        {/* Report Footer */}
        <div className="px-8 py-4 border-t border-surface-border bg-surface-light rounded-b-card">
          <p className="text-[12px] text-text-muted text-center">
            Rapport généré automatiquement — Système EPI-RDC — S{week}/{year}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a single content block based on its type.
 */
function ReportBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "markdown":
      return <MarkdownBlock content={block.content as string} />;

    case "table":
      return <TableBlock content={block.content as TableContent} />;

    case "chart":
      return <ChartBlock content={block.content as ChartContent} />;

    default:
      return null;
  }
}