import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface TooltipButtonProps extends ButtonProps {
  tooltipMessage?: string;
  children: React.ReactNode;
}

export const TooltipButton = ({
  tooltipMessage,
  children,
  disabled,
  ...buttonProps
}: TooltipButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Button
              {...buttonProps}
              disabled={disabled}
              className={`w-full ${buttonProps.className}`}
            >
              {children}
            </Button>
          </div>
        </TooltipTrigger>
        {disabled && tooltipMessage && (
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
