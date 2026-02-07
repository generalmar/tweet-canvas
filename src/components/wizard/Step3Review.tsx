import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Youtube, 
  Calendar, 
  Clock, 
  Hash,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WizardState, toneOptions } from '@/types/wizard';
import { toast } from 'sonner';

interface Step3Props {
  state: WizardState;
  onBack: () => void;
  onGenerate: () => void;
}

const methodIcons = {
  youtube: Youtube,
  ai: Sparkles,
};

const methodLabels = {
  youtube: 'YouTube Video',
  ai: 'AI Generated',
};

const methodColors = {
  youtube: 'text-red-500',
  ai: 'text-purple-500',
};

export const Step3Review = ({ state, onBack, onGenerate }: Step3Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Tweets generated successfully!', {
      description: 'Your content has been added to the scheduler',
    });
    
    onGenerate();
    navigate('/schedule');
  };

  const MethodIcon = state.creationMethod ? methodIcons[state.creationMethod] : Sparkles;

  const getTotalTweets = () => {
    const { campaignConfig } = state;
    const weeksInCampaign = Math.ceil(campaignConfig.timeline / 7);
    return weeksInCampaign * campaignConfig.postingDays.length * campaignConfig.postsPerDay;
  };

  const selectedTone = toneOptions.find(t => t.id === state.aiConfig.tone);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Review Your Campaign</h2>
        <p className="text-muted-foreground mt-1">Confirm your settings before generating</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creation Method Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MethodIcon className={cn('w-5 h-5', state.creationMethod && methodColors[state.creationMethod])} />
              Content Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Method</span>
              <Badge variant="secondary">
                {state.creationMethod && methodLabels[state.creationMethod]}
              </Badge>
            </div>

            {state.creationMethod === 'youtube' && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">URL</span>
                  <span className="text-sm font-medium text-right truncate max-w-[200px]">
                    {state.youtubeConfig.url}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Include Threads</span>
                  <Badge variant={state.youtubeConfig.includeThreads ? 'default' : 'outline'}>
                    {state.youtubeConfig.includeThreads ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </>
            )}

            {state.creationMethod === 'ai' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Niche</span>
                  <Badge variant="secondary">
                    {state.aiConfig.niche || state.aiConfig.customNiche}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tone</span>
                  <Badge variant="secondary">
                    {selectedTone?.emoji} {selectedTone?.label}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Content Pillars</span>
                  <div className="flex flex-wrap gap-1">
                    {state.aiConfig.contentPillars.map((pillar) => (
                      <Badge key={pillar} variant="outline" className="text-xs">
                        {pillar}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

          </CardContent>
        </Card>

        {/* Campaign Config Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Campaign Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Duration
              </span>
              <Badge variant="secondary">{state.campaignConfig.timeline} days</Badge>
            </div>

            <div className="space-y-1.5">
              <span className="text-sm text-muted-foreground">Posting Days</span>
              <div className="flex flex-wrap gap-1">
                {state.campaignConfig.postingDays.map((day) => (
                  <Badge key={day} variant="outline" className="capitalize text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Posts per Day
              </span>
              <Badge variant="secondary">{state.campaignConfig.postsPerDay}</Badge>
            </div>

            <div className="space-y-1.5">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Time Slots
              </span>
              <div className="flex flex-wrap gap-1">
                {state.campaignConfig.timeSlots.map((slot, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Summary */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Your campaign will create approximately{' '}
                <span className="font-bold text-primary">{getTotalTweets()} tweets</span>{' '}
                over {state.campaignConfig.timeline} days
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{getTotalTweets()}</div>
              <div className="text-xs text-muted-foreground">Total Tweets</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2" 
          onClick={onBack}
          disabled={isGenerating}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          size="lg" 
          className="gap-2 min-w-[160px]" 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Tweets
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
