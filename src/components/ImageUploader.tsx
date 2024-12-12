import { useAdText } from "@/hooks/useAdText";
import { useImageProcessing } from "@/hooks/useImageProcessing";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useRecentImages } from "@/hooks/useRecentImages";
import { ArrowLeft, CopyIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import React, { Suspense, useState } from "react";
import { AdTextOptions } from "./AdTextOptions";
import { CheckmarkIcon } from "./icons";
import { ImageUploadArea } from "./ImageUploadArea";
import { RecentImages } from "./RecentImages";
import SocialMediaSelector, {
  Format,
  Platform,
} from "./some/SocialMediaSelector";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type Step = "input" | "loading" | "output";

const DEMO_AD_TEXT = `Upea moderni huonekalu nyt myynnissä!
Etsitkö tyylikästä ja ajatonta lisää kotiisi? Tämä huippudesign-huonekalu on juuri sitä mitä tarvitset. 

🌟 Ominaisuudet:
- Moderni ja ajaton muotoilu
- Korkealaatuiset materiaalit
- Täydellinen sekä kotiin että toimistoon
- Helppo huoltaa ja puhdistaa

Rajoitettu erä, toimi nopeasti! 
Hinta vain 299€

Ota yhteyttä ja tee elämäsi design-löytö! 📞`;

export default function ImageUploader() {
  const apiUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
  const [creativity, setCreativity] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [description, setDescription] = useState("");
  const [isAdText, setIsAdText] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "">("");
  const [selectedFormat, setSelectedFormat] = useState<Format | "">("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    images,
    handleFileChange,
    handleRemoveImage,
    handleDrop,
    handleDragOver,
  } = useImageUpload();

  const {
    loading,
    imageUrl,
    loadingStatus,
    imageDescription,
    handleSubmit,
    downloadImage,
    testImageDownload,
  } = useImageProcessing({ apiUrl });

  const {
    adText,
    setAdText,
    adTextLoading,
    isCopied,
    generateAdText,
    handleCopy,
  } = useAdText({ apiUrl });

  const resetForm = () => {
    setDescription("");
    setIsAdText(false);
    setSelectedOptions([]);
    setSelectedPlatform("");
    setSelectedFormat("");
    handleRemoveImage();
    setCurrentStep("input");
  };

  const { addRecentImage } = useRecentImages({ apiUrl });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!images.length || !description) {
      alert("Täytä molemmat kentät!");
      return;
    }

    try {
      setCurrentStep("loading");

      const result = await handleSubmit(
        event,
        images[0].file,
        description,
        creativity,
      );

      if ("success" in result && result.success && result.imageId) {
        addRecentImage(result.imageId);
        setRefreshTrigger((prev) => prev + 1);
        if (isAdText && result.newDescription) {
          await generateAdText(result.newDescription);
        }
      }

      setCurrentStep("output");
    } catch (error) {
      if (error instanceof Error) {
        alert("Tapahtui virhe: " + error.message);
        setCurrentStep("input");
      }
    }
  };

  const handleDownload = async () => {
    try {
      await downloadImage(
        selectedPlatform as Platform,
        selectedFormat as Format,
      );
    } catch (error) {
      if (error instanceof Error) {
        alert("Error downloading image: " + error.message);
      }
    }
  };

  const handleTestProcess = async () => {
    try {
      setCurrentStep("loading");
      await testImageDownload(images[0].file);
      setAdText(DEMO_AD_TEXT);
      setCurrentStep("output");
    } catch (error) {
      console.error("Error:", error);
      setCurrentStep("input");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 w-full">
      {/* Test Controls */}
      <div className="fixed top-4 right-4 z-50">
        <Card className="w-64">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Testaustoiminnot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => generateAdText(imageDescription)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Generoi mainosteksti
            </Button>
            {images.length > 0 && (
              <Button
                onClick={handleTestProcess}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Testaa koko prosessi
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tekoälypohjainen mainoskuvageneraattori
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Luo vaikuttavia mainoskuvia ja tekstejä hetkessä
          </p>
        </div>

        {currentStep === "input" && (
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Kuvan luonti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Kuvaile haluamasi mainoskuva
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kuvaile millaisen mainoskuvan haluat tekoälyn luovan..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <ImageUploadArea
                    onFileChange={handleFileChange}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  />

                  {images.length > 0 && (
                    <div className="relative mt-4 max-w-sm mx-auto">
                      <img
                        src={images[0].preview}
                        alt="Uploaded image"
                        className="rounded-lg shadow-md w-full object-cover aspect-square"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        <XIcon className="h-4 w-4" />
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="creativity"
                    checked={creativity}
                    onCheckedChange={setCreativity}
                  />
                  <Label>Luova moodi (vapaampi tulkinta kuvasta)</Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  disabled={!images.length || !description}
                >
                  Jatka seuraavaan vaiheeseen
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === "loading" && (
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {loadingStatus || "Generoidaan mainoskuvaa..."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "output" && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Palaa alkuun
              </Button>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={imageUrl}
                    alt="Generoitu kuva"
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>

                <div className="space-y-4">
                  <SocialMediaSelector
                    selectedPlatform={selectedPlatform}
                    setSelectedPlatform={setSelectedPlatform}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                  />

                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                    disabled={!selectedPlatform || !selectedFormat}
                  >
                    Lataa kuva
                  </Button>
                </div>

                {adTextLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : adText ? (
                  <div className="relative">
                    <textarea
                      value={adText}
                      onChange={(e) => setAdText(e.target.value)}
                      className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 p-4 resize-none"
                    />
                    <Button
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleCopy}
                    >
                      {isCopied ? (
                        <CheckmarkIcon className="h-4 w-4" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}
        <Suspense fallback={<p>Viimeisiä kuvia ladataan...</p>}>
          <div className="max-w-4xl mx-auto space-y-8">
            <RecentImages apiUrl={apiUrl} refreshTrigger={refreshTrigger} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
