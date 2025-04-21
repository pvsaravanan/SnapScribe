
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (imageFile: File) => void;
  isLoading?: boolean;
}

const ImageUploader = ({ onImageSelect, isLoading = false }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onImageSelect]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer group flex flex-col items-center justify-center text-center space-card py-12",
          isDragActive ? "border-primary bg-primary/10" : "border-primary/30 hover:border-primary/50",
          isLoading && "opacity-70 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full max-w-sm mx-auto">
            <img src={preview} alt="Preview" className="w-full h-auto rounded-lg object-cover max-h-60 cosmic-glow" />
            <div className="mt-4 text-sm text-muted-foreground">
              {isDragActive ? (
                <p>Drop to replace the image...</p>
              ) : (
                <p>Drag a new image here, or click to replace</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              {isDragActive ? (
                <ImageIcon className="h-10 w-10 text-primary animate-pulse" />
              ) : (
                <Upload className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-200" />
              )}
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">Drop your image here</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-1">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground">or click to select from your device</p>
              </>
            )}
            <p className="mt-6 text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, GIF, WEBP
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
