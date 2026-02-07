import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Pencil, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface TwitterMediaCarouselProps {
  mediaFiles: MediaFile[];
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

export const TwitterMediaCarousel = ({
  mediaFiles,
  onRemove,
  onEdit,
  className,
}: TwitterMediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (mediaFiles.length === 0) return null;

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < mediaFiles.length - 1;

  const scrollTo = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, mediaFiles.length - 1));
    setCurrentIndex(clampedIndex);
  };

  const handlePrev = () => scrollTo(currentIndex - 1);
  const handleNext = () => scrollTo(currentIndex + 1);

  // Single image layout
  if (mediaFiles.length === 1) {
    const media = mediaFiles[0];
    return (
      <div className={cn("relative rounded-xl overflow-hidden bg-muted", className)}>
        <div className="relative aspect-video">
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={media.url}
              className="w-full h-full object-cover"
              controls
            />
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {onEdit && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 px-3 bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm"
              onClick={() => onEdit(media.id)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>
        
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm"
          onClick={() => onRemove(media.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Multiple images - carousel layout
  return (
    <div className={cn("relative", className)}>
      {/* Carousel container */}
      <div 
        ref={carouselRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-xl"
        style={{ scrollBehavior: 'smooth' }}
      >
        {mediaFiles.map((media, index) => (
          <div 
            key={media.id}
            className="relative flex-shrink-0 snap-center"
            style={{ width: mediaFiles.length === 2 ? 'calc(50% - 4px)' : 'calc(70% - 4px)' }}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Action buttons per item */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                {onEdit && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2.5 text-xs bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm"
                    onClick={() => onEdit(media.id)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm"
                onClick={() => onRemove(media.id)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {mediaFiles.length > 2 && (
        <>
          {canScrollLeft && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm shadow-lg z-10"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          
          {canScrollRight && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm shadow-lg z-10"
              onClick={handleNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </>
      )}

      {/* Dot indicators for many items */}
      {mediaFiles.length > 2 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {mediaFiles.map((_, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-primary w-4" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper hook for managing media files
export const useMediaFiles = (initialFiles: MediaFile[] = []) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialFiles);

  const addFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newMedia: MediaFile[] = fileArray.map((file) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    }));
    
    setMediaFiles((prev) => {
      // Limit to 4 files
      const combined = [...prev, ...newMedia];
      return combined.slice(0, 4);
    });
  };

  const removeFile = (id: string) => {
    setMediaFiles((prev) => {
      const file = prev.find((m) => m.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  const clearFiles = () => {
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.url));
    setMediaFiles([]);
  };

  return { mediaFiles, setMediaFiles, addFiles, removeFile, clearFiles };
};
