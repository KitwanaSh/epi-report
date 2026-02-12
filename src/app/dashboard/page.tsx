"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <header className="bg-surface-white border-b border-surface-border shadow-card">
        <div className="max-w-6xl mx-auto px-10 py-4 flex items-center justify-between">
          <div>
            <h2>EPI-RDC</h2>
            <p className="text-text-secondary text-[14px]">
              Rapport Épidémiologique Hebdomadaire — RDC
            </p>
          </div>

          <Button variant="secondary" onClick={logout} className="text-[14px] px-4 py-2">
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-10 py-8">
        <Card elevated>
          <p className="text-text-muted text-center">
            Bienvenue. Le contenu du tableau de bord arrive aux étapes 4 à 6.
          </p>
        </Card>
      </main>
    </div>
  );
}