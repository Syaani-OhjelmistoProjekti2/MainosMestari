import { validateImage } from "@/utils/ImageProcessing";
import { useRef, useState } from "react";

interface ImageFile {
  file: File;
  preview: string;
}

export const useImageUpload = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [key, setKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      alert(error);
      return;
    }

    try {
      // Vapautetaan mahdollinen aiempi URL muistista
      if (images[0]?.preview) {
        URL.revokeObjectURL(images[0].preview);
      }

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
    if (images[0]?.preview) {
      URL.revokeObjectURL(images[0].preview);
    }

    setImages([]);
    setKey((prev) => prev + 1); // Päivitetään key, joka pakottaa input-elementin uudelleenrenderöinnin
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const error = validateImage(file);
    if (error) {
      alert(error);
      return;
    }

    if (images[0]?.preview) {
      URL.revokeObjectURL(images[0].preview);
    }

    const imageFile = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImages([imageFile]);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return {
    images,
    inputKey: key,
    setImages,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
    handleDrop,
    handleDragOver,
  };
};
