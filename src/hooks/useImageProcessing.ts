// src/hooks/useImageProcessing.ts
import { useState } from "react";

export function useImageProcessing() {
  const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);

  const loadMainImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => resolve(img);
      };
      reader.readAsDataURL(file);
    });
  };

  const processMainImage = async (file: File) => {
    const img = await loadMainImage(file);
    setMainImage(img);
  };

  return { mainImage, processMainImage };
}
