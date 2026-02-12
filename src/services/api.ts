/**
 * API service layer.
 * Handles all communication with the FastAPI backend.
 */

import { API_URL } from "@/utils/constants";
import type { UploadResponse, ReportResponse, ErrorResponse } from "@/types";

/**
 * Upload a file to the backend.
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || "Échec du téléchargement du fichier.");
  }

  return response.json();
}

/**
 * Generate a report for the given session and week.
 */
export async function generateReport(
  sessionId: string,
  week: number
): Promise<ReportResponse> {
  const response = await fetch(`${API_URL}/api/report/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      week: week,
    }),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || "Échec de la génération du rapport.");
  }

  return response.json();
}