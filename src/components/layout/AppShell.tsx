import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ResultsPanel } from './ResultsPanel';
import { MobileResultsBar } from './MobileResultsBar';
import { StepContainer } from '../steps/StepContainer';

export function AppShell() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <MobileResultsBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <StepContainer />
        </main>
        <ResultsPanel />
      </div>
    </div>
  );
}
