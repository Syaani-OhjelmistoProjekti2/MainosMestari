import { Badge } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export interface GeneratedImage {
  id: string;
  timestamp: string;
  prompt: string;
  imageUrl?: string;
  platform?: string;
  format?: string;
}

export function GeneratedImages() {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const apiUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";

  useEffect(() => {
    const savedHistory = localStorage.getItem("generatedImages");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const loadImage = async (imageId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [imageId]: true }));
      const formData = new FormData();
      formData.append("imageId", imageId);

      const response = await fetch(`${apiUrl}/api/ads/getimage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to load image");

      const data = await response.json();

      if (data.image && data.image !== 202) {
        const imgUrl = `data:image/png;base64,${data.image}`;

        // Update the history with the loaded image URL
        setHistory((prev) =>
          prev.map((item) =>
            item.id === imageId ? { ...item, imageUrl: imgUrl } : item,
          ),
        );

        return imgUrl;
      }
      return null;
    } catch (error) {
      console.error("Error loading image:", error);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Aiemmin generoidut kuvat</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <Card key={item.id} className="p-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <Button
                onClick={() => loadImage(item.id)}
                disabled={loading[item.id]}
                className="w-full h-48"
              >
                {loading[item.id] ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : (
                  "Lataa kuva uudelleen"
                )}
              </Button>
            )}
            <p className="mt-2 text-sm">{item.prompt}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
            {item.platform && (
              <Badge className="mt-1">
                {item.platform} - {item.format}
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
