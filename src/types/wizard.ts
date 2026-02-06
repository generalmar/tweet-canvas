export type CreationMethod = 'youtube' | 'ai' | 'custom';

export type TweetTone = 'educational' | 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial';

export interface YouTubeConfig {
  url: string;
  includeThreads: boolean;
}

export interface AIConfig {
  niche: string;
  customNiche?: string;
  contentPillars: string[];
  tone: TweetTone;
}

export interface CustomThreadItem {
  id: string;
  content: string;
  mediaFiles: File[];
}

export interface CustomConfig {
  content: string;
  includeThreads: boolean;
  threads: CustomThreadItem[];
  mediaFiles: File[];
}

export interface CampaignConfig {
  timeline: 7 | 14 | 30;
  postingDays: string[];
  postsPerDay: number;
  timeSlots: string[];
}

export interface WizardState {
  creationMethod: CreationMethod | null;
  youtubeConfig: YouTubeConfig;
  aiConfig: AIConfig;
  customConfig: CustomConfig;
  campaignConfig: CampaignConfig;
}

export const defaultNiches = [
  'Tech & SaaS',
  'Personal Finance',
  'Health & Fitness',
  'Marketing',
  'Entrepreneurship',
  'Productivity',
  'AI & Machine Learning',
  'Web Development',
  'Crypto & Web3',
  'Career Growth',
];

export const defaultContentPillars = [
  'Tips & How-tos',
  'Industry News',
  'Personal Stories',
  'Case Studies',
  'Opinions & Hot Takes',
  'Tutorials',
  'Motivation',
  'Behind the Scenes',
  'Tools & Resources',
  'Q&A',
];

export const toneOptions: { id: TweetTone; label: string; emoji: string; description: string }[] = [
  { id: 'educational', label: 'Educational', emoji: '📚', description: 'Teach and inform' },
  { id: 'professional', label: 'Professional', emoji: '💼', description: 'Business-focused' },
  { id: 'casual', label: 'Casual', emoji: '😊', description: 'Friendly & relaxed' },
  { id: 'humorous', label: 'Humorous', emoji: '😄', description: 'Fun & witty' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨', description: 'Motivating' },
  { id: 'controversial', label: 'Controversial', emoji: '🔥', description: 'Bold opinions' },
];

export const defaultWizardState: WizardState = {
  creationMethod: null,
  youtubeConfig: {
    url: '',
    includeThreads: true,
  },
  aiConfig: {
    niche: '',
    customNiche: '',
    contentPillars: [],
    tone: 'educational',
  },
  customConfig: {
    content: '',
    includeThreads: false,
    threads: [],
    mediaFiles: [],
  },
  campaignConfig: {
    timeline: 7,
    postingDays: [],
    postsPerDay: 2,
    timeSlots: ['09:00', '18:00'],
  },
};
