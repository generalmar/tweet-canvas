import { useRef, forwardRef } from 'react';
import { Image, MapPin, CalendarDays } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TwitterMediaCarousel, MediaFile, useMediaFiles } from './TwitterMediaCarousel';
import { EmojiPicker } from './EmojiPicker';
import { cn } from '@/lib/utils';

interface TwitterTextareaProps {
  value: string;
  onChange: (value: string) => void;
  mediaFiles: MediaFile[];
  onMediaFilesChange: (files: MediaFile[]) => void;
  onAddMedia: (files: FileList) => void;
  onRemoveMedia: (id: string) => void;
  onEditMedia?: (id: string) => void;
  placeholder?: string;
  maxLength?: number;
  minHeight?: string;
  showToolbar?: boolean;
  className?: string;
  disabled?: boolean;
}

export const TwitterTextarea = forwardRef<HTMLTextAreaElement, TwitterTextareaProps>(({
  value,
  onChange,
  mediaFiles,
  onAddMedia,
  onRemoveMedia,
  onEditMedia,
  placeholder = "What's happening?",
  maxLength = 280,
  minHeight = '100px',
  showToolbar = true,
  className,
  disabled = false,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  const characterCount = value.length;
  const isOverLimit = characterCount > maxLength;
  const remainingChars = maxLength - characterCount;
  const showWarning = remainingChars <= 20 && remainingChars > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddMedia(files);
    }
    e.target.value = '';
  };

  const handleMediaButtonClick = () => {
    if (mediaFiles.length < 4) {
      fileInputRef.current?.click();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newValue = value.slice(0, start) + emoji + value.slice(end);
      onChange(newValue);
      
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      onChange(value + emoji);
    }
  };

  // Combine refs
  const setRefs = (element: HTMLTextAreaElement | null) => {
    textareaRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Textarea */}
      <div className="relative">
        <Textarea
          ref={setRefs}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60",
            isOverLimit && "text-destructive"
          )}
          style={{ minHeight }}
        />
      </div>

      {/* Media Preview Carousel */}
      {mediaFiles.length > 0 && (
        <TwitterMediaCarousel
          mediaFiles={mediaFiles}
          onRemove={onRemoveMedia}
          onEdit={onEditMedia}
        />
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-0.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full text-primary hover:bg-primary/10",
                mediaFiles.length >= 4 && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleMediaButtonClick}
              disabled={disabled || mediaFiles.length >= 4}
            >
              <Image className="w-5 h-5" />
            </Button>
            
            <EmojiPicker 
              onEmojiSelect={handleEmojiSelect} 
              disabled={disabled}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
              disabled={disabled}
            >
              <CalendarDays className="w-5 h-5" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
              disabled={disabled}
            >
              <MapPin className="w-5 h-5" />
            </Button>
          </div>

          {/* Character count */}
          <div className="flex items-center gap-3">
            {value.length > 0 && (
              <div className="flex items-center gap-2">
                {/* Circular progress */}
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted/30"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${Math.min(100, (characterCount / maxLength) * 100) * 0.628} 100`}
                      className={cn(
                        "transition-all",
                        isOverLimit ? "text-destructive" : showWarning ? "text-accent-foreground" : "text-primary"
                      )}
                    />
                  </svg>
                  {(showWarning || isOverLimit) && (
                    <span className={cn(
                      "absolute inset-0 flex items-center justify-center text-[10px] font-medium",
                      isOverLimit ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {remainingChars}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TwitterTextarea.displayName = 'TwitterTextarea';
