"use client";

import { useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { UploadSummary } from "@/types";

interface ReportParametersProps {
  summary: UploadSummary;
  onGenerate: (week: number, province: string | null) => void;
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
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  // Build week options
  const weekOptions = summary.weeks_available.map((week) => ({
    value: week,
    label: `Semaine ${week} (S${week})`,
  }));

  // Build year options (display only)
  const yearOptions = [
    {
      value: `${summary.previous_year}-${summary.current_year}`,
      label: `${summary.previous_year} — ${summary.current_year}`,
    },
  ];

  // Build province options
  const provinceOptions = summary.provinces.map((prov) => ({
    value: prov,
    label: prov.charAt(0) + prov.slice(1).toLowerCase().replace(/-([a-z])/g, (_, c) => `-${c.toUpperCase()}`),
  }));

  const handleGenerate = () => {
    if (!selectedWeek) return;
    const province = selectedProvince || null;
    onGenerate(Number(selectedWeek), province);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && <ErrorMessage message={error} onDismiss={onErrorDismiss} />}

      {/* Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Year Display */}
        <Select
          label="Années (comparaison)"
          options={yearOptions}
          value={`${summary.previous_year}-${summary.current_year}`}
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

        {/* Province Selector */}
        <Select
          label="Province (optionnel)"
          options={provinceOptions}
          placeholder="Toutes les provinces"
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            onErrorDismiss();
          }}
          disabled={isGenerating}
        />
      </div>

      {/* Province Info */}
      {selectedProvince && (
        <p className="text-[13px] text-text-secondary">
          Le rapport sera filtré pour la province de{" "}
          <strong>{selectedProvince}</strong>.{" "}
          <button
            onClick={() => setSelectedProvince("")}
            className="text-primary hover:text-primary-dark"
          >
            Réinitialiser au niveau national
          </button>
        </p>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        isLoading={isGenerating}
        disabled={!selectedWeek || isGenerating}
        fullWidth
      >
        {isGenerating
          ? "Génération en cours..."
          : selectedProvince
            ? `Générer le rapport — ${selectedProvince}`
            : "Générer le rapport — Niveau national"}
      </Button>
    </div>
  );
}