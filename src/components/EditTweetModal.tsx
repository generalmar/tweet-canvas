import { useState, useEffect } from 'react';
import { Tweet, TweetThread, DayOfWeek } from '@/types/tweet';
import { format, isBefore, startOfDay } from 'date-fns';
import { RefreshCw, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { regenerateTweetContent, getDayName, recalculateThreadDates } from '@/data/mockTweets';
import { cn } from '@/lib/utils';
import { ThreadEditor } from './ThreadEditor';

interface EditTweetModalProps {
  tweet: Tweet | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTweet: Tweet, newDayId: DayOfWeek) => void;
}

const dayOptions: { id: DayOfWeek; label: string; color: string }[] = [
  { id: 'monday', label: 'Mon', color: 'bg-day-monday' },
  { id: 'tuesday', label: 'Tue', color: 'bg-day-tuesday' },
  { id: 'wednesday', label: 'Wed', color: 'bg-day-wednesday' },
  { id: 'thursday', label: 'Thu', color: 'bg-day-thursday' },
  { id: 'friday', label: 'Fri', color: 'bg-day-friday' },
  { id: 'saturday', label: 'Sat', color: 'bg-day-saturday' },
  { id: 'sunday', label: 'Sun', color: 'bg-day-sunday' },
];

export const EditTweetModal = ({ tweet, isOpen, onClose, onSave }: EditTweetModalProps) => {
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [threads, setThreads] = useState<TweetThread[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (tweet) {
      setContent(tweet.content);
      setScheduledDate(tweet.scheduledDate);
      setScheduledTime(format(tweet.scheduledDate, 'HH:mm'));
      setSelectedDay(getDayName(tweet.scheduledDate.getDay() === 0 ? 6 : tweet.scheduledDate.getDay() - 1));
      setThreads(tweet.threads || []);
    }
  }, [tweet]);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setContent(regenerateTweetContent());
      setIsRegenerating(false);
    }, 500);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Preserve the time when changing the date
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    setScheduledDate(newDate);

    // Update selected day chip based on new date
    const dayIndex = newDate.getDay() === 0 ? 6 : newDate.getDay() - 1;
    setSelectedDay(getDayName(dayIndex));

    // Recalculate thread dates based on new main tweet date
    if (threads.length > 0) {
      setThreads(recalculateThreadDates(newDate, threads));
    }
  };

  const handleTimeChange = (timeString: string) => {
    setScheduledTime(timeString);
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(scheduledDate);
    newDate.setHours(hours, minutes);
    setScheduledDate(newDate);

    // Recalculate thread dates based on new main tweet time
    if (threads.length > 0) {
      setThreads(recalculateThreadDates(newDate, threads));
    }
  };

  const handleSave = () => {
    if (!tweet) return;

    onSave(
      {
        ...tweet,
        content,
        scheduledDate,
        threads: threads.length > 0 ? threads : undefined,
      },
      selectedDay
    );
    onClose();
  };

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;

  if (!tweet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Edit Tweet
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <img
              src={tweet.author.avatar}
              alt={tweet.author.name}
              className="w-12 h-12 rounded-full bg-muted"
            />
            <div>
              <p className="font-semibold">{tweet.author.name}</p>
              <p className="text-sm text-muted-foreground">{tweet.author.handle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-sm font-medium">
                Tweet Content
              </Label>
              <span
                className={cn(
                  'text-xs font-medium',
                  isOverLimit ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {characterCount}/{maxCharacters}
              </span>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none rounded-xl"
              placeholder="What's happening?"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-lg"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate Content'}
            </Button>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Schedule Day</Label>
            <div className="flex gap-1.5">
              {dayOptions.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={cn(
                    'flex-1 py-2 px-1 text-xs font-medium rounded-lg transition-all',
                    selectedDay === day.id
                      ? `${day.color} text-white shadow-md scale-105`
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time with Calendar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal rounded-lg',
                      !scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Thread Editor */}
          <ThreadEditor
            threads={threads}
            mainTweetDate={scheduledDate}
            onThreadsChange={setThreads}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t bg-muted/30 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isOverLimit || !content.trim()}
            className="rounded-lg bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
