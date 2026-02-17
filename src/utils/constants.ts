/**
 * Frontend constants.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const ALLOWED_FILE_TYPES = [".csv", ".xlsx", ".xls"];

export const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export const LOADING_MESSAGES = [
  "Traitement des données...",
  "Analyse épidémiologique en cours...",
  "Comparaison inter-annuelle...",
  "Génération du texte narratif...",
  "Assemblage du rapport...",
  "Finalisation...",
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Impossible de se connecter au serveur. Vérifiez votre connexion.",
  UPLOAD_FAILED: "Échec du téléchargement des fichiers. Veuillez réessayer.",
  GENERATION_FAILED: "Échec de la génération du rapport. Veuillez réessayer.",
  INVALID_CREDENTIALS: "Nom d'utilisateur ou mot de passe incorrect.",
  SESSION_EXPIRED: "Votre session a expiré. Veuillez recharger les fichiers.",
  INVALID_FILE_TYPE: "Type de fichier invalide. Seuls les fichiers CSV et XLSX sont acceptés.",
  MISSING_FILES: "Les deux fichiers sont requis : année en cours et année précédente.",
};

export const DISEASE_COLORS: Record<string, string> = {
  CHOLERA: "#0EA5E9",
  "FIEVRE JAUNE": "#F59E0B",
  MENINGITE: "#8B5CF6",
  MONKEYPOX: "#EF4444",
  FHA: "#10B981",
  ROUGEOLE: "#F97316",
  TNN: "#6366F1",
};