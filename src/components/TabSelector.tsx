import { useStep } from "@/contexts/StepContext";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import { FurnitureGuide } from "./FurnitureGuide";
import ImageUploader from "./ImageUploader";
import { Button } from "./ui/button";

export const TabSelector = () => {
  const [showGuide, setShowGuide] = useState(true);
  const [activeView, setActiveView] = useState<"upload" | "guide">("upload");
  const { currentStep } = useStep();

  if (showGuide) {
    return <FurnitureGuide onComplete={() => setShowGuide(false)} />;
  }
  return (
    <div className="w-full md:mt-10 mt-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Buttons */}
        {currentStep === "input" && (
          <div className="flex justify-center mb-4 md:mb-6 2xl:mb-8">
            <div className="inline-flex rounded-full bg-white/90 p-1 shadow-lg">
              <Button
                variant={activeView === "upload" ? "default" : "ghost"}
                onClick={() => setActiveView("upload")}
                className={`rounded-full px-6 flex items-center gap-2 ${
                  activeView === "upload"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Kuvan lataus</span>
              </Button>
              <Button
                variant={activeView === "guide" ? "default" : "ghost"}
                onClick={() => setActiveView("guide")}
                className={`rounded-full px-6 flex items-center gap-2 ${
                  activeView === "guide"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Kuvausohje</span>
              </Button>
            </div>
          </div>
        )}
        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.41, ease: "easeInOut" }}
            >
              <ImageUploader />
            </motion.div>
          ) : (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.41, ease: "easeInOut" }}
            >
              <FurnitureGuide onComplete={() => setActiveView("upload")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabSelector;
