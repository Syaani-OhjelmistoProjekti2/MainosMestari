import { useRecentImages } from "@/hooks/useRecentImages";
import { Download, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RecentImagesProps {
  apiUrl: string;
  refreshTrigger: number;
}

export const RecentImages: React.FC<RecentImagesProps> = ({
  apiUrl,
  refreshTrigger,
}) => {
  const { recentImages, loading, downloadImage, loadRecentImages } =
    useRecentImages({ apiUrl });

  useEffect(() => {
    loadRecentImages();
  }, [loadRecentImages, refreshTrigger]);

  if (recentImages.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Viimeisimmät kuvat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentImages.map((image, index) => (
            <div key={image.id} className="relative group">
              {loading && !image.imageUrl ? (
                <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : image.imageUrl ? (
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt={`Recent image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={() =>
                        downloadImage(image.imageUrl!, `image-${index + 1}.png`)
                      }
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Kuvaa ei löytynyt</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
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
  {
    id: "df15580e87fa7163573be836474aef1042254a6623adb3b1a62178b69226bf49",
    timestamp: 1733990380098,
  },
  {
    id: "df15580e87fa7163573be836474aef1042254a6623adb3b1a62178b69226bf49",
    timestamp: 1733990380098,
  },
];
