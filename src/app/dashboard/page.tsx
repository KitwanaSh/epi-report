"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FileUploader from "@/components/upload/FileUploader";
import UploadSummaryComponent from "@/components/upload/UploadSummary";
import ReportParameters from "@/components/parameters/ReportParameters";
import AnalysisLoader from "@/components/loading/AnalysisLoader";
import ReportViewer from "@/components/report/ReportViewer";
import { uploadFiles, generateReport } from "@/services/api";
import { ERROR_MESSAGES } from "@/utils/constants";
import type { UploadSummary, ContentBlock, DashboardStep } from "@/types";

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
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
  const [reportData, setReportData] = useState<ContentBlock[] | null>(null);
  const [reportWeek, setReportWeek] = useState<number>(0);
  const [reportProvince, setReportProvince] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [generateError, setGenerateError] = useState("");
  const [globalError, setGlobalError] = useState("");

  // Session expiry check
  useEffect(() => {
    if (!sessionId) return;

    const warningTimer = setTimeout(() => {
      if (currentStep !== "upload") {
        setGlobalError(
          "Votre session de données expire bientôt. " +
            "Veuillez générer votre rapport ou recharger les fichiers."
        );
      }
    }, 50 * 60 * 1000);

    const expiryTimer = setTimeout(() => {
      setGlobalError(ERROR_MESSAGES.SESSION_EXPIRED);
      handleNewUpload();
    }, 60 * 60 * 1000);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(expiryTimer);
    };
  }, [sessionId]);

  // Handle file upload (two files)
  const handleFileUpload = async (currentFile: File, previousFile: File) => {
    setIsUploading(true);
    setUploadError("");
    setGlobalError("");

    try {
      const response = await uploadFiles(currentFile, previousFile);
      setSessionId(response.session_id);
      setUploadSummary(response.summary);
      setCurrentStep("parameters");
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setUploadError(ERROR_MESSAGES.NETWORK_ERROR);
      } else if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError(ERROR_MESSAGES.UPLOAD_FAILED);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle report generation
  const handleGenerate = async (week: number, province: string | null) => {
    if (!sessionId) return;

    setIsGenerating(true);
    setGenerateError("");
    setGlobalError("");
    setReportWeek(week);
    setReportProvince(province);
    setCurrentStep("loading");

    try {
      const response = await generateReport(sessionId, week, province);
      setReportData(response.report);
      setCurrentStep("report");

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setGenerateError(ERROR_MESSAGES.NETWORK_ERROR);
      } else if (err instanceof Error) {
        if (
          err.message.includes("introuvable") ||
          err.message.includes("expirée")
        ) {
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

  // Reset handlers
  const handleNewUpload = () => {
    setCurrentStep("upload");
    setSessionId(null);
    setUploadSummary(null);
    setReportData(null);
    setUploadError("");
    setGenerateError("");
    setGlobalError("");
    setReportWeek(0);
    setReportProvince(null);
  };

  const handleNewReport = () => {
    setCurrentStep("parameters");
    setReportData(null);
    setGenerateError("");
    setReportWeek(0);
    setReportProvince(null);
  };

  // Report label for display
  const reportLabel = reportProvince
    ? `Rapport S${reportWeek}/${uploadSummary?.current_year} — ${reportProvince}`
    : `Rapport S${reportWeek}/${uploadSummary?.current_year}`;

  return (
    <div className="min-h-screen bg-surface-light">
      {/* HEADER */}
      <header className="bg-surface-white border-b border-surface-border shadow-card sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] md:text-[22px]">EPI-RDC</h2>
            <p className="text-text-secondary text-[12px] md:text-[14px]">
              Rapport Épidémiologique Hebdomadaire — RDC
            </p>
          </div>

          <div className="flex items-center gap-4">
            {currentStep !== "upload" && (
              <span className="text-[13px] text-text-muted hidden lg:inline">
                {currentStep === "parameters" && "Prêt à générer"}
                {currentStep === "loading" && "Génération en cours..."}
                {currentStep === "report" && reportLabel}
              </span>
            )}

            <Button
              variant="secondary"
              onClick={logout}
              className="text-[13px] md:text-[14px] px-3 md:px-4 py-2"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* GLOBAL ERROR */}
      {globalError && (
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-4 no-print">
          <ErrorMessage
            message={globalError}
            onDismiss={() => setGlobalError("")}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* REPORT VIEW */}
        {currentStep === "report" && reportData && uploadSummary && (
          <>
            <section className="no-print">
              <Card elevated>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="mb-1">{reportLabel}</h3>
                    <p className="text-text-secondary text-[14px]">
                      Comparaison {uploadSummary.previous_year} vs{" "}
                      {uploadSummary.current_year} — {reportData.length} sections
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleNewReport}>
                      Nouveau rapport
                    </Button>
                    <Button variant="secondary" onClick={handleNewUpload}>
                      Nouveaux fichiers
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <ReportViewer
                blocks={reportData}
                year={uploadSummary.current_year}
                week={reportWeek}
              />
            </section>
          </>
        )}

        {/* UPLOAD SECTION */}
        {currentStep !== "report" && (
          <section>
            <Card elevated>
              <div className="mb-6">
                <h3 className="mb-1">Données épidémiologiques</h3>
                <p className="text-text-secondary text-[14px]">
                  {currentStep === "upload"
                    ? "Téléchargez les deux fichiers de surveillance : année précédente et année en cours."
                    : "Fichiers chargés avec succès. Sélectionnez les paramètres du rapport."}
                </p>
              </div>

              {currentStep === "upload" ? (
                <FileUploader
                  onFilesSelected={handleFileUpload}
                  isUploading={isUploading}
                  error={uploadError}
                  onErrorDismiss={() => setUploadError("")}
                />
              ) : (
                uploadSummary && (
                  <UploadSummaryComponent
                    summary={uploadSummary}
                    onNewUpload={handleNewUpload}
                  />
                )
              )}
            </Card>
          </section>
        )}

        {/* PARAMETERS SECTION */}
        {currentStep === "parameters" && uploadSummary && (
          <section>
            <Card elevated>
              <div className="mb-6">
                <h3 className="mb-1">Paramètres du rapport</h3>
                <p className="text-text-secondary text-[14px]">
                  Sélectionnez la semaine et optionnellement une province.
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

        {/* LOADING SECTION */}
        {currentStep === "loading" && uploadSummary && (
          <section>
            <Card elevated>
              <AnalysisLoader
                week={reportWeek}
                year={uploadSummary.current_year}
              />
            </Card>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-surface-border bg-surface-white mt-16 no-print">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
          <p className="text-[12px] text-text-muted text-center">
            EPI-RDC — Système de génération de rapports épidémiologiques
            hebdomadaires — République Démocratique du Congo
          </p>
        </div>
      </footer>
    </div>
  );
}