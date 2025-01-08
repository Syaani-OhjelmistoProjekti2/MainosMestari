import { useStep } from "@/contexts/StepContext";
import { motion } from "framer-motion";
import { Camera, InfoIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const FurnitureGuide = ({ onComplete }: { onComplete: () => void }) => {
  const { hasShownGuide, setHasShownGuide } = useStep();

  const handleComplete = () => {
    setHasShownGuide(true);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: hasShownGuide ? 0 : 0.8,
        delay: hasShownGuide ? 0 : 0.6,
        ease: "easeInOut",
      }}
      className={`w-full max-w-2xl mx-auto ${!hasShownGuide ? "md:py-10 py-6 md:mt-4 px-4" : ""}`}
    >
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-blue-500" />
            Kuvausohje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="rounded-lg border border-border px-4 py-3 border-blue-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  <Camera
                    className="text-blue-500"
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Parhaan tuloksen saamiseksi muista jättää riittävästi tilaa
                    huonekalun ympärille kuvattaessa.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/flux-pro-1.1-exaxmple.png"
                alt="Esimerkki hyvästä kuvauskulmasta"
                className="rounded-lg w-full md:max-w-[350px] md:max-h-[350px] max-w-[300px] max-h-[260px] object-contain"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            OK
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
