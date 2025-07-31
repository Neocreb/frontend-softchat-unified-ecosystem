import React, { useState, useEffect, useRef } from "react";
import {
  Subtitles,
  Languages,
  Settings,
  Download,
  Edit,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Loader2,
  Check,
  X,
  Globe,
  Type,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Caption {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  confidence: number;
  speaker?: string;
  language: string;
}

interface CaptionStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  position: "bottom" | "top" | "center";
  alignment: "left" | "center" | "right";
  opacity: number;
  outline: boolean;
  shadow: boolean;
}

interface AutoCaptionsEngineProps {
  videoUrl: string;
  videoId: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onCaptionsGenerated?: (captions: Caption[]) => void;
  onCaptionsExport?: (captions: Caption[], format: string) => void;
  className?: string;
}

const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

const fontFamilies = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Georgia", label: "Georgia" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
];

const AutoCaptionsEngine: React.FC<AutoCaptionsEngineProps> = ({
  videoUrl,
  videoId,
  duration,
  currentTime,
  isPlaying,
  onCaptionsGenerated,
  onCaptionsExport,
  className,
}) => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [speakerDetection, setSpeakerDetection] = useState(false);
  const [confidence, setConfidence] = useState(0.8);

  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({
    fontSize: 16,
    fontFamily: "Arial",
    color: "#ffffff",
    backgroundColor: "#000000",
    position: "bottom",
    alignment: "center",
    opacity: 0.8,
    outline: true,
    shadow: true,
  });

  const { toast } = useToast();

  // Update current caption based on video time
  useEffect(() => {
    const current = captions.find(
      (caption) => currentTime >= caption.startTime && currentTime <= caption.endTime
    );
    setCurrentCaption(current || null);
  }, [currentTime, captions]);

  const generateCaptions = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI caption generation process
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Mock API call to AI transcription service
      const response = await fetch("/api/ai/generate-captions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
          videoId,
          language: selectedLanguage,
          speakerDetection,
          confidence,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate captions");
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Mock generated captions for demo
      const mockCaptions: Caption[] = [
        {
          id: "1",
          startTime: 0,
          endTime: 3,
          text: "Welcome to this amazing video!",
          confidence: 0.95,
          language: selectedLanguage,
          speaker: speakerDetection ? "Speaker 1" : undefined,
        },
        {
          id: "2",
          startTime: 3,
          endTime: 6,
          text: "Today we're going to explore some incredible features.",
          confidence: 0.92,
          language: selectedLanguage,
          speaker: speakerDetection ? "Speaker 1" : undefined,
        },
        {
          id: "3",
          startTime: 6,
          endTime: 10,
          text: "Let's dive right into the content and see what we can discover.",
          confidence: 0.88,
          language: selectedLanguage,
          speaker: speakerDetection ? "Speaker 1" : undefined,
        },
      ];

      setCaptions(mockCaptions);
      
      if (onCaptionsGenerated) {
        onCaptionsGenerated(mockCaptions);
      }

      toast({
        title: "Captions Generated!",
        description: `Successfully generated ${mockCaptions.length} caption segments`,
      });

    } catch (error) {
      console.error("Caption generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate captions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const translateCaptions = async (targetLang: string) => {
    if (captions.length === 0) return;

    setIsGenerating(true);
    
    try {
      // Mock translation API call
      const translatedCaptions = captions.map((caption) => ({
        ...caption,
        text: caption.text + " (translated)", // Mock translation
        language: targetLang,
      }));

      setCaptions(translatedCaptions);
      setTargetLanguage(targetLang);

      toast({
        title: "Translation Complete",
        description: `Captions translated to ${supportedLanguages.find(l => l.code === targetLang)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Translation Failed",
        description: "Failed to translate captions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const editCaption = (caption: Caption, newText: string) => {
    const updatedCaptions = captions.map((c) =>
      c.id === caption.id ? { ...c, text: newText } : c
    );
    setCaptions(updatedCaptions);
    setEditingCaption(null);
    
    toast({
      title: "Caption Updated",
      description: "Caption has been successfully edited",
    });
  };

  const exportCaptions = (format: string) => {
    if (captions.length === 0) {
      toast({
        title: "No Captions",
        description: "Please generate captions first",
        variant: "destructive",
      });
      return;
    }

    let content = "";
    
    switch (format) {
      case "srt":
        content = captions.map((caption, index) => {
          const startTime = formatTimeForSRT(caption.startTime);
          const endTime = formatTimeForSRT(caption.endTime);
          return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n\n`;
        }).join("");
        break;
      
      case "vtt":
        content = "WEBVTT\n\n" + captions.map((caption) => {
          const startTime = formatTimeForVTT(caption.startTime);
          const endTime = formatTimeForVTT(caption.endTime);
          return `${startTime} --> ${endTime}\n${caption.text}\n\n`;
        }).join("");
        break;
      
      case "json":
        content = JSON.stringify(captions, null, 2);
        break;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `captions-${videoId}.${format}`;
    link.click();
    URL.revokeObjectURL(url);

    if (onCaptionsExport) {
      onCaptionsExport(captions, format);
    }

    toast({
      title: "Export Complete",
      description: `Captions exported as ${format.toUpperCase()}`,
    });
  };

  const formatTimeForSRT = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
  };

  const formatTimeForVTT = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.padStart(6, "0")}`;
  };

  return (
    <div className={cn("bg-black/90 text-white border border-gray-700 rounded-lg", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          AI Auto Captions
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Generation Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={generateCaptions}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="speaker-detection" className="text-sm">
                Speaker Detection
              </Label>
              <Switch
                id="speaker-detection"
                checked={speakerDetection}
                onCheckedChange={setSpeakerDetection}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-translate" className="text-sm">
                Auto Translate
              </Label>
              <Switch
                id="auto-translate"
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <Label className="text-sm">Confidence Threshold: {Math.round(confidence * 100)}%</Label>
            <Slider
              value={[confidence * 100]}
              onValueChange={([value]) => setConfidence(value / 100)}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generating captions...</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Caption List */}
        {captions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Captions ({captions.length})</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 bg-gray-800 border-gray-600">
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => exportCaptions("srt")}
                      >
                        Export SRT
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => exportCaptions("vtt")}
                      >
                        Export VTT
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => exportCaptions("json")}
                      >
                        Export JSON
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Caption Items */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {captions.map((caption) => (
                <div
                  key={caption.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    currentCaption?.id === caption.id
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-gray-800 border-gray-600"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">
                          {formatTimeForVTT(caption.startTime)} → {formatTimeForVTT(caption.endTime)}
                        </span>
                        {caption.speaker && (
                          <Badge variant="outline" className="text-xs">
                            {caption.speaker}
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            caption.confidence > 0.9 ? "text-green-400" :
                            caption.confidence > 0.7 ? "text-yellow-400" : "text-red-400"
                          )}
                        >
                          {Math.round(caption.confidence * 100)}%
                        </Badge>
                      </div>
                      
                      {editingCaption?.id === caption.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingCaption.text}
                            onChange={(e) => setEditingCaption({ ...editingCaption, text: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => editCaption(caption, editingCaption.text)}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCaption(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{caption.text}</p>
                      )}
                    </div>
                    
                    {isEditing && !editingCaption && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCaption(caption)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caption Style Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <Palette className="w-4 h-4 mr-2" />
              Caption Style
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-800 border-gray-600">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Slider
                  value={[captionStyle.fontSize]}
                  onValueChange={([value]) => 
                    setCaptionStyle({ ...captionStyle, fontSize: value })}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={captionStyle.fontFamily}
                  onValueChange={(value) => 
                    setCaptionStyle({ ...captionStyle, fontFamily: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Outline</Label>
                  <Switch
                    checked={captionStyle.outline}
                    onCheckedChange={(checked) => 
                      setCaptionStyle({ ...captionStyle, outline: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Shadow</Label>
                  <Switch
                    checked={captionStyle.shadow}
                    onCheckedChange={(checked) => 
                      setCaptionStyle({ ...captionStyle, shadow: checked })}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Translation */}
        {autoTranslate && captions.length > 0 && (
          <div className="space-y-2">
            <Label>Translate to:</Label>
            <Select onValueChange={(value) => translateCaptions(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {supportedLanguages
                  .filter((lang) => lang.code !== selectedLanguage)
                  .map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Current Caption Display */}
        {showCaptions && currentCaption && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className="px-4 py-2 rounded-lg max-w-md text-center"
              style={{
                fontSize: `${captionStyle.fontSize}px`,
                fontFamily: captionStyle.fontFamily,
                color: captionStyle.color,
                backgroundColor: captionStyle.backgroundColor,
                opacity: captionStyle.opacity,
                textShadow: captionStyle.shadow ? "2px 2px 4px rgba(0,0,0,0.8)" : "none",
                WebkitTextStroke: captionStyle.outline ? "1px black" : "none",
              }}
            >
              {currentCaption.text}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default AutoCaptionsEngine;
