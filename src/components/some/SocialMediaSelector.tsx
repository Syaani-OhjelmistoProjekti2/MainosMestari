import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

// Base types
export type BasePlatform = "instagram" | "facebook" | "twitter" | "tiktok";
export type BaseFormat = "post" | "story" | "profile" | "cover";
export type Platform = BasePlatform | "original";
export type Format = BaseFormat | "original";

// Format labels without 'original'
const formatLabels: Record<BaseFormat, string> = {
  post: "Julkaisu",
  story: "Tarina",
  profile: "Profiilikuva",
  cover: "Kansikuva",
};

// Platform formats without 'original'
const platformFormats: Record<BasePlatform, BaseFormat[]> = {
  instagram: ["post", "story", "profile"],
  facebook: ["post", "story", "profile"],
  twitter: ["post", "profile", "cover"],
  tiktok: ["post", "story", "profile"],
};

interface SocialMediaSelectorProps {
  selectedPlatform: Platform | "";
  setSelectedPlatform: (platform: Platform | "") => void;
  selectedFormat: Format | "";
  setSelectedFormat: (format: Format | "") => void;
}

const SocialMediaSelector: React.FC<SocialMediaSelectorProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedFormat,
  setSelectedFormat,
}) => {
  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    if (platform === "original") {
      setSelectedFormat("original");
    } else {
      setSelectedFormat("");
    }
  };

  const getFormatsForPlatform = (platform: Platform) => {
    if (platform === "original") return [];
    return platformFormats[platform as BasePlatform] || [];
  };

  return (
    <div className="flex space-x-4">
      <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Valitse kuvatyyppi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="original">Alkuperäinen</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="twitter">Twitter</SelectItem>
          <SelectItem value="tiktok">TikTok</SelectItem>
        </SelectContent>
      </Select>

      {selectedPlatform && selectedPlatform !== "original" && (
        <Select
          value={selectedFormat}
          onValueChange={setSelectedFormat}
          disabled={
            !selectedPlatform || (selectedPlatform as Platform) === "original"
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Valitse julkaisutyyppi" />
          </SelectTrigger>
          <SelectContent>
            {getFormatsForPlatform(selectedPlatform).map((format) => (
              <SelectItem key={format} value={format}>
                {formatLabels[format]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SocialMediaSelector;
