import { Tweet, KanbanColumn, DayOfWeek, TweetThread } from '@/types/tweet';
import { startOfWeek, addDays, setHours, setMinutes, addSeconds } from 'date-fns';

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

const mockAuthors = [
  { name: 'Sarah Chen', handle: '@sarahcodes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { name: 'Alex Rivera', handle: '@alexr_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { name: 'Jordan Park', handle: '@jordanbuilds', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan' },
  { name: 'Taylor Swift', handle: '@taylortech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor' },
];

const tweetContents = [
  "🚀 Just shipped a new feature! The drag-and-drop experience is *chef's kiss*. What's everyone building today?",
  "Hot take: TypeScript isn't optional anymore. It's essential for any serious project. Fight me 😄",
  "Pro tip: Use CSS Grid for complex layouts. Flexbox is great, but Grid is a game-changer for 2D layouts! 📐",
  "Morning coffee ☕ + good music 🎵 + clean code = perfect workday. What's your productivity stack?",
  "Just discovered a bug that's been in production for 3 months. Nobody noticed. Is this good or bad? 🤔",
  "Reminder: Take breaks! Your brain needs rest to solve complex problems. 🧠💪",
  "The new React 19 features are incredible. Server components are changing how we think about architecture.",
  "Unpopular opinion: Dark mode shouldn't be the default. Fight me in the comments! 🌙☀️",
  "Celebrating 1000 followers! 🎉 Thank you all for the support. More great content coming soon!",
  "Today's goal: Zero meetings. Just deep work on the new dashboard. Wish me luck! 🤞",
  "AI is not replacing developers. It's making us 10x more productive. Embrace the tools! 🤖",
  "Just refactored 2000 lines of code into 200. Feels amazing. Clean code is happy code! ✨",
  "Weekend project: Building a CLI tool in Rust. Wish me luck! 🦀",
  "Best investment in 2024: A good mechanical keyboard. My WPM went up by 20! ⌨️",
];

const threadContents = [
  "🧵 Thread continues... Here's the first key insight you need to know.",
  "Second point: This is where things get really interesting. Let me explain...",
  "Third: The results speak for themselves. Numbers don't lie! 📊",
  "Fourth: But wait, there's more! Here's the unexpected twist in the story.",
  "Fifth: Wrapping up with the most important takeaway. Don't miss this! 🎯",
  "Here's a deeper dive into the technical details for those interested... 🔍",
  "Quick follow-up: I forgot to mention this crucial point earlier!",
  "Bonus tip that I learned the hard way. Save yourself the headache! 💡",
];

const generateRandomTime = (date: Date): Date => {
  const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
  return setMinutes(setHours(date, hours), minutes);
};

const generateThreads = (mainTweetDate: Date, count: number): TweetThread[] => {
  const threads: TweetThread[] = [];
  let previousDate = mainTweetDate;

  for (let i = 0; i < count; i++) {
    const threadDate = addSeconds(previousDate, 30);
    threads.push({
      id: `thread-${Date.now()}-${i}`,
      content: threadContents[i % threadContents.length],
      scheduledDate: threadDate,
    });
    previousDate = threadDate;
  }

  return threads;
};

const generateTweet = (dayOffset: number, index: number): Tweet => {
  const date = addDays(weekStart, dayOffset);
  const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
  const content = tweetContents[(dayOffset * 2 + index) % tweetContents.length];
  const scheduledDate = generateRandomTime(date);
  
  // Randomly add 0-3 threads to some tweets
  const threadCount = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
  const threads = threadCount > 0 ? generateThreads(scheduledDate, threadCount) : undefined;
  
  return {
    id: `tweet-${dayOffset}-${index}-${Date.now()}`,
    content,
    scheduledDate,
    author,
    likes: Math.floor(Math.random() * 500) + 10,
    retweets: Math.floor(Math.random() * 100) + 5,
    threads,
  };
};

export const getDayName = (dayIndex: number): DayOfWeek => {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days[dayIndex];
};

export const getDayTitle = (day: DayOfWeek): string => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

export const generateMockColumns = (): KanbanColumn[] => {
  const columns: KanbanColumn[] = [];
  
  for (let i = 0; i < 7; i++) {
    const dayName = getDayName(i);
    const date = addDays(weekStart, i);
    const tweetCount = Math.floor(Math.random() * 3) + 1; // 1-3 tweets per day
    
    const tweets: Tweet[] = [];
    for (let j = 0; j < tweetCount; j++) {
      tweets.push(generateTweet(i, j));
    }
    
    columns.push({
      id: dayName,
      title: getDayTitle(dayName),
      date,
      tweets: tweets.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime()),
    });
  }
  
  return columns;
};

export const generateNewTweet = (content: string = ''): Tweet => {
  const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
  const randomContent = content || tweetContents[Math.floor(Math.random() * tweetContents.length)];
  
  return {
    id: `tweet-new-${Date.now()}`,
    content: randomContent,
    scheduledDate: new Date(),
    author,
    likes: 0,
    retweets: 0,
  };
};

export const generateNewThread = (mainTweetDate: Date, existingThreads: TweetThread[] = []): TweetThread => {
  const lastDate = existingThreads.length > 0 
    ? existingThreads[existingThreads.length - 1].scheduledDate 
    : mainTweetDate;
  
  return {
    id: `thread-new-${Date.now()}`,
    content: threadContents[Math.floor(Math.random() * threadContents.length)],
    scheduledDate: addSeconds(lastDate, 30),
  };
};

export const regenerateTweetContent = (): string => {
  return tweetContents[Math.floor(Math.random() * tweetContents.length)];
};

export const regenerateThreadContent = (): string => {
  return threadContents[Math.floor(Math.random() * threadContents.length)];
};

export const recalculateThreadDates = (mainTweetDate: Date, threads: TweetThread[]): TweetThread[] => {
  let previousDate = mainTweetDate;
  
  return threads.map((thread) => {
    const newDate = addSeconds(previousDate, 30);
    previousDate = newDate;
    return {
      ...thread,
      scheduledDate: newDate,
    };
  });
};
