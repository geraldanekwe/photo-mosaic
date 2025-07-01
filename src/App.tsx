import React, { useState, useRef } from "react";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { MosaicCanvas } from "./components/MosaicCanvas";

function App() {
  const { mainImage, processMainImage } = useImageProcessing();
  const [displaySize, setDisplaySize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imageContainerRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    const imgEl = imageContainerRef.current;
    if (imgEl) {
      const { width, height } = imgEl.getBoundingClientRect();
      setDisplaySize({ width, height });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold">🎨 Photo Mosaic Generator</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setDisplaySize(null); // Reset previous size
            processMainImage(file);
          }
        }}
        className="text-black bg-white p-2 rounded"
      />

      {mainImage && (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 text-center lg:text-left">
              Original
            </h2>
            <img
              ref={imageContainerRef}
              src={mainImage.src}
              alt="Uploaded"
              onLoad={handleImageLoad}
              className="w-full h-auto rounded shadow-lg"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 text-center lg:text-left">
              Mosaic
            </h2>
            {displaySize ? (
              <MosaicCanvas
                mainImage={mainImage}
                tileWidth={100}
                tileHeight={100}
                displaySize={displaySize}
              />
            ) : (
              <p className="text-center text-gray-400">Preparing mosaic...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
