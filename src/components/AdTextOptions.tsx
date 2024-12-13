import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CircularEconomyOption, circularEconomySelects } from "@/lib/types";
import {
  HammerIcon,
  HeartIcon,
  RecycleIcon,
  RefreshCwIcon,
  RepeatIcon,
} from "lucide-react";

interface AdTextOptionsProps {
  isAdText: boolean;
  onCheckedChange: (checked: boolean) => void;
  selectedOptions: CircularEconomyOption[];
  onOptionChange: (option: CircularEconomyOption, isSelected: boolean) => void;
}

const getIconForOption = (key: CircularEconomyOption) => {
  switch (key) {
    case CircularEconomyOption.DURABILITY:
      return <HeartIcon className="h-4 w-4 text-black" />;
    case CircularEconomyOption.REPAIRABILITY:
      return <HammerIcon className="h-4 w-4 text-black" />;
    case CircularEconomyOption.MAINTAINABILITY:
      return <RepeatIcon className="h-4 w-4 text-black" />;
    case CircularEconomyOption.UPGRADABILITY:
      return <RefreshCwIcon className="h-4 w-4 text-black" />;
    case CircularEconomyOption.RECYCLABILITY:
      return <RecycleIcon className="h-4 w-4 text-black" />;
  }
};

export const AdTextOptions: React.FC<AdTextOptionsProps> = ({
  isAdText,
  onCheckedChange,
  selectedOptions,
  onOptionChange,
}) => {
  const handleOptionChange = (
    option: CircularEconomyOption,
    checked: boolean,
  ) => {
    onOptionChange(option, checked);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="adprompt"
          checked={isAdText}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="adprompt" className="text-sm font-medium">
          Generoi mainosteksti
        </Label>
      </div>

      {isAdText && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Kiertotalousnäkökulma</h2>
          <div className="grid gap-4">
            {circularEconomySelects.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-3  ">
                <Checkbox
                  id={`checkbox-${key}`}
                  checked={selectedOptions.includes(key)}
                  onCheckedChange={(checked) =>
                    handleOptionChange(key, checked as boolean)
                  }
                />
                <div className="grid gap-1">
                  <div className="flex items-center space-x-2 ">
                    {getIconForOption(key)}
                    <Label
                      htmlFor={`checkbox-${key}`}
                      className="text-sm font-medium border-b border-blue-500/50 w-fit"
                    >
                      {label}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
