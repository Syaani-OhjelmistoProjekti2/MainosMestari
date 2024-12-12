import { CircularEconomyOption, circularEconomySelects } from "@/lib/types";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface AdTextOptionsProps {
  isAdText: boolean;
  onCheckedChange: (checked: boolean) => void;
  selectedOptions: CircularEconomyOption[];
  onOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdTextOptions: React.FC<AdTextOptionsProps> = ({
  isAdText,
  onCheckedChange,
  selectedOptions,
  onOptionChange,
}) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="adprompt"
          className="switch"
          checked={isAdText}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="adprompt" className="text-sm">
          Generoi mainosteksti
        </Label>
      </div>

      {isAdText && (
        <div className="flex flex-col space-y-2 mt-4">
          <h2 className="font-bold">Kiertotalousnäkökulma</h2>
          {circularEconomySelects.map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={key}
                checked={selectedOptions.includes(key)}
                onChange={onOptionChange}
                className="rounded border-gray-300"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}
    </>
  );
};
