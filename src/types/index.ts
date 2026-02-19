/**
 * TypeScript interfaces matching the updated backend API responses.
 */

// ================================
// Upload Response
// ================================

export interface FileSummary {
  filename: string;
  total_rows: number;
  total_rows_filtered: number;
  year: number;
  weeks_available: number[];
}

export interface UploadSummary {
  current_year_file: FileSummary;
  previous_year_file: FileSummary;
  current_year: number;
  previous_year: number;
  weeks_available: number[];
  diseases_found: string[];
  provinces: string[];
  provinces_count: number;
}

export interface UploadResponse {
  status: string;
  session_id: string;
  summary: UploadSummary;
}

// ================================
// Report Request
// ================================

export interface ReportRequest {
  session_id: string;
  week: number;
  province?: string | null;
}

// ================================
// Report Response
// ================================

export interface ChartDataPoint {
  label: string;
  week_number: number;
  year: number;
  group: "previous_year" | "current_trend";
  cases: number;
  deaths: number;
  lethality: number;
  borrowed: boolean;
}

export interface ChartContent {
  chart_type: string;
  title: string;
  x_label: string;
  y_bar_label: string;
  y_line_label: string;
  current_year: number;
  previous_year: number;
  separator_index: number;
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

export interface ComparisonWeekBreakdown {
  week: number;
  cases: number;
  deaths: number;
}

export interface ComparisonTableRow {
  maladie: string;
  maladie_key: string;
  cumul_previous_cases: number;
  cumul_previous_deaths: number;
  cumul_current_cases: number;
  cumul_current_deaths: number;
  weekly_breakdown: ComparisonWeekBreakdown[];
}

export interface ComparisonTableContent {
  title: string;
  current_year: number;
  previous_year: number;
  week: number;
  weeks_shown: number[];
  rows: ComparisonTableRow[];
}

export interface ContentBlock {
  type: "markdown" | "table" | "chart" | "comparison_table";
  content: string | TableContent | ChartContent | ComparisonTableContent;
}

export interface ReportResponse {
  status: string;
  year: number;
  previous_year: number;
  week: number;
  province: string | null;
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