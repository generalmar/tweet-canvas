export interface TweetThread {
  id: string;
  content: string;
  scheduledDate: Date;
}

export interface Tweet {
  id: string;
  content: string;
  scheduledDate: Date;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  likes?: number;
  retweets?: number;
  threads?: TweetThread[];
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface KanbanColumn {
  id: DayOfWeek;
  title: string;
  date: Date;
  tweets: Tweet[];
}
