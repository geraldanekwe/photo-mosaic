import React, { useEffect, useRef, useState } from "react";

type MosaicCanvasProps = {
  mainImage: HTMLImageElement;
  tileWidth: number;
  tileHeight: number;
  displaySize: { width: number; height: number } | null;
};

export const MosaicCanvas: React.FC<MosaicCanvasProps> = ({
  mainImage,
  tileWidth,
  tileHeight,
  displaySize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colors, setColors] = useState<string[][]>([]);

  useEffect(() => {
    if (!mainImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = mainImage.width;
    const height = mainImage.height;

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(mainImage, 0, 0, width, height);

    const cols = Math.floor(width / tileWidth);
    const rows = Math.floor(height / tileHeight);
    const newColors: string[][] = [];

    for (let y = 0; y < rows; y++) {
      const row: string[] = [];
      for (let x = 0; x < cols; x++) {
        const tileData = ctx?.getImageData(
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
        if (tileData) {
          const avgColor = getAverageColor(tileData.data);
          row.push(rgbToHex(avgColor));
        }
      }
      newColors.push(row);
    }

    setColors(newColors);
  }, [mainImage, tileWidth, tileHeight]);

  if (!displaySize) return null;

  const cols = colors[0]?.length || 0;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

      <div
        className="grid gap-[1px] bg-black"
        style={{
          width: displaySize.width,
          height: displaySize.height,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {colors.flat().map((hex, index) => (
          <div
            key={index}
            className="w-full h-full"
            style={{
              backgroundColor: hex,
              aspectRatio: `${tileWidth}/${tileHeight}`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// Helpers
function getAverageColor(data: Uint8ClampedArray) {
  let r = 0,
    g = 0,
    b = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return {
    r: Math.floor(r / pixels),
    g: Math.floor(g / pixels),
    b: Math.floor(b / pixels),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
