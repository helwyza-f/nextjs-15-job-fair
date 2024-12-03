import React, { useCallback } from "react";

interface FilesUploadProps {
  onFileDrop: (files: File[]) => void;
}

const FilesUpload: React.FC<FilesUploadProps> = ({ onFileDrop }) => {
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = Array.from(event.dataTransfer.files);
      onFileDrop(files);
    },
    [onFileDrop]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="text-gray-500">Drag & drop files here or click to upload</p>
    </div>
  );
};

export default FilesUpload;
