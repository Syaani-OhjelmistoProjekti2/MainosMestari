import { useState } from "react";

interface UseAdTextProps {
  apiUrl: string;
}

interface AdTextApiResponse {
  generatedAdText: string;
}

export const useAdText = ({ apiUrl }: UseAdTextProps) => {
  const [adText, setAdText] = useState("");
  const [adTextLoading, setAdTextLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateAdText = async (
    imageDescription: string,
    selectedOptions: string[],
  ): Promise<void> => {
    setAdTextLoading(true);
    try {
      const adTextResponse = await fetch(
        `${apiUrl}/api/ads/generateFinAdText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: imageDescription,
            options: selectedOptions,
          }),
        },
      );

      if (!adTextResponse.ok) {
        throw new Error(`HTTP error! status: ${adTextResponse.status}`);
      }

      const adTextData: AdTextApiResponse = await adTextResponse.json();

      setAdText(adTextData.generatedAdText);
    } catch (error) {
      console.error("Virhe mainostekstin generoinnissa:", error);
      throw error;
    } finally {
      setAdTextLoading(false);
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

  return {
    adText,
    setAdText,
    adTextLoading,
    isCopied,
    generateAdText,
    handleCopy,
  };
};
