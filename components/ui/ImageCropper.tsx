"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload, Crop } from "lucide-react";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  onCropComplete?: (croppedImageBlob: Blob) => void;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onCropComplete,
  className = "",
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [renderedImageSize, setRenderedImageSize] = useState({
    width: 0,
    height: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectRatio = 2;

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImage(result);
          setIsDialogOpen(true);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      // Use a timeout to ensure the image is fully rendered
      setTimeout(() => {
        if (imageRef.current) {
          const rect = imageRef.current.getBoundingClientRect();
          setRenderedImageSize({ width: rect.width, height: rect.height });

          // Set initial crop area
          let cropWidth = rect.width * 0.8;
          let cropHeight = cropWidth / aspectRatio;

          if (cropHeight > rect.height * 0.8) {
            cropHeight = rect.height * 0.8;
            cropWidth = cropHeight * aspectRatio;
          }

          const x = (rect.width - cropWidth) / 2;
          const y = (rect.height - cropHeight) / 2;
          setCropArea({ x, y, width: cropWidth, height: cropHeight });
        }
      }, 100);
    }
  }, []);

  const getRelativePosition = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: "drag" | "resize", handle?: string) => {
      e.preventDefault();
      e.stopPropagation();

      const pos = getRelativePosition(e);

      if (type === "drag") {
        setIsDragging(true);
        setDragStart({ x: pos.x - cropArea.x, y: pos.y - cropArea.y });
      } else if (type === "resize" && handle) {
        setIsResizing(true);
        setResizeHandle(handle);
      }
    },
    [cropArea, getRelativePosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging && !isResizing) return;

      const pos = getRelativePosition(e);

      if (isDragging) {
        let newX = pos.x - dragStart.x;
        let newY = pos.y - dragStart.y;

        // Clamp to bounds
        newX = Math.max(
          0,
          Math.min(newX, renderedImageSize.width - cropArea.width)
        );
        newY = Math.max(
          0,
          Math.min(newY, renderedImageSize.height - cropArea.height)
        );

        setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (isResizing) {
        let newCropArea = { ...cropArea };

        switch (resizeHandle) {
          case "nw": {
            const maxWidth = cropArea.x + cropArea.width;
            const maxHeight = cropArea.y + cropArea.height;
            let width = Math.max(50, maxWidth - pos.x);
            let height = width / aspectRatio;

            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }

            const nx = maxWidth - width;
            const ny = maxHeight - height;

            newCropArea = {
              x: Math.max(0, nx),
              y: Math.max(0, ny),
              width,
              height,
            };
            break;
          }
          case "ne": {
            const maxWidth = renderedImageSize.width - cropArea.x;
            let width = Math.max(50, Math.min(pos.x - cropArea.x, maxWidth));
            let height = width / aspectRatio;

            if (cropArea.y + height > renderedImageSize.height) {
              height = renderedImageSize.height - cropArea.y;
              width = height * aspectRatio;
            }

            newCropArea = {
              x: cropArea.x,
              y: cropArea.y,
              width,
              height,
            };
            break;
          }
          case "sw": {
            const maxWidth = cropArea.x + cropArea.width;
            const maxHeight = renderedImageSize.height - cropArea.y;
            let width = Math.max(50, Math.min(maxWidth - pos.x, maxWidth));
            const height = Math.min(width / aspectRatio, maxHeight);

            if (height < width / aspectRatio) {
              width = height * aspectRatio;
            }

            const nx = maxWidth - width;

            newCropArea = {
              x: Math.max(0, nx),
              y: cropArea.y,
              width,
              height,
            };
            break;
          }
          case "se": {
            const maxWidth = renderedImageSize.width - cropArea.x;
            const maxHeight = renderedImageSize.height - cropArea.y;
            let width = Math.max(50, Math.min(pos.x - cropArea.x, maxWidth));
            const height = Math.min(width / aspectRatio, maxHeight);

            if (height < width / aspectRatio) {
              width = height * aspectRatio;
            }

            newCropArea = {
              x: cropArea.x,
              y: cropArea.y,
              width,
              height,
            };
            break;
          }
        }

        setCropArea(newCropArea);
      }
    },
    [
      isDragging,
      isResizing,
      dragStart,
      cropArea,
      resizeHandle,
      renderedImageSize,
      getRelativePosition,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        handleMouseMove(e as unknown as React.MouseEvent);
      }
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const cropImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    const scaleX = img.naturalWidth / renderedImageSize.width;
    const scaleY = img.naturalHeight / renderedImageSize.height;

    const sx = cropArea.x * scaleX;
    const sy = cropArea.y * scaleY;
    const sw = cropArea.width * scaleX;
    const sh = cropArea.height * scaleY;

    canvas.width = sw;
    canvas.height = sh;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    canvas.toBlob(
      (blob) => {
        if (blob && onCropComplete) {
          onCropComplete(blob);
        }
        setIsDialogOpen(false);
      },
      "image/jpeg",
      0.9
    );
  }, [cropArea, onCropComplete, renderedImageSize]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-center w-full">
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
              PNG, JPG, GIF up to 10MB
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Drag to move the crop area, or drag the handles to resize.
              Maintains 2:1 aspect ratio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              ref={containerRef}
              className="relative inline-block border rounded-lg overflow-hidden"
              style={{ userSelect: "none" }}
            >
              {image && (
                <>
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Crop preview"
                    className="w-full max-h-96 object-contain block"
                    onLoad={handleImageLoad}
                    draggable={false}
                  />
                  {renderedImageSize.width > 0 &&
                    renderedImageSize.height > 0 && (
                      <div
                        className="absolute inset-0 cursor-crosshair"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/10 " />

                        {/* Crop area */}
                        <div
                          className="absolute border-2 border-blue-500 cursor-move z-10"
                          style={{
                            left: cropArea.x,
                            top: cropArea.y,
                            width: cropArea.width,
                            height: cropArea.height,
                            backgroundColor: "transparent",
                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                          }}
                          onMouseDown={(e) => handleMouseDown(e, "drag")}
                        >
                          {/* Resize handles */}
                          <div
                            className="absolute w-4 h-4 bg-blue-500 border-2 border-white cursor-nw-resize rounded-full"
                            style={{ left: -8, top: -8 }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleMouseDown(e, "resize", "nw");
                            }}
                          />
                          <div
                            className="absolute w-4 h-4 bg-blue-500 border-2 border-white cursor-ne-resize rounded-full"
                            style={{ right: -8, top: -8 }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleMouseDown(e, "resize", "ne");
                            }}
                          />
                          <div
                            className="absolute w-4 h-4 bg-blue-500 border-2 border-white cursor-sw-resize rounded-full"
                            style={{ left: -8, bottom: -8 }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleMouseDown(e, "resize", "sw");
                            }}
                          />
                          <div
                            className="absolute w-4 h-4 bg-blue-500 border-2 border-white cursor-se-resize rounded-full"
                            style={{ right: -8, bottom: -8 }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleMouseDown(e, "resize", "se");
                            }}
                          />
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={cropImage}>
              <Crop className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCropper;
