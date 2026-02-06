import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  PenSquare, 
  TrendingUp, 
  Clock, 
  BarChart3,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Target
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const stats = [
  { 
    label: 'Scheduled Tweets', 
    value: '24', 
    change: '+12%', 
    icon: CalendarDays, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    label: 'Tweets This Week', 
    value: '8', 
    change: '+5%', 
    icon: MessageSquare, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  { 
    label: 'Avg. Engagement', 
    value: '4.2%', 
    change: '+0.8%', 
    icon: TrendingUp, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    label: 'Active Campaigns', 
    value: '3', 
    change: 'Active', 
    icon: Target, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
];

const quickActions = [
  { 
    title: 'Create New Tweet', 
    description: 'Start a new tweet campaign',
    icon: PenSquare,
    path: '/create',
    gradient: 'from-primary to-accent'
  },
  { 
    title: 'View Schedule', 
    description: 'Manage your content calendar',
    icon: CalendarDays,
    path: '/schedule',
    gradient: 'from-blue-500 to-cyan-500'
  },
];

const upcomingTweets = [
  { time: '9:00 AM', content: '🚀 Just shipped a new feature! The drag-and-drop experience is amazing...', day: 'Today' },
  { time: '2:00 PM', content: 'Hot take: TypeScript isn\'t optional anymore. It\'s essential for any...', day: 'Today' },
  { time: '9:00 AM', content: 'Pro tip: Use CSS Grid for complex layouts. Flexbox is great, but...', day: 'Tomorrow' },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your content
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                      <stat.icon className={cn('w-5 h-5', stat.color)} />
                    </div>
                    <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Engagement Chart */}
          <EngagementChart />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.path} to={action.path}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br text-white',
                          action.gradient
                        )}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                        <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                          Get started
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* AI Suggestion Card */}
              <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">AI Content Suggestions</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your niche, here are some trending topics you could tweet about today.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">
                          🔥 React Server Components
                        </span>
                        <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">
                          💡 AI Productivity Tips
                        </span>
                        <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">
                          🚀 New CSS Features
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Tweets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Upcoming</h2>
                <Link to="/schedule" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {upcomingTweets.map((tweet, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span className="font-medium">{tweet.day}</span>
                          <span>•</span>
                          <span>{tweet.time}</span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">
                          {tweet.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Impressions</span>
                      <span className="font-medium">12.4K</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Engagements</span>
                      <span className="font-medium">521</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Profile Visits</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">New Followers</span>
                      <span className="font-medium text-green-500">+24</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
