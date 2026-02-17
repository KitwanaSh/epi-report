/**
 * API service layer.
 * Handles all communication with the FastAPI backend.
 */

import { API_URL } from "@/utils/constants";
import type { UploadResponse, ReportResponse, ErrorResponse } from "@/types";

/**
 * Upload two files to the backend (current year + previous year).
 */
export async function uploadFiles(
  currentYearFile: File,
  previousYearFile: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("current_year_file", currentYearFile);
  formData.append("previous_year_file", previousYearFile);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || "Échec du téléchargement des fichiers.");
  }

  return response.json();
}

/**
 * Generate a report for the given session, week, and optional province.
 */
export async function generateReport(
  sessionId: string,
  week: number,
  province?: string | null
): Promise<ReportResponse> {
  const body: Record<string, unknown> = {
    session_id: sessionId,
    week: week,
  };

  if (province) {
    body.province = province;
  }

  const response = await fetch(`${API_URL}/api/report/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || "Échec de la génération du rapport.");
  }

  return response.json();
}