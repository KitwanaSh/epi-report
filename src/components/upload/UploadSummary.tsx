"use client";

import type { DataSummary } from "@/types";
import Card from "@/components/ui/Card";
import SuccessMessage from "@/components/ui/SuccessMessage";

interface UploadSummaryProps {
  summary: DataSummary;
  onNewUpload: () => void;
}

export default function UploadSummary({ summary, onNewUpload }: UploadSummaryProps) {
  return (
    <div className="space-y-4">
      <SuccessMessage
        message={`Fichier "${summary.filename}" téléchargé et traité avec succès.`}
      />

      <Card className="space-y-4">
        <h3 className="text-[16px]">Résumé des données</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SummaryItem
            label="Lignes totales"
            value={summary.total_rows.toLocaleString("fr-FR")}
          />
          <SummaryItem
            label="Lignes filtrées"
            value={summary.total_rows_filtered.toLocaleString("fr-FR")}
          />
          <SummaryItem
            label="Année"
            value={String(summary.year)}
          />
          <SummaryItem
            label="Semaines disponibles"
            value={`S${summary.weeks_available[0]} — S${summary.weeks_available[summary.weeks_available.length - 1]}`}
          />
          <SummaryItem
            label="Provinces"
            value={String(summary.provinces_count)}
          />
          <SummaryItem
            label="Maladies ciblées"
            value={String(summary.diseases_found.length)}
          />
        </div>

        {/* Diseases list */}
        <div>
          <p className="text-[13px] text-text-secondary mb-2">Maladies trouvées :</p>
          <div className="flex flex-wrap gap-2">
            {summary.diseases_found.map((disease) => (
              <span
                key={disease}
                className="
                  text-[13px] px-3 py-1 
                  bg-primary-light text-primary-dark 
                  rounded-full
                "
              >
                {disease}
              </span>
            ))}
          </div>
        </div>

        {/* Change file button */}
        <div className="pt-2 border-t border-surface-border">
          <button
            onClick={onNewUpload}
            className="text-[14px] text-primary hover:text-primary-dark transition-colors"
          >
            Charger un autre fichier
          </button>
        </div>
      </Card>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-text-muted">{label}</p>
      <p className="text-[18px] font-bold text-text-primary">{value}</p>
    </div>
  );
}