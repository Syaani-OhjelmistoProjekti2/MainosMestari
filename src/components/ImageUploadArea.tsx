import { UploadIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploadAreaProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  inputKey: number;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onFileChange,
  onDrop,
  onDragOver,
  inputKey,
}) => {
  return (
    <div
      className="border-2 border-dashed border-zinc-200 rounded-lg p-4 dark:border-zinc-800"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="flex items-center justify-center space-x-2">
        <UploadIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
        <p className="text-zinc-500 dark:text-zinc-400">
          Vedä ja pudota kuva tänne
        </p>
      </div>
      <div className="text-center mt-2">
        <input
          key={inputKey}
          name="fileInput"
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("fileInput")?.click();
            }}
          >
            Tai selaa tiedostoja
          </Button>
        </label>
      </div>
    </div>
  );
};
