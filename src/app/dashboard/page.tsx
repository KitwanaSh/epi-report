"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FileUploader from "@/components/upload/FileUploader";
import UploadSummary from "@/components/upload/UploadSummary";
import ReportParameters from "@/components/parameters/ReportParameters";
import AnalysisLoader from "@/components/loading/AnalysisLoader";
import ReportViewer from "@/components/report/ReportViewer";
import { uploadFile, generateReport } from "@/services/api";
import { ERROR_MESSAGES } from "@/utils/constants";
import type { DataSummary, ContentBlock, DashboardStep } from "@/types";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { logout } = useAuth();

  // Dashboard state
  const [currentStep, setCurrentStep] = useState<DashboardStep>("upload");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadSummary, setUploadSummary] = useState<DataSummary | null>(null);
  const [reportData, setReportData] = useState<ContentBlock[] | null>(null);
  const [reportWeek, setReportWeek] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [generateError, setGenerateError] = useState("");

  // ========================================
  // Handle file upload
  // ========================================
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError("");

    try {
      const response = await uploadFile(file);
      setSessionId(response.session_id);
      setUploadSummary(response.summary);
      setCurrentStep("parameters");
    } catch (err) {
      if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError(ERROR_MESSAGES.NETWORK_ERROR);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ========================================
  // Handle report generation
  // ========================================
  const handleGenerate = async (week: number) => {
    if (!sessionId) return;

    setIsGenerating(true);
    setGenerateError("");
    setReportWeek(week);
    setCurrentStep("loading");

    try {
      const response = await generateReport(sessionId, week);
      setReportData(response.report);
      setCurrentStep("report");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("introuvable") || err.message.includes("expirée")) {
          setGenerateError(ERROR_MESSAGES.SESSION_EXPIRED);
        } else {
          setGenerateError(err.message);
        }
      } else {
        setGenerateError(ERROR_MESSAGES.GENERATION_FAILED);
      }
      setCurrentStep("parameters");
    } finally {
      setIsGenerating(false);
    }
  };

  // ========================================
  // Reset handlers
  // ========================================
  const handleNewUpload = () => {
    setCurrentStep("upload");
    setSessionId(null);
    setUploadSummary(null);
    setReportData(null);
    setUploadError("");
    setGenerateError("");
    setReportWeek(0);
  };

  const handleNewReport = () => {
    setCurrentStep("parameters");
    setReportData(null);
    setGenerateError("");
    setReportWeek(0);
  };

  // ========================================
  // Scroll to report when generated
  // ========================================
  const scrollToReport = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Trigger scroll when report is ready
  if (currentStep === "report" && reportData) {
    scrollToReport();
  }

  return (
    <div className="min-h-screen bg-surface-light">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <header className="bg-surface-white border-b border-surface-border shadow-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-10 py-4 flex items-center justify-between">
          <div>
            <h2>EPI-RDC</h2>
            <p className="text-text-secondary text-[14px]">
              Rapport Épidémiologique Hebdomadaire — RDC
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Show current state indicator */}
            {currentStep !== "upload" && (
              <span className="text-[13px] text-text-muted hidden md:inline">
                {currentStep === "parameters" && "Prêt à générer"}
                {currentStep === "loading" && "Génération en cours..."}
                {currentStep === "report" && `Rapport S${reportWeek}`}
              </span>
            )}

            <Button
              variant="secondary"
              onClick={logout}
              className="text-[14px] px-4 py-2"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}
      <main className="max-w-6xl mx-auto px-10 py-8 space-y-8">

        {/* ======================================= */}
        {/* REPORT VIEW (when report is generated) */}
        {/* ======================================= */}
        {currentStep === "report" && reportData && uploadSummary && (
          <>
            {/* Action Bar */}
            <section>
              <Card elevated>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="mb-1">
                      Rapport S{reportWeek}/{uploadSummary.year}
                    </h3>
                    <p className="text-text-secondary text-[14px]">
                      Rapport généré avec succès — {reportData.length} sections
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleNewReport}>
                      Nouveau rapport
                    </Button>
                    <Button variant="secondary" onClick={handleNewUpload}>
                      Nouveau fichier
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* Report Content */}
            <section>
              <ReportViewer
                blocks={reportData}
                year={uploadSummary.year}
                week={reportWeek}
              />
            </section>
          </>
        )}

        {/* ======================================= */}
        {/* UPLOAD SECTION (hide when viewing report) */}
        {/* ======================================= */}
        {currentStep !== "report" && (
          <section>
            <Card elevated>
              <div className="mb-6">
                <h3 className="mb-1">Données épidémiologiques</h3>
                <p className="text-text-secondary text-[14px]">
                  {currentStep === "upload"
                    ? "Téléchargez le fichier de surveillance épidémiologique (CSV ou XLSX)."
                    : "Fichier chargé avec succès. Sélectionnez les paramètres du rapport."}
                </p>
              </div>

              {currentStep === "upload" ? (
                <FileUploader
                  onFileSelected={handleFileUpload}
                  isUploading={isUploading}
                  error={uploadError}
                  onErrorDismiss={() => setUploadError("")}
                />
              ) : (
                uploadSummary && (
                  <UploadSummary
                    summary={uploadSummary}
                    onNewUpload={handleNewUpload}
                  />
                )
              )}
            </Card>
          </section>
        )}

        {/* ======================================= */}
        {/* PARAMETERS SECTION */}
        {/* ======================================= */}
        {currentStep === "parameters" && uploadSummary && (
          <section>
            <Card elevated>
              <div className="mb-6">
                <h3 className="mb-1">Paramètres du rapport</h3>
                <p className="text-text-secondary text-[14px]">
                  Sélectionnez la semaine épidémiologique pour générer le rapport.
                </p>
              </div>

              <ReportParameters
                summary={uploadSummary}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                error={generateError}
                onErrorDismiss={() => setGenerateError("")}
              />
            </Card>
          </section>
        )}

        {/* ======================================= */}
        {/* LOADING SECTION */}
        {/* ======================================= */}
        {currentStep === "loading" && uploadSummary && (
          <section>
            <Card elevated>
              <AnalysisLoader
                week={reportWeek}
                year={uploadSummary.year}
              />
            </Card>
          </section>
        )}

      </main>
    </div>
  );
}