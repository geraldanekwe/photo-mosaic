// UploadPanel.tsx
import React from "react";

type UploadPanelProps = {
  onMainImageUpload: (file: File) => void;
  onTileImagesUpload: (files: FileList) => void;
};

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onMainImageUpload,
  onTileImagesUpload,
}) => {
  return (
    <div className="w-full p-4 rounded-xl shadow-xl bg-white/20 backdrop-blur-md text-white">
      <h2 className="text-xl font-bold mb-4">Upload Images</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && onMainImageUpload(e.target.files[0])
          }
          className="file-input"
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && onTileImagesUpload(e.target.files)}
          className="file-input"
        />
      </div>
    </div>
  );
};
