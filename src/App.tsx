import { useEffect, Suspense } from 'react';
import { useTaxStore } from './store/useTaxStore';
import { AppShell } from './components/layout/AppShell';

function App() {
  const loadSavedDraft = useTaxStore((s) => s.loadSavedDraft);

  useEffect(() => {
    loadSavedDraft();
  }, [loadSavedDraft]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading calculator...</p>
        </div>
      </div>
    }>
      <AppShell />
    </Suspense>
  );
}

export default App;
