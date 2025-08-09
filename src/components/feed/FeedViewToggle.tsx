import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  List, 
  MessageSquare, 
  Settings, 
  Info,
  Sparkles 
} from 'lucide-react';
import { useEnhancedFeed, FeedViewMode } from '@/contexts/EnhancedFeedContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FeedViewToggle: React.FC = () => {
  const { viewMode, setViewMode } = useEnhancedFeed();

  const viewModes: Array<{
    mode: FeedViewMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
  }> = [
    {
      mode: 'classic',
      label: 'Classic Feed',
      description: 'Traditional social media experience with nested comments',
      icon: <List className="h-4 w-4" />,
      features: [
        'Familiar social media layout',
        'Nested comment system',
        'All current features preserved',
        'Optimized for quick browsing'
      ]
    },
    {
      mode: 'threaded',
      label: 'Threaded View',
      description: 'Twitter-style conversation threads with reply posts',
      icon: <MessageSquare className="h-4 w-4" />,
      features: [
        'Reply posts become standalone content',
        'Better conversation flow',
        'Enhanced discoverability',
        'All features including gifts work on every post'
      ]
    }
  ];

  const currentMode = viewModes.find(mode => mode.mode === viewMode)!;

  return (
    <div className="flex items-center gap-2">
      {/* Current Mode Indicator */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        {currentMode.icon}
        <span className="text-sm font-medium">{currentMode.label}</span>
        {viewMode === 'threaded' && (
          <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            New
          </Badge>
        )}
      </div>

      {/* View Mode Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Switch View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change feed view mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Feed View Modes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {viewModes.map((mode) => (
            <DropdownMenuItem
              key={mode.mode}
              onClick={() => setViewMode(mode.mode)}
              className={`p-4 cursor-pointer ${
                viewMode === mode.mode ? 'bg-accent' : ''
              }`}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <span className="font-medium">{mode.label}</span>
                  {viewMode === mode.mode && (
                    <Badge variant="default" className="ml-auto px-2 py-1 text-xs">
                      Current
                    </Badge>
                  )}
                  {mode.mode === 'threaded' && viewMode !== 'threaded' && (
                    <Badge variant="secondary" className="ml-auto px-2 py-1 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mt-1">
                  {mode.features.slice(0, 2).map((feature, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs px-2 py-0.5"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {mode.features.length > 2 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 text-muted-foreground"
                    >
                      +{mode.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem disabled className="p-3 opacity-75">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-blue-500" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Pro Tip:</p>
                <p>Both modes preserve all features including likes, shares, comments, and gifts. Switch anytime!</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile Quick Toggle */}
      <div className="sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'classic' ? 'threaded' : 'classic')}
          className="flex items-center gap-2"
        >
          {viewMode === 'classic' ? (
            <>
              <MessageSquare className="h-4 w-4" />
              <span>Thread</span>
            </>
          ) : (
            <>
              <List className="h-4 w-4" />
              <span>Classic</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FeedViewToggle;
