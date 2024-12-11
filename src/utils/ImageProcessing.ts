export const resizeImage = (
  imageUrl: string,
  width: number,
  height: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const scale = Math.max(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const dx = (width - scaledWidth) / 2;
      const dy = (height - scaledHeight) / 2;

      ctx?.drawImage(img, dx, dy, scaledWidth, scaledHeight);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

export const validateImage = (file: File): string | null => {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return "Vain JPEG, PNG ja WEBP kuvat ovat tuettuja.";
  }

  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    return "Kuvan maksimikoko on 4MB";
  }

  return null;
};
