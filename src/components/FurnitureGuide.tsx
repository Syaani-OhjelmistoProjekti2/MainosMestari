import { useStep } from "@/contexts/StepContext";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

export const FurnitureGuide = ({ onComplete }: { onComplete: () => void }) => {
  const { hasShownGuide, setHasShownGuide, scrollToHeader } = useStep();

  const handleComplete = () => {
    setHasShownGuide(true);
    scrollToHeader();
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
        <CardContent className="space-y-8 pt-6">
          <div className="rounded-xl bg-blue-50 border-2 border-blue-200 overflow-hidden">
            <div className="bg-blue-100 p-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <Camera
                  className="text-blue-600"
                  size={24}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className="font-medium text-blue-900">Kuvausohje</h3>
              </div>
            </div>

            <div className="md:p-4 p-2 md:space-y-4 space-y-2">
              <div className="flex items-start md:gap-3 gap-2 md:pb-3 pb-2 border-b border-blue-200">
                <div className="md:w-6 md:h-6 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-medium">1</span>
                </div>
                <p className="text-sm text-blue-900 md:leading-normal leading-tight">
                  Parhaan tuloksen saamiseksi muista jättää riittävästi tilaa
                  huonekalun ympärille kuvattaessa.
                </p>
              </div>

              <div className="flex items-start md:gap-3 gap-2">
                <div className="md:w-6 md:h-6 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-medium">2</span>
                </div>
                <p className="text-sm text-blue-900 md:leading-normal leading-tight">
                  Kuvaa kaluste niin, että se erottuu selkeästi taustasta ja sen
                  ympärillä on tyhjää tilaa. Vältä muiden kalusteiden näkymistä
                  kuvassa. Halutessasi voit poistaa taustan sopivalla
                  ohjelmalla.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4">
            <img
              src="/flux-pro-1.1-exaxmple.png"
              alt="Esimerkki hyvästä kuvauskulmasta"
              className="rounded-lg w-full md:max-w-[250px] md:max-h-[250px] max-w-[250px] max-h-[260px] object-contain bg-white shadow-sm"
            />
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
