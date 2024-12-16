import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Image,
  ImageIcon,
  Layout,
  PlaySquare,
  RectangleHorizontal,
  RectangleVertical,
  Share2,
  Smartphone,
  Square,
  User2,
} from "lucide-react";
import { Facebook, Instagram, TikTok, Twitter, Youtube } from "../icons";

// Types
export type BasePlatform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "tiktok"
  | "youtube";

export type BaseFormat =
  | "post"
  | "story"
  | "profile"
  | "cover"
  | "square"
  | "landscape"
  | "portrait"
  | "thumbnail"
  | "mobile_cover";

export type Platform = BasePlatform | "original";
export type Format = BaseFormat | "original";

export interface PlatformConfig {
  name: string;
  formats: BaseFormat[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  aspectRatios: {
    [key in BaseFormat]?: string;
  };
}

// Configuration objects with icon components
export const PLATFORM_CONFIG: Record<BasePlatform, PlatformConfig> = {
  instagram: {
    name: "Instagram",
    formats: ["post", "story", "profile", "square", "portrait"],
    icon: Instagram,
    color: "hover:text-[#E4405F]",
    aspectRatios: {
      post: "1:1",
      story: "9:16",
      profile: "1:1",
      square: "1:1",
      portrait: "4:5",
    },
  },
  facebook: {
    name: "Facebook",
    formats: ["post", "story", "profile", "cover", "landscape", "portrait"],
    icon: Facebook,
    color: "hover:text-[#1877F2]",
    aspectRatios: {
      post: "1.91:1",
      story: "9:16",
      profile: "1:1",
      cover: "2.7:1",
      landscape: "1.91:1",
      portrait: "1:1.91",
    },
  },
  twitter: {
    name: "Twitter",
    formats: ["post", "profile", "cover", "landscape", "portrait"],
    icon: Twitter,
    color: "hover:text-[#1DA1F2]",
    aspectRatios: {
      post: "16:9",
      profile: "1:1",
      cover: "3:1",
      landscape: "16:9",
      portrait: "4:5",
    },
  },
  tiktok: {
    name: "TikTok",
    formats: ["post", "story", "profile"],
    icon: TikTok,
    color: "hover:text-[#000000] dark:hover:text-white",
    aspectRatios: {
      post: "9:16",
      story: "9:16",
      profile: "1:1",
    },
  },
  youtube: {
    name: "YouTube",
    formats: ["profile", "cover", "thumbnail", "mobile_cover"],
    icon: Youtube,
    color: "hover:text-[#FF0000]",
    aspectRatios: {
      profile: "1:1",
      cover: "16:9",
      thumbnail: "16:9",
      mobile_cover: "3.7:1",
    },
  },
} as const;

const FORMAT_ICONS = {
  post: <Share2 className="w-4 h-4" />,
  story: <ImageIcon className="w-4 h-4" />,
  profile: <User2 className="w-4 h-4" />,
  cover: <Layout className="w-4 h-4" />,
  square: <Square className="w-4 h-4" />,
  landscape: <RectangleHorizontal className="w-4 h-4" />,
  portrait: <RectangleVertical className="w-4 h-4" />,
  thumbnail: <PlaySquare className="w-4 h-4" />,
  mobile_cover: <Smartphone className="w-4 h-4" />,
} as const;

export const FORMAT_LABELS: Record<BaseFormat, string> = {
  post: "Julkaisu",
  story: "Tarina",
  profile: "Profiilikuva",
  cover: "Kansikuva",
  square: "Neliö",
  landscape: "Vaakakuva",
  portrait: "Pystykuva",
  thumbnail: "Videon thumbnail",
  mobile_cover: "Mobiilikansikuva",
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
          <Image className="w-4 h-4" />
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
              <Image className="w-4 h-4" />
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
                  <span className="text-xs text-muted-foreground ml-auto">
                    {
                      PLATFORM_CONFIG[selectedPlatform as BasePlatform]
                        .aspectRatios[format]
                    }
                  </span>
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
