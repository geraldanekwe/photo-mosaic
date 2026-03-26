import React, { useEffect, useRef, useState } from "react";

type MosaicCanvasProps = {
  mainImage: HTMLImageElement;
  tileWidth: number;
  tileHeight: number;
  displaySize: { width: number; height: number } | null;
};

type HoveredTile = {
  col: number;
  row: number;
  hex: string;
  mouseX: number;
  mouseY: number;
};

export const MosaicCanvas: React.FC<MosaicCanvasProps> = ({
  mainImage,
  tileWidth,
  tileHeight,
  displaySize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[][]>([]);
  const [hovered, setHovered] = useState<HoveredTile | null>(null);

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
          tileHeight,
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

  useEffect(() => {
    if (!hovered || !previewCanvasRef.current || !canvasRef.current) return;
    const preview = previewCanvasRef.current;
    const ctx = preview.getContext("2d");
    if (!ctx) return;
    const srcX = hovered.col * tileWidth;
    const srcY = hovered.row * tileHeight;
    preview.width = tileWidth;
    preview.height = tileHeight;
    ctx.drawImage(
      mainImage,
      srcX,
      srcY,
      tileWidth,
      tileHeight,
      0,
      0,
      tileWidth,
      tileHeight,
    );
  }, [hovered, mainImage, tileWidth, tileHeight]);

  if (!displaySize) return null;
  const cols = colors[0]?.length || 0;
  const rows = colors.length;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const col = Math.floor((relX / displaySize.width) * cols);
    const row = Math.floor((relY / displaySize.height) * rows);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;
    const hex = colors[row]?.[col];
    if (!hex) return;
    setHovered({ col, row, hex, mouseX: e.clientX, mouseY: e.clientY });
  };

  const handleMouseLeave = () => setHovered(null);

  const tooltipWidth = 200;
  const tooltipHeight = 220;
  const tooltipLeft = hovered
    ? Math.min(hovered.mouseX + 14, window.innerWidth - tooltipWidth - 8)
    : 0;
  const tooltipTop = hovered
    ? Math.min(hovered.mouseY + 14, window.innerHeight - tooltipHeight - 8)
    : 0;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="grid gap-[1px] bg-black cursor-crosshair"
        style={{
          width: displaySize.width,
          height: displaySize.height,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {colors.flat().map((hex, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const isHovered =
            hovered !== null && hovered.col === col && hovered.row === row;
          return (
            <div
              key={index}
              className="w-full h-full transition-all duration-75"
              style={{
                backgroundColor: hex,
                aspectRatio: `${tileWidth}/${tileHeight}`,
                outline: isHovered ? "2px solid rgba(255,255,255,0.9)" : "none",
                outlineOffset: "-1px",
                zIndex: isHovered ? 1 : 0,
                position: "relative",
              }}
            />
          );
        })}
      </div>

      {hovered && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltipLeft, top: tooltipTop }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-white/15"
            style={{
              background: "rgba(15, 15, 18, 0.92)",
              backdropFilter: "blur(12px)",
              width: tooltipWidth,
            }}
          >
            <canvas
              ref={previewCanvasRef}
              className="w-full"
              style={{ display: "block", imageRendering: "pixelated" }}
            />

            <div className="px-3 py-2 flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex-shrink-0 border border-white/20"
                style={{ backgroundColor: hovered.hex }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-white/40 font-mono leading-tight">
                  tile [{hovered.col}, {hovered.row}]
                </span>
                <span className="text-[12px] text-white/80 font-mono leading-tight">
                  {hovered.hex}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
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
