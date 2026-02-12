"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ALLOWED_FILE_TYPES, ALLOWED_MIME_TYPES, ERROR_MESSAGES } from "@/utils/constants";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  error: string;
  onErrorDismiss: () => void;
}

export default function FileUploader({
  onFileSelected,
  isUploading,
  error,
  onErrorDismiss,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_TYPES.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) {
      onErrorDismiss();
      setSelectedFile(null);
      // Trigger error through parent by passing invalid file
      // Actually, let's handle it locally first
      return;
    }

    setSelectedFile(file);
  };

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
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onDismiss={onErrorDismiss} />
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!selectedFile ? handleBrowseClick : undefined}
        className={`
          upload-zone
          ${isDragging ? "upload-zone-active" : ""}
          ${selectedFile ? "cursor-default" : ""}
          ${isUploading ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
        />

        {!selectedFile ? (
          /* No file selected state */
          <div className="space-y-3">
            <p className="text-text-primary font-bold text-[16px]">
              Glissez-déposez votre fichier ici
            </p>
            <p className="text-text-muted text-[14px]">
              ou cliquez pour parcourir vos fichiers
            </p>
            <p className="text-text-muted text-[13px]">
              Formats acceptés : CSV, XLSX, XLS
            </p>
          </div>
        ) : (
          /* File selected state */
          <div className="space-y-2">
            <p className="text-text-primary font-bold text-[16px]">
              {selectedFile.name}
            </p>
            <p className="text-text-secondary text-[14px]">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleUploadClick}
            isLoading={isUploading}
            className="flex-1"
          >
            {isUploading ? "Téléchargement en cours..." : "Télécharger le fichier"}
          </Button>

          {!isUploading && (
            <Button
              variant="secondary"
              onClick={handleRemoveFile}
            >
              Changer de fichier
            </Button>
          )}
        </div>
      )}
    </div>
  );
}