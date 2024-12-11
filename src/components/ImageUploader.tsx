import { validateImage } from "@/utils/ImageProcessing";
import { CopyIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { AdTextOptions } from "./AdTextOptions";
import { CheckmarkIcon } from "./icons";
import { ImageUploadArea } from "./ImageUploadArea";
import SocialMediaSelector, {
  Format,
  Platform,
} from "./some/SocialMediaSelector";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ImageFile {
  file: File;
  preview: string;
}

export default function ImageUploader() {
  const apiUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
  const [images, setImages] = useState<ImageFile[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdText, setIsAdText] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [adText, setAdText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [adTextLoading, setAdTextLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "">("");
  const [selectedFormat, setSelectedFormat] = useState<Format | "">("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      alert(error);
      return;
    }

    try {
      const imageFile = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImages([imageFile]);
    } catch (error) {
      console.error("Virhe kuvan käsittelyssä:", error);
      alert("Kuvan lataaminen epäonnistui");
    }
  };

  const handleRemoveImage = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const error = validateImage(file);
    if (error) {
      alert(error);
      return;
    }
    const imageFile = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImageUrl("");
    setImages([imageFile]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImageUrl("");
    setAdText("");

    if (!images.length || !description) {
      alert("Täytä molemmat kentät!");
      return;
    }

    setLoading(true);
    setLoadingStatus("Lähetetään kuvaa...");

    const formData = new FormData();
    formData.append("img", images[0].file);
    formData.append("prompt", description);

    try {
      const response = await fetch(`${apiUrl}/api/ads/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.imageId) {
        throw new Error("No image ID received from server");
      }

      let inProgress = true;
      setLoadingStatus("Generoidaan kuvaa...");

      while (inProgress) {
        const formDataImage = new FormData();
        formDataImage.append("imageId", data.imageId);

        const imageResponse = await fetch(`${apiUrl}/api/ads/getimage`, {
          method: "POST",
          body: formDataImage,
        });

        if (!imageResponse.ok) {
          throw new Error(`HTTP error! status: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.json();

        if (!imageData.image || imageData.image === 202) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        if (imageData.image) {
          const imgUrl = `data:image/png;base64,${imageData.image}`;
          setImageUrl(imgUrl);
          inProgress = false;

          if (isAdText) {
            await generateAdText();
          }
        } else {
          throw new Error("Kuvan hakeminen epäonnistui");
        }
      }
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
      if (error instanceof Error) {
        alert("Tapahtui virhe: " + error.message);
      }
    } finally {
      setLoadingStatus("");
      setLoading(false);
    }
  };

  const generateAdText = async () => {
    setAdTextLoading(true);
    setLoadingStatus("Generoidaan mainostekstiä...");

    try {
      const formDataText = new FormData();
      formDataText.append("img", images[0].file);
      selectedOptions.forEach((option) => {
        formDataText.append("viewPoints", option);
      });

      const adTextResponse = await fetch(`${apiUrl}/api/ads/getadtext`, {
        method: "POST",
        body: formDataText,
      });

      if (!adTextResponse.ok) {
        throw new Error(`HTTP error! status: ${adTextResponse.status}`);
      }

      const adTextData = await adTextResponse.json();
      setAdText(adTextData.adText);
    } catch (error) {
      console.error("Virhe mainostekstin generoinnissa:", error);
      if (error instanceof Error) {
        alert("Mainostekstin generointi epäonnistui: " + error.message);
      }
    } finally {
      setAdTextLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      if (!imageUrl || !selectedPlatform || !selectedFormat) {
        alert("Please select a platform and format before downloading.");
        return;
      }
      // Jos valittu alusta on "original", lataa kuva suoraan
      if (selectedPlatform === "original") {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "original_image.png";
        link.click();
        return;
      }

      // Muussa tapauksessa skaalaa kuva valitun alustan ja formaatin mukaan
      if (!selectedFormat) {
        alert("Please select a format before downloading.");
        return;
      }
      setLoading(true);
      setLoadingStatus("Skaalataan kuvaa...");

      const response = await fetch(`${apiUrl}/api/image/scale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: imageUrl,
          platform: selectedPlatform,
          format: selectedFormat,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scale image");
      }

      const data = await response.json();

      // Luodaan download linkki
      const link = document.createElement("a");
      link.href = data.scaledImage;
      link.download = `${selectedPlatform}_${selectedFormat}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      if (error instanceof Error) {
        alert("Error downloading image: " + error.message);
      } else {
        alert("An error occurred while downloading the image");
      }
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(adText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Kopiointi epäonnistui:", err);
      });
  };

  const testImageDownload = async () => {
    if (!images.length) {
      alert("Lataa ensin kuva!");
      return;
    }

    try {
      // Muunnetaan kuva base64-muotoon
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        // Asetetaan kuva suoraan imageUrl-tilaan
        setImageUrl(base64data);
      };
      reader.readAsDataURL(images[0].file);
    } catch (error) {
      console.error("Error in test image:", error);
      alert(
        "Error testing image: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <div className="flex space-x-4">
        {images.length > 0 && (
          <Button type="button" onClick={testImageDownload} className="buttoni">
            Testaa latausta
          </Button>
        )}
      </div>
      <Card
        className="w-full max-w-4xl flex flex-col space-y-4 p-6"
        style={{ paddingLeft: 100, paddingRight: 100 }}
      >
        <CardHeader>
          <CardTitle>Stability AI 2 Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kuvaile millaisen mainoskuvan haluat tekoälyn luovan"
              className="resize-none w-full h-[100px] border border-zinc-300 rounded-md p-2"
            />
            <ImageUploadArea
              onFileChange={handleFileChange}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />

            <div className="flex justify-center">
              {images.length > 0 && (
                <div className="relative">
                  <img
                    src={images[0].preview}
                    alt="Uploaded image"
                    className="aspect-square object-contain border border-zinc-200 w-full rounded-lg overflow-hidden dark:border-zinc-800"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                  <Button
                    variant="ghost"
                    className="absolute top-1 right-1 h-6 w-6 p-1 custom-button"
                    onClick={handleRemoveImage}
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              )}
            </div>

            <AdTextOptions
              isAdText={isAdText}
              onCheckedChange={setIsAdText}
              selectedOptions={selectedOptions}
              onOptionChange={(e) => {
                const { value, checked } = e.target;
                setSelectedOptions((prev) =>
                  checked
                    ? [...prev, value]
                    : prev.filter((option) => option !== value),
                );
              }}
            />

            <Button type="submit" className="buttoni">
              Generoi mainos
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
              <p className="text-lg font-medium">{loadingStatus}</p>
            </div>
          </div>
        </div>
      )}

      {imageUrl && (
        <Card className="w-full max-w-4xl" style={{ marginLeft: 10 }}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Vastaanotettu kuva"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "400px" }}
                />
              </div>

              <SocialMediaSelector
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
              />

              <Button
                onClick={downloadImage}
                className="buttoni"
                disabled={!selectedPlatform || !selectedFormat}
              >
                Lataa kuva
              </Button>

              {adTextLoading ? (
                <div className="space-y-4 p-6 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-gray-600">
                      Generoidaan mainostekstiä...
                    </p>
                  </div>
                </div>
              ) : adText ? (
                <form className="relative">
                  <textarea
                    value={adText}
                    onChange={(e) => setAdText(e.target.value)}
                    className="resize-none w-full h-[500px] border border-zinc-300 rounded-md p-2 pt-12"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-black text-white p-2 hover:bg-gray-500 transition-all border border-gray-300 rounded-md shadow-md hover:shadow-lg"
                    onClick={handleCopy}
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isCopied ? (
                      <CheckmarkIcon className="w-6 h-6" />
                    ) : (
                      <CopyIcon className="w-6 h-6" />
                    )}
                  </button>
                </form>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
