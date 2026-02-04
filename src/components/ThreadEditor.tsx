import { useState } from 'react';
import { TweetThread } from '@/types/tweet';
import { format, addSeconds, isBefore } from 'date-fns';
import { RefreshCw, Trash2, Clock, Plus, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { regenerateThreadContent, generateNewThread, recalculateThreadDates } from '@/data/mockTweets';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface ThreadEditorProps {
  threads: TweetThread[];
  mainTweetDate: Date;
  onThreadsChange: (threads: TweetThread[]) => void;
}

export const ThreadEditor = ({ threads, mainTweetDate, onThreadsChange }: ThreadEditorProps) => {
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (threadId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const handleAddThread = () => {
    const newThread = generateNewThread(mainTweetDate, threads);
    onThreadsChange([...threads, newThread]);
    setExpandedThreads((prev) => new Set(prev).add(newThread.id));
  };

  const handleDeleteThread = (threadId: string) => {
    const updatedThreads = threads.filter((t) => t.id !== threadId);
    // Recalculate dates after deletion
    const recalculated = recalculateThreadDates(mainTweetDate, updatedThreads);
    onThreadsChange(recalculated);
  };

  const handleRegenerateThread = (threadId: string) => {
    setRegeneratingIds((prev) => new Set(prev).add(threadId));
    setTimeout(() => {
      onThreadsChange(
        threads.map((t) =>
          t.id === threadId ? { ...t, content: regenerateThreadContent() } : t
        )
      );
      setRegeneratingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(threadId);
        return newSet;
      });
    }, 500);
  };

  const handleContentChange = (threadId: string, content: string) => {
    onThreadsChange(
      threads.map((t) => (t.id === threadId ? { ...t, content } : t))
    );
  };

  const handleDateChange = (threadId: string, date: Date | undefined) => {
    if (!date) return;
    
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    if (threadIndex === -1) return;

    const previousDate = threadIndex === 0 
      ? mainTweetDate 
      : threads[threadIndex - 1].scheduledDate;

    // Ensure new date is at least 30 seconds after the previous
    const minDate = addSeconds(previousDate, 30);
    const validDate = isBefore(date, minDate) ? minDate : date;

    // Update this thread's date
    const updatedThreads = threads.map((t, idx) => {
      if (t.id === threadId) {
        return { ...t, scheduledDate: validDate };
      }
      // Recalculate subsequent threads
      if (idx > threadIndex) {
        const prevThread = idx === threadIndex + 1 ? validDate : threads[idx - 1].scheduledDate;
        return { ...t, scheduledDate: addSeconds(prevThread, 30) };
      }
      return t;
    });

    onThreadsChange(updatedThreads);
  };

  const handleTimeChange = (threadId: string, timeString: string) => {
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    if (threadIndex === -1) return;

    const thread = threads[threadIndex];
    const [hours, minutes] = timeString.split(':').map(Number);
    
    const newDate = new Date(thread.scheduledDate);
    newDate.setHours(hours, minutes);

    const previousDate = threadIndex === 0 
      ? mainTweetDate 
      : threads[threadIndex - 1].scheduledDate;

    // Validate: must be after main tweet and previous thread
    const minDate = addSeconds(previousDate, 30);
    if (isBefore(newDate, minDate)) {
      return; // Invalid time, don't update
    }

    // Update this thread and recalculate subsequent ones
    const updatedThreads = threads.map((t, idx) => {
      if (t.id === threadId) {
        return { ...t, scheduledDate: newDate };
      }
      if (idx > threadIndex) {
        const prevDate = idx === threadIndex + 1 
          ? newDate 
          : threads[idx - 1].scheduledDate;
        return { ...t, scheduledDate: addSeconds(prevDate, 30) };
      }
      return t;
    });

    onThreadsChange(updatedThreads);
  };

  const getMinDate = (threadIndex: number): Date => {
    if (threadIndex === 0) {
      return addSeconds(mainTweetDate, 30);
    }
    return addSeconds(threads[threadIndex - 1].scheduledDate, 30);
  };

  if (threads.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Thread
          </Label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 rounded-lg border-dashed"
          onClick={handleAddThread}
        >
          <Plus className="w-4 h-4" />
          Add Thread
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Thread ({threads.length} {threads.length === 1 ? 'reply' : 'replies'})
        </Label>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {threads.map((thread, index) => {
          const isExpanded = expandedThreads.has(thread.id);
          const isRegenerating = regeneratingIds.has(thread.id);
          const minDate = getMinDate(index);

          return (
            <div
              key={thread.id}
              className="border border-border/50 rounded-lg bg-muted/30 overflow-hidden"
            >
              {/* Thread Header */}
              <button
                type="button"
                onClick={() => toggleExpanded(thread.id)}
                className="w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {thread.content.slice(0, 50)}...
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{format(thread.scheduledDate, 'MMM d, h:mm:ss a')}</span>
                    <span className="text-primary/70">
                      (+{30 * (index + 1)}s)
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Thread Content (Expanded) */}
              {isExpanded && (
                <div className="p-3 pt-0 space-y-3 border-t border-border/30">
                  <Textarea
                    value={thread.content}
                    onChange={(e) => handleContentChange(thread.id, e.target.value)}
                    className="min-h-[80px] resize-none rounded-lg text-sm"
                    placeholder="Thread content..."
                  />

                  {/* Thread Schedule */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs h-8"
                          >
                            {format(thread.scheduledDate, 'MMM d, yyyy')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={thread.scheduledDate}
                            onSelect={(date) => handleDateChange(thread.id, date)}
                            disabled={(date) => isBefore(date, minDate)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Time</Label>
                      <Input
                        type="time"
                        step="1"
                        value={format(thread.scheduledDate, 'HH:mm:ss')}
                        onChange={(e) => handleTimeChange(thread.id, e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* Thread Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1 hover:bg-accent/20"
                      onClick={() => handleRegenerateThread(thread.id)}
                      disabled={isRegenerating}
                    >
                      <RefreshCw className={cn('w-3 h-3', isRegenerating && 'animate-spin')} />
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteThread(thread.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Thread Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 rounded-lg border-dashed"
        onClick={handleAddThread}
      >
        <Plus className="w-4 h-4" />
        Add Thread
      </Button>
    </div>
  );
};
