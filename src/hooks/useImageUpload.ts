import { validateImage } from "@/utils/ImageProcessing";
import { useRef, useState } from "react";

interface ImageFile {
  file: File;
  preview: string;
}

export const useImageUpload = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
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
    setImages([imageFile]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return {
    images,
    setImages,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
    handleDrop,
    handleDragOver,
  };
};
