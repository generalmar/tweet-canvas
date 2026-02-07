import { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn, Tweet, DayOfWeek } from '@/types/tweet';
import { generateMockColumns, regenerateTweetContent, generateNewTweet, getDayName } from '@/data/mockTweets';
import { KanbanColumnComponent } from './KanbanColumn';
import { EditTweetModal } from './EditTweetModal';
import { CalendarDays, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { addDays, startOfWeek } from 'date-fns';

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(generateMockColumns);
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumnIndex = columns.findIndex((col) => col.id === source.droppableId);
    const destColumnIndex = columns.findIndex((col) => col.id === destination.droppableId);

    if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

    const newColumns = [...columns];
    const sourceColumn = { ...newColumns[sourceColumnIndex] };
    const destColumn = { ...newColumns[destColumnIndex] };

    const sourceTweets = [...sourceColumn.tweets];
    const [movedTweet] = sourceTweets.splice(source.index, 1);

    // Update the tweet's scheduled date to match the destination column
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const destDayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(destination.droppableId);
    const newDate = addDays(weekStart, destDayIndex);
    
    const updatedTweet = {
      ...movedTweet,
      scheduledDate: new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        movedTweet.scheduledDate.getHours(),
        movedTweet.scheduledDate.getMinutes()
      ),
    };

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      sourceTweets.splice(destination.index, 0, updatedTweet);
      sourceColumn.tweets = sourceTweets;
      newColumns[sourceColumnIndex] = sourceColumn;
    } else {
      // Moving to a different column
      const destTweets = [...destColumn.tweets];
      destTweets.splice(destination.index, 0, updatedTweet);

      sourceColumn.tweets = sourceTweets;
      destColumn.tweets = destTweets;

      newColumns[sourceColumnIndex] = sourceColumn;
      newColumns[destColumnIndex] = destColumn;

      toast.success(`Tweet moved to ${destColumn.title}`, {
        description: `Scheduled for ${destColumn.title}`,
        duration: 2000,
      });
    }

    setColumns(newColumns);
  }, [columns]);

  const handleEditTweet = useCallback((tweet: Tweet) => {
    setEditingTweet(tweet);
    setIsModalOpen(true);
  }, []);

  const handleSaveTweet = useCallback((updatedTweet: Tweet, newDayId: DayOfWeek) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => {
        // Remove tweet from any column it was in
        const filtered = col.tweets.filter((t) => t.id !== updatedTweet.id);
        
        // Add to the correct column
        if (col.id === newDayId) {
          return {
            ...col,
            // Sort by latest first (descending order)
            tweets: [...filtered, updatedTweet].sort(
              (a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime()
            ),
          };
        }
        
        return { ...col, tweets: filtered };
      });
      return newColumns;
    });

    toast.success('Tweet updated successfully!');
  }, []);

  const handleDeleteTweet = useCallback((tweetId: string, dayId: DayOfWeek) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === dayId
          ? { ...col, tweets: col.tweets.filter((t) => t.id !== tweetId) }
          : col
      )
    );
    toast.success('Tweet deleted');
  }, []);

  const handleRegenerateTweet = useCallback((tweetId: string, dayId: DayOfWeek) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === dayId
          ? {
              ...col,
              tweets: col.tweets.map((t) =>
                t.id === tweetId ? { ...t, content: regenerateTweetContent() } : t
              ),
            }
          : col
      )
    );
    toast.success('Tweet content regenerated!');
  }, []);

  const handleAddTweet = useCallback((dayId: DayOfWeek) => {
    const columnIndex = columns.findIndex((col) => col.id === dayId);
    if (columnIndex === -1) return;

    const column = columns[columnIndex];
    const newTweet = generateNewTweet();
    
    // Set the date to match the column
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(dayId);
    const targetDate = addDays(weekStart, dayIndex);
    
    newTweet.scheduledDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      12, 0
    );

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === dayId
          // Sort by latest first (descending order)
          ? { ...col, tweets: [...col.tweets, newTweet].sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime()) }
          : col
      )
    );

    // Open edit modal for the new tweet
    setEditingTweet(newTweet);
    setIsModalOpen(true);
  }, [columns]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Tweet Scheduler
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Plan your weekly content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Drag tweets to reschedule</span>
                <span className="sm:hidden">Drag to move</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="p-4 sm:p-6 lg:p-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 scrollbar-thin">
            {columns.map((column) => (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                onEditTweet={handleEditTweet}
                onDeleteTweet={handleDeleteTweet}
                onRegenerateTweet={handleRegenerateTweet}
                onAddTweet={handleAddTweet}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      {/* Edit Modal */}
      <EditTweetModal
        tweet={editingTweet}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTweet(null);
        }}
        onSave={handleSaveTweet}
      />
    </div>
  );
};
