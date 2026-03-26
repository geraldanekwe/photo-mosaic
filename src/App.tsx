import React, { useState, useRef } from "react";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { MosaicCanvas } from "./components/MosaicCanvas";

function App() {
  const { mainImage, processMainImage } = useImageProcessing();
  const [displaySize, setDisplaySize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageContainerRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = () => {
    const imgEl = imageContainerRef.current;
    if (imgEl) {
      const { width, height } = imgEl.getBoundingClientRect();
      setDisplaySize({ width, height });
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setDisplaySize(null);
      processMainImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      <header className="border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">
            ✦
          </div>
          <span className="font-semibold tracking-tight text-white/90">
            Mosaic
          </span>
        </div>
        <span className="text-xs text-white/30 font-mono hidden sm:block">
          photo → pixel art
        </span>
      </header>

      <main className="flex-1 flex flex-col px-4 py-8 max-w-5xl mx-auto w-full gap-8">
        {!mainImage && (
          <div className="text-center mt-4 mb-2">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Photo Mosaic Generator
            </h1>
            <p className="mt-3 text-white/40 text-sm sm:text-base max-w-md mx-auto">
              Transform any image into a stunning tile mosaic. Upload a photo to
              get started.
            </p>
          </div>
        )}

        {!mainImage && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
              flex flex-col items-center justify-center gap-4 py-16 px-8
              ${
                isDragging
                  ? "border-violet-400 bg-violet-500/10"
                  : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
              }
            `}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl select-none">
              🖼
            </div>
            <div className="text-center">
              <p className="font-medium text-white/80">
                {isDragging ? "Drop to upload" : "Click or drag an image here"}
              </p>
              <p className="text-sm text-white/30 mt-1">
                PNG, JPG, WEBP supported
              </p>
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {mainImage && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-white/[0.04] rounded-xl px-4 py-3 border border-white/8">
              <span className="text-sm text-white/50">Image loaded</span>
              <button
                onClick={() => {
                  setDisplaySize(null);
                  fileInputRef.current?.click();
                }}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                ↺ Upload new image
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] rounded-2xl border border-white/8 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="text-xs font-medium text-white/50 uppercase tracking-widest">
                    Original
                  </span>
                </div>
                <div className="p-3">
                  <img
                    ref={imageContainerRef}
                    src={mainImage.src}
                    alt="Uploaded"
                    onLoad={handleImageLoad}
                    className="w-full h-auto rounded-xl object-contain"
                  />
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-2xl border border-white/8 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400/60" />
                  <span className="text-xs font-medium text-white/50 uppercase tracking-widest">
                    Mosaic
                  </span>
                </div>
                <div className="p-3 min-h-[200px] flex items-center justify-center">
                  {displaySize ? (
                    <MosaicCanvas
                      mainImage={mainImage}
                      tileWidth={100}
                      tileHeight={100}
                      displaySize={displaySize}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="w-8 h-8 rounded-full border-2 border-violet-400/40 border-t-violet-400 animate-spin" />
                      <p className="text-sm text-white/30">
                        Generating mosaic…
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 px-4 py-4 text-center">
        <p className="text-xs text-white/20">Photo Mosaic Generator</p>
      </footer>
    </div>
  );
}

export default App;
