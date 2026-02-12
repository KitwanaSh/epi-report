export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface-light">
      <header className="bg-surface-white border-b border-surface-border shadow-card">
        <div className="max-w-6xl mx-auto px-10 py-4">
          <h2>EPI-RDC</h2>
          <p className="text-text-secondary text-[14px]">
            Rapport Épidémiologique Hebdomadaire — RDC
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-10 py-8">
        <div className="card-elevated">
          <p className="text-text-muted text-center">
            Dashboard content coming in Steps 4-6
          </p>
        </div>
      </main>
    </div>
  );
}