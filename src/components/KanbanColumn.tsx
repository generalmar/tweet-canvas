import { KanbanColumn as KanbanColumnType, Tweet, DayOfWeek } from '@/types/tweet';
import { TweetCard } from './TweetCard';
import { format } from 'date-fns';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onEditTweet: (tweet: Tweet) => void;
  onDeleteTweet: (tweetId: string, dayId: DayOfWeek) => void;
  onRegenerateTweet: (tweetId: string, dayId: DayOfWeek) => void;
  onAddTweet: (dayId: DayOfWeek) => void;
}

const dayGradientClasses: Record<DayOfWeek, string> = {
  monday: 'bg-gradient-to-br from-day-monday to-day-monday/80',
  tuesday: 'bg-gradient-to-br from-day-tuesday to-day-tuesday/80',
  wednesday: 'bg-gradient-to-br from-day-wednesday to-day-wednesday/80',
  thursday: 'bg-gradient-to-br from-day-thursday to-day-thursday/80',
  friday: 'bg-gradient-to-br from-day-friday to-day-friday/80',
  saturday: 'bg-gradient-to-br from-day-saturday to-day-saturday/80',
  sunday: 'bg-gradient-to-br from-day-sunday to-day-sunday/80',
};

const dayBgClasses: Record<DayOfWeek, string> = {
  monday: 'bg-day-monday/5',
  tuesday: 'bg-day-tuesday/5',
  wednesday: 'bg-day-wednesday/5',
  thursday: 'bg-day-thursday/5',
  friday: 'bg-day-friday/5',
  saturday: 'bg-day-saturday/5',
  sunday: 'bg-day-sunday/5',
};

export const KanbanColumnComponent = ({
  column,
  onEditTweet,
  onDeleteTweet,
  onRegenerateTweet,
  onAddTweet,
}: KanbanColumnProps) => {
  return (
    <div className="flex flex-col h-full min-w-[280px] w-[280px] lg:min-w-[300px] lg:w-[300px] shrink-0">
      {/* Header */}
      <div
        className={cn(
          'rounded-xl p-4 mb-3 shadow-sm',
          dayGradientClasses[column.id]
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{column.title}</h3>
            <p className="text-white/80 text-sm">{format(column.date, 'MMM d')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {column.tweets.length}
            </span>
          </div>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 p-2 rounded-xl transition-colors duration-200 overflow-y-auto scrollbar-thin',
              dayBgClasses[column.id],
              snapshot.isDraggingOver && 'bg-primary/10 ring-2 ring-primary/20'
            )}
          >
            <div className="space-y-3">
              {column.tweets.map((tweet, index) => (
                <Draggable key={tweet.id} draggableId={tweet.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="animate-fade-in"
                      style={provided.draggableProps.style}
                    >
                      <TweetCard
                        tweet={tweet}
                        dayId={column.id}
                        onEdit={onEditTweet}
                        onDelete={onDeleteTweet}
                        onRegenerate={onRegenerateTweet}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>

            {/* Add Tweet Button */}
            <Button
              variant="ghost"
              className={cn(
                'w-full mt-3 border-2 border-dashed border-border/50 hover:border-primary/30',
                'text-muted-foreground hover:text-primary hover:bg-primary/5',
                'rounded-xl h-12 gap-2'
              )}
              onClick={() => onAddTweet(column.id)}
            >
              <Plus className="w-4 h-4" />
              Add Tweet
            </Button>
          </div>
        )}
      </Droppable>
    </div>
  );
};
