import { Suspense } from "react";
import "./App.css";
import Header from "./components/Header";
import LoadingSpinner from "./components/loaders";
import TabSelector from "./components/TabSelector";
import { StepProvider } from "./contexts/StepContext";

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10 bg-fixed"></div>
      <div className="absolute inset-0 w-full min-h-screen overflow-auto">
        <StepProvider>
          <Header />
          <Suspense fallback={<LoadingSpinner />}>
            <main className="relative z-10">
              <TabSelector />
            </main>
          </Suspense>
        </StepProvider>
      </div>
    </div>
  );
}

export default App;
