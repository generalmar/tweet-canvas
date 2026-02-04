import { Tweet, DayOfWeek } from '@/types/tweet';
import { format } from 'date-fns';
import { Edit3, Trash2, RefreshCw, Clock, Heart, Repeat2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TweetCardProps {
  tweet: Tweet;
  dayId: DayOfWeek;
  onEdit: (tweet: Tweet) => void;
  onDelete: (tweetId: string, dayId: DayOfWeek) => void;
  onRegenerate: (tweetId: string, dayId: DayOfWeek) => void;
  isDragging?: boolean;
}

const dayColorClasses: Record<DayOfWeek, string> = {
  monday: 'hover:border-day-monday/30',
  tuesday: 'hover:border-day-tuesday/30',
  wednesday: 'hover:border-day-wednesday/30',
  thursday: 'hover:border-day-thursday/30',
  friday: 'hover:border-day-friday/30',
  saturday: 'hover:border-day-saturday/30',
  sunday: 'hover:border-day-sunday/30',
};

const dayAccentClasses: Record<DayOfWeek, string> = {
  monday: 'text-day-monday',
  tuesday: 'text-day-tuesday',
  wednesday: 'text-day-wednesday',
  thursday: 'text-day-thursday',
  friday: 'text-day-friday',
  saturday: 'text-day-saturday',
  sunday: 'text-day-sunday',
};

export const TweetCard = ({
  tweet,
  dayId,
  onEdit,
  onDelete,
  onRegenerate,
  isDragging = false,
}: TweetCardProps) => {
  return (
    <div
      className={cn(
        'group relative bg-card rounded-xl p-4 shadow-card border border-border/50',
        'transition-all duration-200 ease-out',
        'hover:shadow-card-hover',
        dayColorClasses[dayId],
        isDragging && 'shadow-card-hover rotate-2 scale-105 opacity-90'
      )}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={tweet.author.avatar}
          alt={tweet.author.name}
          className="w-10 h-10 rounded-full bg-muted"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{tweet.author.name}</span>
            <span className="text-xs text-muted-foreground truncate">{tweet.author.handle}</span>
          </div>
          <div className={cn('flex items-center gap-1 text-xs mt-0.5', dayAccentClasses[dayId])}>
            <Clock className="w-3 h-3" />
            <span>{format(tweet.scheduledDate, 'h:mm a')}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-foreground/90 mb-4 line-clamp-4">
        {tweet.content}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5" />
          <span>{tweet.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <Repeat2 className="w-3.5 h-3.5" />
          <span>{tweet.retweets}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-2 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
          onClick={() => onEdit(tweet)}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs gap-1.5 hover:bg-accent/20 hover:text-accent"
          onClick={() => onRegenerate(tweet.id, dayId)}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(tweet.id, dayId)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
};
