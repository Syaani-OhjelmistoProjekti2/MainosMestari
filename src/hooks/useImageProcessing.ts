import { Format, Platform } from "@/components/some/SocialMediaSelector";
import { useState } from "react";

interface UseImageProcessingProps {
  apiUrl: string;
}

interface SuccessResult {
  success: true;
  newDescription: string;
  imageId: string;
}

interface ImageApiResponse {
  imageId: string;
  promptStatus: string;
  description: string;
}

export const LOADING_MESSAGES = {
  UPLOAD: "Lähetetään kuvaa...",
  GENERATION: "Generoidaan kuvaa...",
  AD_TEXT: "Generoidaan mainostekstiä...",
} as const;

export const useImageProcessing = ({ apiUrl }: UseImageProcessingProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    file: File,
    description: string,
    creativity: boolean
  ): Promise<SuccessResult> => {
    event.preventDefault();
    setImageUrl("");
    setLoading(true);
    setLoadingStatus(LOADING_MESSAGES.UPLOAD);

    const formData = new FormData();
    formData.append("img", file);
    formData.append("prompt", description);
    formData.append("creativity", creativity.toString());

    try {
      const response = await fetch(`${apiUrl}/api/ads/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ImageApiResponse = await response.json();
      const imageId = data.imageId;
      const newDescription: string = data.description;
      setImageDescription(newDescription);

      if (!data.imageId) {
        throw new Error("No image ID received from server");
      }

      let inProgress = true;
      setLoadingStatus(LOADING_MESSAGES.GENERATION);

      while (inProgress) {
        const formDataImage = new FormData();
        formDataImage.append("imageId", imageId);

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
          return { success: true, newDescription, imageId: imageId };
        } else {
          throw new Error("Kuvan hakeminen epäonnistui");
        }
      }
      throw new Error("Kuvan hakeminen epäonnistui");
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
      throw error;
    } finally {
      setLoadingStatus("");
      setLoading(false);
    }
  };

  const downloadImage = async (
    selectedPlatform: Platform,
    selectedFormat: Format
  ) => {
    try {
      if (!imageUrl) {
        alert("No image to download");
        return;
      }

      if (selectedPlatform === "original") {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "original_image.png";
        link.click();
        return;
      }

      if (!selectedFormat) {
        alert("Valitse kuva formaatti enne latausta.");
        return;
      }

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
      const link = document.createElement("a");
      link.href = data.scaledImage;
      link.download = `${selectedPlatform}_${selectedFormat}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  };

  const testImageDownload = async (file: File) => {
    try {
      setImageUrl("");
      setLoading(true);
      setLoadingStatus("Lähetetään kuvaa...");

      // Simuloidaan API kutsua
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Luetaan kuva base64 muotoon
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);

      const imageData = await imageDataPromise;

      // Simuloidaan kuvan prosessointia
      setLoadingStatus("Generoidaan kuvaa...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockDescription =
        "This image shows a modern piece of furniture. It appears to be a sleek and contemporary design with clean lines and a minimalist aesthetic. The furniture has a smooth surface finish and appears to be well-crafted with attention to detail. The overall style would complement a modern living space or office environment.";

      // Asetetaan kuva ja kuvaus
      setImageUrl(imageData);
      setImageDescription(mockDescription); // Tämä on tärkeä ad-tekstin generointia varten

      // Palautetaan kuvaus
      return mockDescription;
    } catch (error) {
      console.error("Error in test image:", error);
      throw error;
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  return {
    loading,
    imageUrl,
    loadingStatus,
    setLoadingStatus,
    setLoading,
    imageDescription,
    handleSubmit,
    testImageDownload,
    downloadImage,
    setImageUrl,
  };
};
