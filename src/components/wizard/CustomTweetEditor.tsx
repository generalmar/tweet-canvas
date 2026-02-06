import { useState, useRef } from 'react';
import { Plus, X, Image, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ThreadItem {
  id: string;
  content: string;
  mediaFiles: File[];
}

interface CustomTweetEditorProps {
  mainContent: string;
  onMainContentChange: (content: string) => void;
  threads: ThreadItem[];
  onThreadsChange: (threads: ThreadItem[]) => void;
  mainMediaFiles: File[];
  onMainMediaFilesChange: (files: File[]) => void;
}

export const CustomTweetEditor = ({
  mainContent,
  onMainContentChange,
  threads,
  onThreadsChange,
  mainMediaFiles,
  onMainMediaFilesChange,
}: CustomTweetEditorProps) => {
  const mainFileInputRef = useRef<HTMLInputElement>(null);

  const addThread = () => {
    const newThread: ThreadItem = {
      id: `thread-${Date.now()}`,
      content: '',
      mediaFiles: [],
    };
    onThreadsChange([...threads, newThread]);
  };

  const updateThread = (id: string, content: string) => {
    onThreadsChange(
      threads.map((t) => (t.id === id ? { ...t, content } : t))
    );
  };

  const removeThread = (id: string) => {
    onThreadsChange(threads.filter((t) => t.id !== id));
  };

  const handleMainMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mainMediaFiles.length <= 4) {
      onMainMediaFilesChange([...mainMediaFiles, ...files]);
    }
    e.target.value = '';
  };

  const removeMainMedia = (index: number) => {
    onMainMediaFilesChange(mainMediaFiles.filter((_, i) => i !== index));
  };

  const handleThreadMediaUpload = (threadId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const thread = threads.find((t) => t.id === threadId);
    if (thread && files.length + thread.mediaFiles.length <= 4) {
      onThreadsChange(
        threads.map((t) =>
          t.id === threadId
            ? { ...t, mediaFiles: [...t.mediaFiles, ...files] }
            : t
        )
      );
    }
    e.target.value = '';
  };

  const removeThreadMedia = (threadId: string, mediaIndex: number) => {
    onThreadsChange(
      threads.map((t) =>
        t.id === threadId
          ? { ...t, mediaFiles: t.mediaFiles.filter((_, i) => i !== mediaIndex) }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Tweet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <Label className="font-semibold text-foreground">Main Tweet</Label>
          </div>
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            mainContent.length > 280 
              ? 'bg-destructive/10 text-destructive' 
              : 'bg-muted text-muted-foreground'
          )}>
            {mainContent.length}/280
          </span>
        </div>
        
        <div className="relative">
          <Textarea
            placeholder="What's on your mind? Share your thoughts..."
            value={mainContent}
            onChange={(e) => onMainContentChange(e.target.value)}
            className="min-h-[120px] resize-none pr-12 text-base"
          />
          <input
            ref={mainFileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleMainMediaUpload}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => mainFileInputRef.current?.click()}
            disabled={mainMediaFiles.length >= 4}
          >
            <Image className="w-4 h-4" />
          </Button>
        </div>

        {/* Main tweet media preview */}
        {mainMediaFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mainMediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Paperclip className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeMainMedia(index)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thread Items */}
      {threads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-medium px-2">THREAD REPLIES</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          {threads.map((thread, index) => (
            <div key={thread.id} className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 2}
                  </div>
                  <Label className="font-medium text-foreground">Thread Reply {index + 1}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs font-medium px-2 py-1 rounded-full',
                    thread.content.length > 280 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {thread.content.length}/280
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeThread(thread.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative ml-4 pl-4 border-l-2 border-primary/20">
                <Textarea
                  placeholder="Continue your thread..."
                  value={thread.content}
                  onChange={(e) => updateThread(thread.id, e.target.value)}
                  className="min-h-[100px] resize-none pr-12"
                />
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  id={`thread-media-${thread.id}`}
                  onChange={(e) => handleThreadMediaUpload(thread.id, e)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => document.getElementById(`thread-media-${thread.id}`)?.click()}
                  disabled={thread.mediaFiles.length >= 4}
                >
                  <Image className="w-4 h-4" />
                </Button>

                {/* Thread media preview */}
                {thread.mediaFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {thread.mediaFiles.map((file, mediaIndex) => (
                      <div key={mediaIndex} className="relative group">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Upload preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Paperclip className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeThreadMedia(thread.id, mediaIndex)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Thread Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
        onClick={addThread}
      >
        <Plus className="w-4 h-4" />
        Add Thread Reply
      </Button>

      {threads.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          💡 Threads will be posted 30 seconds apart automatically
        </p>
      )}
    </div>
  );
};
