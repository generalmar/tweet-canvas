import { useState } from 'react';
import { Youtube, Sparkles, PenLine, ArrowRight, Link as LinkIcon, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CustomTweetEditor } from './CustomTweetEditor';
import { 
  CreationMethod, 
  WizardState, 
  defaultNiches, 
  defaultContentPillars, 
  toneOptions,
  CustomThreadItem
} from '@/types/wizard';

interface Step1Props {
  state: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
}

const methodOptions: { 
  id: CreationMethod; 
  icon: typeof Youtube; 
  title: string; 
  description: string;
  gradient: string;
}[] = [
  { 
    id: 'youtube', 
    icon: Youtube, 
    title: 'From YouTube', 
    description: 'Extract content from a video',
    gradient: 'from-red-500 to-red-600'
  },
  { 
    id: 'ai', 
    icon: Sparkles, 
    title: 'AI Generated', 
    description: 'Let AI create for your niche',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'custom', 
    icon: PenLine, 
    title: 'Write Custom', 
    description: 'Create your own content',
    gradient: 'from-blue-500 to-cyan-500'
  },
];

export const Step1CreationMethod = ({ state, onUpdate, onNext }: Step1Props) => {
  const [showCustomNiche, setShowCustomNiche] = useState(false);

  const handleMethodSelect = (method: CreationMethod) => {
    onUpdate({ creationMethod: method });
  };

  const handleNicheSelect = (niche: string) => {
    setShowCustomNiche(false);
    onUpdate({ 
      aiConfig: { 
        ...state.aiConfig, 
        niche, 
        customNiche: '' 
      } 
    });
  };

  const handlePillarToggle = (pillar: string) => {
    const current = state.aiConfig.contentPillars;
    const updated = current.includes(pillar)
      ? current.filter(p => p !== pillar)
      : [...current, pillar];
    onUpdate({ aiConfig: { ...state.aiConfig, contentPillars: updated } });
  };

  const isStepValid = () => {
    if (!state.creationMethod) return false;
    
    switch (state.creationMethod) {
      case 'youtube':
        return state.youtubeConfig.url.trim().length > 0;
      case 'ai':
        return (state.aiConfig.niche || state.aiConfig.customNiche) && 
               state.aiConfig.contentPillars.length > 0;
      case 'custom':
        return state.customConfig.content.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* Method Selection */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">How do you want to create?</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose your content creation method</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {methodOptions.map((method) => {
            const isSelected = state.creationMethod === method.id;
            return (
              <Card
                key={method.id}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-lg',
                  'border-2',
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-primary/30'
                )}
                onClick={() => handleMethodSelect(method.id)}
              >
                <CardContent className="p-5">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br text-white',
                    method.gradient
                  )}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium">
                      <Check className="w-4 h-4" />
                      Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dynamic Form Based on Method */}
      {state.creationMethod === 'youtube' && (
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 text-red-500">
              <Youtube className="w-6 h-6" />
              <h3 className="font-semibold text-lg text-foreground">YouTube Video URL</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-url">Video URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="youtube-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={state.youtubeConfig.url}
                  onChange={(e) => onUpdate({ 
                    youtubeConfig: { ...state.youtubeConfig, url: e.target.value } 
                  })}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll transcribe and summarize the video to generate tweets
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label htmlFor="include-threads" className="font-medium">Include Thread Generation</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Generate multi-tweet threads from the content</p>
              </div>
              <Switch
                id="include-threads"
                checked={state.youtubeConfig.includeThreads}
                onCheckedChange={(checked) => onUpdate({
                  youtubeConfig: { ...state.youtubeConfig, includeThreads: checked }
                })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {state.creationMethod === 'ai' && (
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 text-purple-500">
              <Sparkles className="w-6 h-6" />
              <h3 className="font-semibold text-lg text-foreground">AI Content Configuration</h3>
            </div>
            
            {/* Niche Selection */}
            <div className="space-y-3">
              <Label>Select Your Niche</Label>
              <div className="flex flex-wrap gap-2">
                {defaultNiches.map((niche) => (
                  <Badge
                    key={niche}
                    variant={state.aiConfig.niche === niche ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer py-1.5 px-3 text-sm transition-all',
                      state.aiConfig.niche === niche && 'bg-primary hover:bg-primary/90'
                    )}
                    onClick={() => handleNicheSelect(niche)}
                  >
                    {niche}
                  </Badge>
                ))}
                <Badge
                  variant={showCustomNiche ? 'default' : 'outline'}
                  className="cursor-pointer py-1.5 px-3 text-sm"
                  onClick={() => {
                    setShowCustomNiche(true);
                    onUpdate({ aiConfig: { ...state.aiConfig, niche: '' } });
                  }}
                >
                  + Custom
                </Badge>
              </div>
              {showCustomNiche && (
                <Input
                  placeholder="Enter your custom niche..."
                  value={state.aiConfig.customNiche}
                  onChange={(e) => onUpdate({
                    aiConfig: { ...state.aiConfig, customNiche: e.target.value }
                  })}
                  className="mt-2 animate-fade-in"
                />
              )}
            </div>

            {/* Content Pillars */}
            <div className="space-y-3">
              <div>
                <Label>Content Pillars</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Select topics you regularly create content about</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {defaultContentPillars.map((pillar) => {
                  const isSelected = state.aiConfig.contentPillars.includes(pillar);
                  return (
                    <Badge
                      key={pillar}
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer py-1.5 px-3 text-sm transition-all',
                        isSelected && 'bg-accent hover:bg-accent/90'
                      )}
                      onClick={() => handlePillarToggle(pillar)}
                    >
                      {isSelected && <Check className="w-3 h-3 mr-1" />}
                      {pillar}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <Label>Content Tone</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {toneOptions.map((tone) => {
                  const isSelected = state.aiConfig.tone === tone.id;
                  return (
                    <div
                      key={tone.id}
                      onClick={() => onUpdate({
                        aiConfig: { ...state.aiConfig, tone: tone.id }
                      })}
                      className={cn(
                        'p-3 rounded-xl border-2 cursor-pointer transition-all',
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/50 hover:border-primary/30'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tone.emoji}</span>
                        <div>
                          <p className="font-medium text-sm">{tone.label}</p>
                          <p className="text-xs text-muted-foreground">{tone.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {state.creationMethod === 'custom' && (
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 text-blue-500">
              <PenLine className="w-6 h-6" />
              <h3 className="font-semibold text-lg text-foreground">Write Your Tweet</h3>
            </div>
            
            <CustomTweetEditor
              mainContent={state.customConfig.content}
              onMainContentChange={(content) => onUpdate({
                customConfig: { ...state.customConfig, content }
              })}
              threads={state.customConfig.threads}
              onThreadsChange={(threads: CustomThreadItem[]) => onUpdate({
                customConfig: { ...state.customConfig, threads, includeThreads: threads.length > 0 }
              })}
              mainMediaFiles={state.customConfig.mediaFiles}
              onMainMediaFilesChange={(mediaFiles) => onUpdate({
                customConfig: { ...state.customConfig, mediaFiles }
              })}
            />
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          className="gap-2"
          disabled={!isStepValid()}
          onClick={onNext}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
