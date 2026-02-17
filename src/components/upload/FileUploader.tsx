"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ALLOWED_FILE_TYPES, ERROR_MESSAGES } from "@/utils/constants";

interface FileUploaderProps {
  onFilesSelected: (currentFile: File, previousFile: File) => void;
  isUploading: boolean;
  error: string;
  onErrorDismiss: () => void;
}

export default function FileUploader({
  onFilesSelected,
  isUploading,
  error,
  onErrorDismiss,
}: FileUploaderProps) {
  const [currentYearFile, setCurrentYearFile] = useState<File | null>(null);
  const [previousYearFile, setPreviousYearFile] = useState<File | null>(null);
  const currentFileRef = useRef<HTMLInputElement>(null);
  const previousFileRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    return ALLOWED_FILE_TYPES.some((ext) => fileName.endsWith(ext));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const handleUploadClick = () => {
    if (currentYearFile && previousYearFile) {
      onFilesSelected(currentYearFile, previousYearFile);
    }
  };

  const handleReset = () => {
    setCurrentYearFile(null);
    setPreviousYearFile(null);
    if (currentFileRef.current) currentFileRef.current.value = "";
    if (previousFileRef.current) previousFileRef.current.value = "";
    onErrorDismiss();
  };

  const bothFilesSelected = currentYearFile !== null && previousYearFile !== null;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && <ErrorMessage message={error} onDismiss={onErrorDismiss} />}

      {/* Two File Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Year File */}
        <FileDropZone
          label="Fichier année précédente"
          description="Données épidémiologiques de l'année précédente"
          file={previousYearFile}
          onFileChange={(file) => {
            if (validateFile(file)) {
              setPreviousYearFile(file);
              onErrorDismiss();
            }
          }}
          onRemove={() => {
            setPreviousYearFile(null);
            if (previousFileRef.current) previousFileRef.current.value = "";
          }}
          inputRef={previousFileRef}
          isUploading={isUploading}
          formatFileSize={formatFileSize}
        />

        {/* Current Year File */}
        <FileDropZone
          label="Fichier année en cours"
          description="Données épidémiologiques de l'année en cours"
          file={currentYearFile}
          onFileChange={(file) => {
            if (validateFile(file)) {
              setCurrentYearFile(file);
              onErrorDismiss();
            }
          }}
          onRemove={() => {
            setCurrentYearFile(null);
            if (currentFileRef.current) currentFileRef.current.value = "";
          }}
          inputRef={currentFileRef}
          isUploading={isUploading}
          formatFileSize={formatFileSize}
        />
      </div>

      {/* Action Buttons */}
      {(currentYearFile || previousYearFile) && (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleUploadClick}
            isLoading={isUploading}
            disabled={!bothFilesSelected}
            className="flex-1"
          >
            {isUploading
              ? "Téléchargement en cours..."
              : bothFilesSelected
                ? "Télécharger les fichiers"
                : "Sélectionnez les deux fichiers"}
          </Button>

          {!isUploading && (
            <Button variant="secondary" onClick={handleReset}>
              Réinitialiser
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================
// File Drop Zone Sub-Component
// =============================================================

interface FileDropZoneProps {
  label: string;
  description: string;
  file: File | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  formatFileSize: (bytes: number) => string;
}

function FileDropZone({
  label,
  description,
  file,
  onFileChange,
  onRemove,
  inputRef,
  isUploading,
  formatFileSize,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleClick = () => {
    if (!file) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <p className="text-[14px] font-bold text-text-primary">{label}</p>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!file ? handleClick : undefined}
        className={`
          upload-zone
          ${isDragging ? "upload-zone-active" : ""}
          ${file ? "cursor-default border-primary bg-primary-light" : ""}
          ${isUploading ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
        />

        {!file ? (
          <div className="space-y-2">
            <p className="text-text-primary font-bold text-[15px]">
              Glissez-déposez ou cliquez
            </p>
            <p className="text-text-muted text-[13px]">{description}</p>
            <p className="text-text-muted text-[12px]">CSV, XLSX, XLS</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-primary-dark font-bold text-[15px]">
              {file.name}
            </p>
            <p className="text-text-secondary text-[13px]">
              {formatFileSize(file.size)}
            </p>
            {!isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-[13px] text-status-error hover:underline mt-1"
              >
                Retirer ce fichier
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}