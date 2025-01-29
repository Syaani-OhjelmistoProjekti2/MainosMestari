import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";

type Step = "input" | "loading" | "output";

interface StepContextType {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  hasShownGuide: boolean;
  setHasShownGuide: (shown: boolean) => void;
  headerRef: MutableRefObject<HTMLDivElement | null>;
  scrollToHeader: () => void;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export function StepProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [hasShownGuide, setHasShownGuide] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const scrollToHeader = () => {
    setTimeout(() => {
      headerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <StepContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        hasShownGuide,
        setHasShownGuide,
        headerRef,
        scrollToHeader,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

export function useStep() {
  const context = useContext(StepContext);
  if (context === undefined) {
    throw new Error("useStep must be used within a StepProvider");
  }
  return context;
}
