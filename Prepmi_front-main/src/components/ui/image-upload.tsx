import React, { useState, useRef } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  preview?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  accept = "image/*",
  maxSize = 10,
  className,
  placeholder = "Drag and drop your image here, or",
  preview = true,
  disabled = false,
  required = false,
  error,
  helperText = "PNG, JPG, GIF up to {maxSize}MB"
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize preview if value is provided
  React.useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setPreviewImage(value);
      } else if (value instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(value);
      }
    } else {
      setPreviewImage(null);
    }
  }, [value]);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return false;
    }
    
    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      onChange?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setPreviewImage(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragOver && !disabled 
            ? "border-primary bg-primary/5" 
            : error 
            ? "border-red-300 hover:border-red-400" 
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardContent className="p-6">
          {preview && previewImage ? (
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-w-32 max-h-32 object-contain rounded-lg border shadow-sm"
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  disabled={disabled}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "text-center py-12 transition-colors cursor-pointer",
                isDragOver && !disabled ? 'bg-primary/5' : '',
                disabled && "cursor-not-allowed"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={openFileDialog}
            >
              <ImageIcon className={cn(
                "mx-auto h-12 w-12 mb-4",
                error ? "text-red-400" : "text-gray-400"
              )} />
              <div className="space-y-2">
                <p className={cn(
                  "text-sm",
                  error ? "text-red-600" : "text-gray-600"
                )}>
                  {placeholder}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  disabled={disabled}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {helperText.replace('{maxSize}', maxSize.toString())}
              </p>
            </div>
          )}
          
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />
        </CardContent>
      </Card>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
