import { Header } from './Header';
import { StepContainer } from '../steps/StepContainer';

export function AppShell() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0F1828]">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <StepContainer />
      </main>
    </div>
  );
}
