import { useState, useEffect } from 'react';
import { Tweet, DayOfWeek } from '@/types/tweet';
import { format } from 'date-fns';
import { RefreshCw, X, Calendar, Clock, Sparkles } from 'lucide-react';
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
import { regenerateTweetContent, getDayName } from '@/data/mockTweets';
import { cn } from '@/lib/utils';

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
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (tweet) {
      setContent(tweet.content);
      setScheduledDate(format(tweet.scheduledDate, 'yyyy-MM-dd'));
      setScheduledTime(format(tweet.scheduledDate, 'HH:mm'));
      setSelectedDay(getDayName(tweet.scheduledDate.getDay() === 0 ? 6 : tweet.scheduledDate.getDay() - 1));
    }
  }, [tweet]);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setContent(regenerateTweetContent());
      setIsRegenerating(false);
    }, 500);
  };

  const handleSave = () => {
    if (!tweet) return;
    
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const newDate = new Date(year, month - 1, day, hours, minutes);

    onSave(
      {
        ...tweet,
        content,
        scheduledDate: newDate,
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
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Edit Tweet
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
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
              className="min-h-[120px] resize-none rounded-xl"
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

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="rounded-lg"
              />
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
                onChange={(e) => setScheduledTime(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t bg-muted/30">
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
