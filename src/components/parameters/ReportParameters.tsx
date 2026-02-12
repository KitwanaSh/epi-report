"use client";

import { useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { DataSummary } from "@/types";

interface ReportParametersProps {
  summary: DataSummary;
  onGenerate: (week: number) => void;
  isGenerating: boolean;
  error: string;
  onErrorDismiss: () => void;
}

export default function ReportParameters({
  summary,
  onGenerate,
  isGenerating,
  error,
  onErrorDismiss,
}: ReportParametersProps) {
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  // Build week options from available weeks
  const weekOptions = summary.weeks_available.map((week) => ({
    value: week,
    label: `Semaine ${week} (S${week})`,
  }));

  // Year is fixed from the data
  const yearOptions = [
    { value: summary.year, label: String(summary.year) },
  ];

  const handleGenerate = () => {
    if (!selectedWeek) return;
    onGenerate(Number(selectedWeek));
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onDismiss={onErrorDismiss} />
      )}

      {/* Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year Selector */}
        <Select
          label="Année"
          options={yearOptions}
          value={String(summary.year)}
          disabled
        />

        {/* Week Selector */}
        <Select
          label="Semaine épidémiologique"
          options={weekOptions}
          placeholder="Sélectionner une semaine..."
          value={selectedWeek}
          onChange={(e) => {
            setSelectedWeek(e.target.value);
            onErrorDismiss();
          }}
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        isLoading={isGenerating}
        disabled={!selectedWeek || isGenerating}
        fullWidth
      >
        {isGenerating ? "Génération en cours..." : "Générer le rapport"}
      </Button>
    </div>
  );
}