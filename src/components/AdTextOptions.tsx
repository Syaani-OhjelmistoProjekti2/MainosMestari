import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface AdTextOptionsProps {
  isAdText: boolean;
  onCheckedChange: (checked: boolean) => void;
  selectedOptions: string[];
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
          {[
            "durability",
            "repairability",
            "maintainability",
            "upgradability",
            "recyclability",
          ].map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={onOptionChange}
              />{" "}
              {option === "durability" && "Kestävyys & laadukkuus"}
              {option === "repairability" && "Korjattavuus"}
              {option === "maintainability" && "Huollettavuus"}
              {option === "upgradability" && "Päivitettävyys"}
              {option === "recyclability" &&
                "Säilyttää arvon (kierrätettävyys)"}
            </label>
          ))}
        </div>
      )}
    </>
  );
};
