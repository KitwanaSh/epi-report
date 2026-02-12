/**
 * TypeScript interfaces matching the backend API responses.
 */

// ================================
// Upload Response
// ================================

export interface DataSummary {
  filename: string;
  total_rows: number;
  total_rows_filtered: number;
  year: number;
  weeks_available: number[];
  diseases_found: string[];
  provinces_count: number;
}

export interface UploadResponse {
  status: string;
  session_id: string;
  summary: DataSummary;
}

// ================================
// Report Request
// ================================

export interface ReportRequest {
  session_id: string;
  week: number;
}

// ================================
// Report Response
// ================================

export interface ChartDataPoint {
  week: string;
  week_number: number;
  cases: number;
  deaths: number;
  lethality: number;
}

export interface ChartContent {
  chart_type: string;
  title: string;
  x_label: string;
  y_bar_label: string;
  y_line_label: string;
  data: ChartDataPoint[];
}

export interface TableRow {
  maladie: string;
  cas: number;
  deces: number;
  letalite: number;
  observation: string;
}

export interface TableContent {
  title: string;
  columns: string[];
  rows: TableRow[];
}

export interface ContentBlock {
  type: "markdown" | "table" | "chart";
  content: string | TableContent | ChartContent;
}

export interface ReportResponse {
  status: string;
  year: number;
  week: number;
  report: ContentBlock[];
}

// ================================
// Error Response
// ================================

export interface ErrorResponse {
  detail: string;
}

// ================================
// Application State
// ================================

export type DashboardStep = "upload" | "parameters" | "loading" | "report";