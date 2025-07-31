import React, { useState, useEffect } from "react";
import {
  Accessibility,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  Headphones,
  Sun,
  Moon,
  Zap,
  Settings,
  RotateCcw,
  Check,
  X,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  Languages,
  Subtitles,
  Mic,
  Focus,
  Move,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  fontSize: number;
  colorBlindnessFilter: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  darkMode: boolean;
  
  // Audio
  audioDescriptions: boolean;
  captionsEnabled: boolean;
  captionSize: number;
  captionBackground: boolean;
  signLanguage: boolean;
  audioFocus: boolean;
  
  // Motor
  keyboardNavigation: boolean;
  voiceControl: boolean;
  gestureControl: boolean;
  stickyKeys: boolean;
  slowKeys: boolean;
  mouseKeys: boolean;
  
  // Cognitive
  autoPlayDisabled: boolean;
  simplifiedInterface: boolean;
  contentWarnings: boolean;
  focusIndicators: boolean;
  readingGuide: boolean;
  timeExtensions: boolean;
}

interface VideoAccessibilityFeaturesProps {
  videoId: string;
  onSettingsChange?: (settings: AccessibilitySettings) => void;
  className?: string;
}

const VideoAccessibilityFeatures: React.FC<VideoAccessibilityFeaturesProps> = ({
  videoId,
  onSettingsChange,
  className,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    // Visual defaults
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    fontSize: 16,
    colorBlindnessFilter: 'none',
    darkMode: false,
    
    // Audio defaults
    audioDescriptions: false,
    captionsEnabled: true,
    captionSize: 16,
    captionBackground: true,
    signLanguage: false,
    audioFocus: false,
    
    // Motor defaults
    keyboardNavigation: true,
    voiceControl: false,
    gestureControl: false,
    stickyKeys: false,
    slowKeys: false,
    mouseKeys: false,
    
    // Cognitive defaults
    autoPlayDisabled: false,
    simplifiedInterface: false,
    contentWarnings: true,
    focusIndicators: true,
    readingGuide: false,
    timeExtensions: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Accessibility presets for quick setup
  const accessibilityPresets = [
    {
      id: 'visual-impairment',
      name: 'Visual Impairment',
      description: 'High contrast, large text, audio descriptions',
      icon: <Eye className="w-4 h-4" />,
      settings: {
        ...settings,
        highContrast: true,
        largeText: true,
        fontSize: 20,
        audioDescriptions: true,
        focusIndicators: true,
      },
    },
    {
      id: 'hearing-impairment',
      name: 'Hearing Impairment',
      description: 'Captions, visual indicators, sign language',
      icon: <Headphones className="w-4 h-4" />,
      settings: {
        ...settings,
        captionsEnabled: true,
        captionSize: 18,
        captionBackground: true,
        signLanguage: true,
        audioFocus: false,
      },
    },
    {
      id: 'motor-impairment',
      name: 'Motor Impairment',
      description: 'Keyboard navigation, voice control, sticky keys',
      icon: <Hand className="w-4 h-4" />,
      settings: {
        ...settings,
        keyboardNavigation: true,
        voiceControl: true,
        stickyKeys: true,
        slowKeys: true,
        timeExtensions: true,
      },
    },
    {
      id: 'cognitive-impairment',
      name: 'Cognitive Support',
      description: 'Simplified interface, content warnings, reading guides',
      icon: <Focus className="w-4 h-4" />,
      settings: {
        ...settings,
        simplifiedInterface: true,
        contentWarnings: true,
        autoPlayDisabled: true,
        readingGuide: true,
        reducedMotion: true,
      },
    },
  ];

  const colorBlindnessOptions = [
    { value: 'none', label: 'None' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  ];

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
    
    // Apply settings to document
    applyAccessibilitySettings(newSettings);
  };

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply visual settings
    root.style.setProperty('--font-size-base', `${newSettings.fontSize}px`);
    
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Apply color blindness filter
    if (newSettings.colorBlindnessFilter !== 'none') {
      root.classList.add(`colorblind-${newSettings.colorBlindnessFilter}`);
    } else {
      root.classList.remove('colorblind-deuteranopia', 'colorblind-protanopia', 'colorblind-tritanopia');
    }
    
    // Apply dark mode
    if (newSettings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyPreset = (preset: typeof accessibilityPresets[0]) => {
    setSettings(preset.settings);
    setActivePreset(preset.id);
    onSettingsChange?.(preset.settings);
    applyAccessibilitySettings(preset.settings);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      fontSize: 16,
      colorBlindnessFilter: 'none',
      darkMode: false,
      audioDescriptions: false,
      captionsEnabled: true,
      captionSize: 16,
      captionBackground: true,
      signLanguage: false,
      audioFocus: false,
      keyboardNavigation: true,
      voiceControl: false,
      gestureControl: false,
      stickyKeys: false,
      slowKeys: false,
      mouseKeys: false,
      autoPlayDisabled: false,
      simplifiedInterface: false,
      contentWarnings: true,
      focusIndicators: true,
      readingGuide: false,
      timeExtensions: false,
    };
    
    setSettings(defaultSettings);
    setActivePreset(null);
    onSettingsChange?.(defaultSettings);
    applyAccessibilitySettings(defaultSettings);
  };

  // Keyboard navigation support
  useEffect(() => {
    if (settings.keyboardNavigation) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Space bar to play/pause
        if (e.code === 'Space') {
          e.preventDefault();
          // Trigger play/pause on video
        }
        
        // Arrow keys for seeking
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          // Seek backward 10 seconds
        }
        
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          // Seek forward 10 seconds
        }
        
        // M for mute/unmute
        if (e.code === 'KeyM') {
          e.preventDefault();
          // Toggle mute
        }
        
        // C for captions
        if (e.code === 'KeyC') {
          e.preventDefault();
          updateSetting('captionsEnabled', !settings.captionsEnabled);
        }
        
        // F for fullscreen
        if (e.code === 'KeyF') {
          e.preventDefault();
          // Toggle fullscreen
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [settings.keyboardNavigation, settings.captionsEnabled]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applyAccessibilitySettings(parsed);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <>
      {/* Accessibility Quick Access Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed top-4 right-20 z-50 bg-blue-600 hover:bg-blue-700 text-white border-blue-500",
          "focus:ring-4 focus:ring-blue-300 focus:outline-none",
          className
        )}
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {/* Accessibility Settings Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl border-l">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-blue-600" />
                Accessibility Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility settings"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="p-4 space-y-6">
                {/* Quick Presets */}
                <div>
                  <h3 className="font-medium mb-3">Quick Setup</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {accessibilityPresets.map((preset) => (
                      <Button
                        key={preset.id}
                        variant={activePreset === preset.id ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col items-start gap-2"
                        onClick={() => applyPreset(preset)}
                      >
                        <div className="flex items-center gap-2">
                          {preset.icon}
                          <span className="font-medium text-sm">{preset.name}</span>
                        </div>
                        <span className="text-xs text-left opacity-70">
                          {preset.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Detailed Settings */}
                <Tabs defaultValue="visual" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                    <TabsTrigger value="motor">Motor</TabsTrigger>
                    <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visual" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Visual Accessibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="high-contrast">High Contrast</Label>
                          <Switch
                            id="high-contrast"
                            checked={settings.highContrast}
                            onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="large-text">Large Text</Label>
                          <Switch
                            id="large-text"
                            checked={settings.largeText}
                            onCheckedChange={(checked) => updateSetting('largeText', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="reduced-motion">Reduced Motion</Label>
                          <Switch
                            id="reduced-motion"
                            checked={settings.reducedMotion}
                            onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Font Size: {settings.fontSize}px</Label>
                          <Slider
                            value={[settings.fontSize]}
                            onValueChange={([value]) => updateSetting('fontSize', value)}
                            min={12}
                            max={24}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Color Blindness Support</Label>
                          <Select
                            value={settings.colorBlindnessFilter}
                            onValueChange={(value) => updateSetting('colorBlindnessFilter', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {colorBlindnessOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Headphones className="w-4 h-4" />
                          Audio Accessibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="audio-descriptions">Audio Descriptions</Label>
                          <Switch
                            id="audio-descriptions"
                            checked={settings.audioDescriptions}
                            onCheckedChange={(checked) => updateSetting('audioDescriptions', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="captions">Captions</Label>
                          <Switch
                            id="captions"
                            checked={settings.captionsEnabled}
                            onCheckedChange={(checked) => updateSetting('captionsEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="sign-language">Sign Language</Label>
                          <Switch
                            id="sign-language"
                            checked={settings.signLanguage}
                            onCheckedChange={(checked) => updateSetting('signLanguage', checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Caption Size: {settings.captionSize}px</Label>
                          <Slider
                            value={[settings.captionSize]}
                            onValueChange={([value]) => updateSetting('captionSize', value)}
                            min={12}
                            max={24}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="caption-bg">Caption Background</Label>
                          <Switch
                            id="caption-bg"
                            checked={settings.captionBackground}
                            onCheckedChange={(checked) => updateSetting('captionBackground', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="motor" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Hand className="w-4 h-4" />
                          Motor Accessibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="keyboard-nav">Keyboard Navigation</Label>
                          <Switch
                            id="keyboard-nav"
                            checked={settings.keyboardNavigation}
                            onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="voice-control">Voice Control</Label>
                          <Switch
                            id="voice-control"
                            checked={settings.voiceControl}
                            onCheckedChange={(checked) => updateSetting('voiceControl', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="sticky-keys">Sticky Keys</Label>
                          <Switch
                            id="sticky-keys"
                            checked={settings.stickyKeys}
                            onCheckedChange={(checked) => updateSetting('stickyKeys', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="slow-keys">Slow Keys</Label>
                          <Switch
                            id="slow-keys"
                            checked={settings.slowKeys}
                            onCheckedChange={(checked) => updateSetting('slowKeys', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="mouse-keys">Mouse Keys</Label>
                          <Switch
                            id="mouse-keys"
                            checked={settings.mouseKeys}
                            onCheckedChange={(checked) => updateSetting('mouseKeys', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="cognitive" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Focus className="w-4 h-4" />
                          Cognitive Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-play">Disable Auto-play</Label>
                          <Switch
                            id="auto-play"
                            checked={settings.autoPlayDisabled}
                            onCheckedChange={(checked) => updateSetting('autoPlayDisabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="simplified">Simplified Interface</Label>
                          <Switch
                            id="simplified"
                            checked={settings.simplifiedInterface}
                            onCheckedChange={(checked) => updateSetting('simplifiedInterface', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="content-warnings">Content Warnings</Label>
                          <Switch
                            id="content-warnings"
                            checked={settings.contentWarnings}
                            onCheckedChange={(checked) => updateSetting('contentWarnings', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="focus-indicators">Focus Indicators</Label>
                          <Switch
                            id="focus-indicators"
                            checked={settings.focusIndicators}
                            onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="reading-guide">Reading Guide</Label>
                          <Switch
                            id="reading-guide"
                            checked={settings.readingGuide}
                            onCheckedChange={(checked) => updateSetting('readingGuide', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="time-extensions">Time Extensions</Label>
                          <Switch
                            id="time-extensions"
                            checked={settings.timeExtensions}
                            onCheckedChange={(checked) => updateSetting('timeExtensions', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Keyboard Shortcuts Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Keyboard Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Play/Pause:</span>
                        <Badge variant="outline">Space</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Seek backward:</span>
                        <Badge variant="outline">←</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Seek forward:</span>
                        <Badge variant="outline">→</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Mute/Unmute:</span>
                        <Badge variant="outline">M</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Captions:</span>
                        <Badge variant="outline">C</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Fullscreen:</span>
                        <Badge variant="outline">F</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            {/* Reset Button */}
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={resetSettings}
                className="w-full flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoAccessibilityFeatures;
