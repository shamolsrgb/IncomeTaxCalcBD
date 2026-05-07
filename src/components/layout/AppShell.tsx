import { Header } from './Header';
import { StepContainer } from '../steps/StepContainer';

export function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-[#0F1828]">
      <Header />
      <main className="flex-1 overflow-y-auto min-h-0">
        <StepContainer />
      </main>
    </div>
  );
}
