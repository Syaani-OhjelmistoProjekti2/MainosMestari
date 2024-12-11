import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Image, Share2 } from "lucide-react";
import { Facebook, Instagram, TikTok, Twitter } from "../icons";

// Types
export type BasePlatform = "instagram" | "facebook" | "twitter" | "tiktok";
export type BaseFormat = "post" | "story" | "profile" | "cover";
export type Platform = BasePlatform | "original";
export type Format = BaseFormat | "original";

// Configuration objects with icon components
const PLATFORM_CONFIG = {
  instagram: {
    name: "Instagram",
    formats: ["post", "story", "profile"],
    icon: Instagram,
    color: "hover:text-[#E4405F]", // Instagram brand color
  },
  facebook: {
    name: "Facebook",
    formats: ["post", "story", "profile"],
    icon: Facebook,
    color: "hover:text-[#1877F2]", // Facebook brand color
  },
  twitter: {
    name: "Twitter",
    formats: ["post", "profile", "cover"],
    icon: Twitter,
    color: "hover:text-[#1DA1F2]", // Twitter brand color
  },
  tiktok: {
    name: "TikTok",
    formats: ["post", "story", "profile"],
    icon: TikTok,
    color: "hover:text-[#000000] dark:hover:text-white", // TikTok brand color
  },
} as const;

const FORMAT_ICONS = {
  post: <Share2 className="w-4 h-4" />,
  story: <Image className="w-4 h-4" />,
  profile: <Image className="w-4 h-4" />,
  cover: <Image className="w-4 h-4" />,
};

const FORMAT_LABELS: Record<BaseFormat, string> = {
  post: "Julkaisu",
  story: "Tarina",
  profile: "Profiilikuva",
  cover: "Kansikuva",
};

// Separate SocialIcon component
const SocialIcon = ({ platform }: { platform: BasePlatform | "original" }) => {
  if (platform === "original") {
    return <Share2 className="w-4 h-4" />;
  }
  const IconComponent = PLATFORM_CONFIG[platform].icon;
  return <IconComponent className="w-4 h-4" />;
};

interface SocialMediaSelectorProps {
  selectedPlatform: Platform | "";
  setSelectedPlatform: (platform: Platform | "") => void;
  selectedFormat: Format | "";
  setSelectedFormat: (format: Format | "") => void;
}

const SocialMediaSelector = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedFormat,
  setSelectedFormat,
}: SocialMediaSelectorProps) => {
  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSelectedFormat(platform === "original" ? "original" : "");
  };

  const getFormatsForPlatform = (platform: Platform) => {
    if (platform === "original") return [];
    return PLATFORM_CONFIG[platform as BasePlatform]?.formats || [];
  };

  // Erillinen komponentti valitun arvon näyttämiseen
  const SelectedValueContent = ({ platform }: { platform: Platform | "" }) => {
    if (!platform) return null;
    if (platform === "original") {
      return (
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          <span>Alkuperäinen</span>
        </div>
      );
    }
    const { icon: Icon, name } = PLATFORM_CONFIG[platform as BasePlatform];
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{name}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
        <SelectTrigger className="w-full sm:w-48">
          {selectedPlatform ? (
            <SelectedValueContent platform={selectedPlatform} />
          ) : (
            <span className="text-muted-foreground">Valitse alusta</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="original">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>Alkuperäinen</span>
            </div>
          </SelectItem>
          {Object.entries(PLATFORM_CONFIG).map(
            ([key, { name, icon: Icon, color }]) => (
              <SelectItem key={key} value={key}>
                <div
                  className={`flex items-center gap-2 transition-colors ${color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </div>
              </SelectItem>
            )
          )}
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
          <SelectTrigger className="w-full sm:w-48">
            {selectedFormat ? (
              <div className="flex items-center gap-2">
                {FORMAT_ICONS[selectedFormat as BaseFormat]}
                <span>{FORMAT_LABELS[selectedFormat as BaseFormat]}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Valitse tyyppi</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {getFormatsForPlatform(selectedPlatform).map((format) => (
              <SelectItem key={format} value={format}>
                <div className="flex items-center gap-2">
                  {FORMAT_ICONS[format]}
                  <span>{FORMAT_LABELS[format]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SocialMediaSelector;
