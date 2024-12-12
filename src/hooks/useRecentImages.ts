import { useCallback, useEffect, useState } from "react";

interface RecentImage {
  id: string;
  timestamp: number;
  imageUrl: string | null; // Muutettu optional tyyppi pakolliseksi, mutta voi olla null
}

interface StoredImage {
  id: string;
  timestamp: number;
}

interface UseRecentImagesProps {
  apiUrl: string;
}

export const useRecentImages = ({ apiUrl }: UseRecentImagesProps) => {
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [loading, setLoading] = useState(false);

  const removeExpiredImages = useCallback((images: StoredImage[]) => {
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24h millisekunteina
    const now = Date.now();

    const validImages = images.filter((img) => {
      const age = now - img.timestamp;
      return age < twentyFourHours;
    });

    if (validImages.length !== images.length) {
      console.log("Removed expired images");
      localStorage.setItem("recentImages", JSON.stringify(validImages));
    }

    return validImages;
  }, []);

  const fetchImage = useCallback(
    async (imageId: string) => {
      const formData = new FormData();
      formData.append("imageId", imageId);

      const response = await fetch(`${apiUrl}/api/ads/getimage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.image && data.image !== 202) {
        return `data:image/png;base64,${data.image}`;
      }

      return null;
    },
    [apiUrl],
  );

  const loadRecentImages = useCallback(async () => {
    setLoading(true);
    try {
      const storedImages = localStorage.getItem("recentImages");
      const currentImages: StoredImage[] = storedImages
        ? JSON.parse(storedImages)
        : [];
      const validImages = removeExpiredImages(currentImages);

      const updatedImages = await Promise.all(
        validImages.map(async (img) => {
          try {
            const imageUrl = await fetchImage(img.id);
            // Asetetaan imageUrl aina (null jos haku epäonnistui)
            return { ...img, imageUrl: imageUrl };
          } catch (error) {
            console.error(`Failed to fetch image ${img.id}:`, error);
            return null;
          }
        }),
      );

      // Suodatetaan pois null-arvot
      const filteredImages = updatedImages.filter((img): img is RecentImage => {
        return img !== null;
      });

      setRecentImages(filteredImages);

      if (filteredImages.length !== validImages.length) {
        const newStoredImages = filteredImages.map(({ id, timestamp }) => ({
          id,
          timestamp,
        }));
        localStorage.setItem("recentImages", JSON.stringify(newStoredImages));
      }
    } catch (error) {
      console.error("Error loading recent images:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchImage, removeExpiredImages]);

  const addRecentImage = useCallback(
    (imageId: string) => {
      const currentStoredImages = localStorage.getItem("recentImages");
      const currentImages: StoredImage[] = currentStoredImages
        ? JSON.parse(currentStoredImages)
        : [];

      // Tarkistetaan vanhentuneet kuvat
      const validImages = removeExpiredImages(currentImages);

      // Lisätään uusi kuva validoitujen kuvien alkuun
      const updatedStoredImages = [
        { id: imageId, timestamp: Date.now() },
        ...validImages.slice(0, 2),
      ];

      // Tallennetaan LocalStorageen
      localStorage.setItem("recentImages", JSON.stringify(updatedStoredImages));

      // Muunnetaan RecentImage muotoon statea varten
      const updatedRecentImages: RecentImage[] = updatedStoredImages.map(
        (img) => ({
          ...img,
          imageUrl: null,
        }),
      );

      setRecentImages(updatedRecentImages);
    },
    [removeExpiredImages],
  );

  const downloadImage = useCallback(
    (imageUrl: string, filename: string = "image.png") => {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [],
  );

  // Lataa kuvat komponentin mountautuessa
  useEffect(() => {
    const storedImages = localStorage.getItem("recentImages");
    if (storedImages) {
      const parsedImages: StoredImage[] = JSON.parse(storedImages);
      const validImages = removeExpiredImages(parsedImages);
      setRecentImages(validImages.map((img) => ({ ...img, imageUrl: null })));
      if (validImages.length > 0) {
        loadRecentImages();
      }
    }
  }, [loadRecentImages, removeExpiredImages]);

  return {
    recentImages,
    loading,
    addRecentImage,
    loadRecentImages,
    downloadImage,
  };
};

[
  {
    id: "8764e958c71053a3c4beea043e6d3d79688b8e816912aa16258d6d5f65acf3d5",
    timestamp: 1733990814226,
  },
  {
    id: "df15580e87fa7163573be836474aef1042254a6623adb3b1a62178b69226bf49",
    timestamp: 1733990380098,
  },
];
