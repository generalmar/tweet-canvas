import { useEffect } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Clock, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { WizardState, CampaignConfig } from '@/types/wizard';
import { addDays, format, isAfter, startOfDay, getDay } from 'date-fns';

interface Step2Props {
  state: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const timelineOptions: { days: 7 | 14 | 30; label: string; description: string }[] = [
  { days: 7, label: '1 Week', description: '7 days of content' },
  { days: 14, label: '2 Weeks', description: '14 days of content' },
  { days: 30, label: '1 Month', description: '30 days of content' },
];

const weekDays = [
  { id: 'monday', label: 'Mon', fullLabel: 'Monday' },
  { id: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
  { id: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
  { id: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
  { id: 'friday', label: 'Fri', fullLabel: 'Friday' },
  { id: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
  { id: 'sunday', label: 'Sun', fullLabel: 'Sunday' },
];

const postsPerDayOptions = [1, 2, 3, 4, 5];

export const Step2CampaignConfig = ({ state, onUpdate, onBack, onNext }: Step2Props) => {
  const { campaignConfig } = state;

  // Initialize default posting days on mount
  useEffect(() => {
    if (campaignConfig.postingDays.length === 0) {
      const today = new Date();
      const todayIndex = getDay(today); // 0 = Sunday, 1 = Monday, etc.
      
      // Default to Monday and Wednesday if they're in the future
      // JavaScript getDay: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
      const defaultDays: string[] = [];
      
      // Check if Monday is in the future (today is Sunday or earlier in week)
      if (todayIndex < 1 || todayIndex === 0) {
        defaultDays.push('monday');
      }
      // Check if Wednesday is in the future
      if (todayIndex < 3) {
        defaultDays.push('wednesday');
      }
      
      // If no valid defaults, use next available weekdays
      if (defaultDays.length === 0) {
        if (todayIndex < 4) defaultDays.push('thursday');
        if (todayIndex < 5) defaultDays.push('friday');
        if (defaultDays.length === 0) {
          defaultDays.push('monday', 'wednesday'); // Next week
        }
      }

      onUpdate({
        campaignConfig: { ...campaignConfig, postingDays: defaultDays }
      });
    }
  }, []);

  const handleTimelineSelect = (days: 7 | 14 | 30) => {
    onUpdate({
      campaignConfig: { ...campaignConfig, timeline: days }
    });
  };

  const handleDayToggle = (dayId: string) => {
    const currentDays = campaignConfig.postingDays;
    const updatedDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId];
    
    onUpdate({
      campaignConfig: { ...campaignConfig, postingDays: updatedDays }
    });
  };

  const handlePostsPerDayChange = (count: number) => {
    // Adjust time slots based on posts per day
    const defaultTimeSlots = generateDefaultTimeSlots(count);
    onUpdate({
      campaignConfig: { 
        ...campaignConfig, 
        postsPerDay: count,
        timeSlots: defaultTimeSlots
      }
    });
  };

  const handleTimeSlotChange = (index: number, value: string) => {
    const newTimeSlots = [...campaignConfig.timeSlots];
    newTimeSlots[index] = value;
    onUpdate({
      campaignConfig: { ...campaignConfig, timeSlots: newTimeSlots }
    });
  };

  const generateDefaultTimeSlots = (count: number): string[] => {
    const slots = ['09:00', '12:00', '15:00', '18:00', '21:00'];
    return slots.slice(0, count);
  };

  // Ensure time slots array matches posts per day
  useEffect(() => {
    if (campaignConfig.timeSlots.length !== campaignConfig.postsPerDay) {
      const newSlots = generateDefaultTimeSlots(campaignConfig.postsPerDay);
      onUpdate({
        campaignConfig: { ...campaignConfig, timeSlots: newSlots }
      });
    }
  }, [campaignConfig.postsPerDay]);

  const getEndDate = () => {
    return addDays(new Date(), campaignConfig.timeline);
  };

  const isStepValid = () => {
    return campaignConfig.postingDays.length > 0 && 
           campaignConfig.timeSlots.length === campaignConfig.postsPerDay;
  };

  return (
    <div className="space-y-8">
      {/* Timeline Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Campaign Timeline</h2>
            <p className="text-sm text-muted-foreground">How long should this campaign run?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {timelineOptions.map((option) => {
            const isSelected = campaignConfig.timeline === option.days;
            return (
              <Card
                key={option.days}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  'border-2',
                  isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'
                )}
                onClick={() => handleTimelineSelect(option.days)}
              >
                <CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-foreground">{option.days}</div>
                  <div className="text-sm font-medium text-foreground mt-1">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                  {isSelected && (
                    <div className="text-xs text-primary mt-2">
                      Ends {format(getEndDate(), 'MMM d, yyyy')}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Posting Days */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Posting Days
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">Select which days you want to post</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => {
              const isSelected = campaignConfig.postingDays.includes(day.id);
              return (
                <Button
                  key={day.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'min-w-[70px] transition-all',
                    isSelected && 'shadow-md'
                  )}
                  onClick={() => handleDayToggle(day.id)}
                >
                  {day.label}
                </Button>
              );
            })}
          </div>

          {campaignConfig.postingDays.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Posting on {campaignConfig.postingDays.length} day{campaignConfig.postingDays.length > 1 ? 's' : ''} per week
            </p>
          )}
        </CardContent>
      </Card>

      {/* Posts Per Day */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Posts Per Day
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">How many tweets per posting day?</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {postsPerDayOptions.map((count) => (
              <Button
                key={count}
                variant={campaignConfig.postsPerDay === count ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  'w-14 h-14 text-lg font-bold',
                  campaignConfig.postsPerDay === count && 'shadow-md'
                )}
                onClick={() => handlePostsPerDayChange(count)}
              >
                {count}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Preferred Time Slots
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set the times for each daily post
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {campaignConfig.timeSlots.map((slot, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Post #{index + 1}
                </Label>
                <Input
                  type="time"
                  value={slot}
                  onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                  className="text-center"
                />
              </div>
            ))}
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">📊 Tip:</span> Optimal posting times are usually 9 AM, 12 PM, and 6 PM in your timezone for maximum engagement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">Campaign Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{campaignConfig.timeline} days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Posting Days</p>
              <p className="font-medium">{campaignConfig.postingDays.length} days/week</p>
            </div>
            <div>
              <p className="text-muted-foreground">Posts/Day</p>
              <p className="font-medium">{campaignConfig.postsPerDay} posts</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Tweets</p>
              <p className="font-medium text-primary">
                ~{Math.ceil(campaignConfig.timeline / 7) * campaignConfig.postingDays.length * campaignConfig.postsPerDay} tweets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" size="lg" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button size="lg" className="gap-2" disabled={!isStepValid()} onClick={onNext}>
          Review
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
