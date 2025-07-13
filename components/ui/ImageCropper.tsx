"use client";

import React, { useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ImageCropperProps {
  onCropComplete?: (croppedImageBlob: Blob) => void;
  className?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onCropComplete,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const autoCropToAspectRatio = useCallback(
    (img: HTMLImageElement, targetWidth: number, targetHeight: number) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const targetAspectRatio = targetWidth / targetHeight;
      const imageAspectRatio = img.width / img.height;

      let sx, sy, sw, sh;

      if (imageAspectRatio > targetAspectRatio) {
        // Image is wider than target ratio - crop width
        sh = img.height;
        sw = img.height * targetAspectRatio;
        sy = 0;
        sx = (img.width - sw) / 2;
      } else {
        // Image is taller than target ratio - crop height
        sw = img.width;
        sh = img.width / targetAspectRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      // Calculate output dimensions maintaining high quality
      const maxOutputWidth = 1600; // Increased for better quality
      const outputWidth = Math.min(sw, maxOutputWidth);
      const outputHeight = outputWidth / targetAspectRatio;

      // Set canvas size to calculated dimensions
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Clear canvas and draw cropped image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      // Convert to blob with higher quality
      canvas.toBlob(
        (blob) => {
          if (blob && onCropComplete) {
            onCropComplete(blob);
          }
        },
        "image/jpeg",
        0.95
      );
    },
    [onCropComplete]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            autoCropToAspectRatio(img, 1, 1);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    },
    [autoCropToAspectRatio]
  );

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF up to 10MB (auto-cropped to 1:1 ratio)
          </p>
        </div>
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCropper;
