"use client";

import type { UploadSummary as UploadSummaryType } from "@/types";
import Card from "@/components/ui/Card";
import SuccessMessage from "@/components/ui/SuccessMessage";

interface UploadSummaryProps {
  summary: UploadSummaryType;
  onNewUpload: () => void;
}

export default function UploadSummary({ summary, onNewUpload }: UploadSummaryProps) {
  return (
    <div className="space-y-4">
      <SuccessMessage
        message={`Fichiers téléchargés et traités avec succès : ${summary.current_year_file.filename} (${summary.current_year}) et ${summary.previous_year_file.filename} (${summary.previous_year}).`}
      />

      {/* Two File Summaries Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Year */}
        <Card className="space-y-3">
          <h3 className="text-[15px]">Année précédente — {summary.previous_year}</h3>
          <div className="grid grid-cols-2 gap-3">
            <SummaryItem
              label="Fichier"
              value={summary.previous_year_file.filename}
              small
            />
            <SummaryItem
              label="Lignes filtrées"
              value={summary.previous_year_file.total_rows_filtered.toLocaleString("fr-FR")}
            />
            <SummaryItem
              label="Semaines"
              value={`S${summary.previous_year_file.weeks_available[0]} — S${summary.previous_year_file.weeks_available[summary.previous_year_file.weeks_available.length - 1]}`}
            />
            <SummaryItem
              label="Total lignes"
              value={summary.previous_year_file.total_rows.toLocaleString("fr-FR")}
            />
          </div>
        </Card>

        {/* Current Year */}
        <Card className="space-y-3">
          <h3 className="text-[15px]">Année en cours — {summary.current_year}</h3>
          <div className="grid grid-cols-2 gap-3">
            <SummaryItem
              label="Fichier"
              value={summary.current_year_file.filename}
              small
            />
            <SummaryItem
              label="Lignes filtrées"
              value={summary.current_year_file.total_rows_filtered.toLocaleString("fr-FR")}
            />
            <SummaryItem
              label="Semaines"
              value={`S${summary.current_year_file.weeks_available[0]} — S${summary.current_year_file.weeks_available[summary.current_year_file.weeks_available.length - 1]}`}
            />
            <SummaryItem
              label="Total lignes"
              value={summary.current_year_file.total_rows.toLocaleString("fr-FR")}
            />
          </div>
        </Card>
      </div>

      {/* Diseases Found */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-text-secondary">
            Maladies ciblées trouvées : {summary.diseases_found.length}
          </p>
          <p className="text-[13px] text-text-secondary">
            Provinces : {summary.provinces_count}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {summary.diseases_found.map((disease) => (
            <span
              key={disease}
              className="text-[13px] px-3 py-1 bg-primary-light text-primary-dark rounded-full"
            >
              {disease}
            </span>
          ))}
        </div>

        {/* Change files link */}
        <div className="pt-2 border-t border-surface-border">
          <button
            onClick={onNewUpload}
            className="text-[14px] text-primary hover:text-primary-dark transition-colors"
          >
            Charger d&apos;autres fichiers
          </button>
        </div>
      </Card>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <p className="text-[12px] text-text-muted">{label}</p>
      <p className={`font-bold text-text-primary ${small ? "text-[13px] truncate" : "text-[16px]"}`}>
        {value}
      </p>
    </div>
  );
}