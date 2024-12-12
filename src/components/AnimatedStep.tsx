import { motion } from "framer-motion";
import React from "react";

interface AnimatedStepProps {
  children: React.ReactNode;
  isVisible: boolean;
  stepKey: string;
}

export const AnimatedStep = ({
  children,
  isVisible,
  stepKey,
}: AnimatedStepProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
