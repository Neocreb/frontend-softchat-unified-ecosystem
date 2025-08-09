import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  List, 
  MessageSquare, 
  Info 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export type SimpleFeedMode = 'classic' | 'threaded';

interface SimpleFeedToggleProps {
  currentMode: SimpleFeedMode;
  onModeChange: (mode: SimpleFeedMode) => void;
}

const SimpleFeedToggle: React.FC<SimpleFeedToggleProps> = ({
  currentMode,
  onModeChange
}) => {
  const modes = [
    {
      mode: 'classic' as const,
      label: 'Classic Feed',
      description: 'Traditional social media layout with nested comments',
      icon: <List className="h-4 w-4" />,
    },
    {
      mode: 'threaded' as const,
      label: 'Threaded View',
      description: 'Twitter-style conversation threads',
      icon: <MessageSquare className="h-4 w-4" />,
    }
  ];

  const currentModeInfo = modes.find(mode => mode.mode === currentMode)!;

  return (
    <div className="flex items-center gap-2">
      {/* Current Mode Indicator */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        {currentModeInfo.icon}
        <span className="text-sm font-medium">{currentModeInfo.label}</span>
      </div>

      {/* Mode Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Switch View
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Feed View Modes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {modes.map((mode) => (
            <DropdownMenuItem
              key={mode.mode}
              onClick={() => onModeChange(mode.mode)}
              className={`p-4 cursor-pointer ${
                currentMode === mode.mode ? 'bg-accent' : ''
              }`}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <span className="font-medium">{mode.label}</span>
                  {currentMode === mode.mode && (
                    <Badge variant="default" className="ml-auto">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mode.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem disabled className="p-3 opacity-75">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-blue-500" />
              <div className="text-xs text-muted-foreground">
                <p>Both modes preserve all features including gifts!</p>
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
          onClick={() => onModeChange(currentMode === 'classic' ? 'threaded' : 'classic')}
          className="flex items-center gap-2"
        >
          {currentMode === 'classic' ? (
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

export default SimpleFeedToggle;
