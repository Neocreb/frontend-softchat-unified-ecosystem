import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Scissors,
  Copy,
  Trash2,
  RotateCw,
  Crop,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Move,
  Square,
  Circle,
  Type,
  Palette,
  Sparkles,
  Music,
  Image,
  Filter,
  Layers,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Save,
  Download,
  Undo,
  Redo,
  Settings,
  ArrowLeft,
  Plus,
  Minus,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Blend,
  Contrast,
  Zap,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VideoLayer {
  id: string;
  type: "video" | "audio" | "text" | "image" | "effect";
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  visible: boolean;
  locked: boolean;
  opacity: number;
  volume?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  url?: string;
  text?: string;
  style?: any;
  effects?: string[];
}

interface Transition {
  id: string;
  type: "fade" | "slide" | "dissolve" | "wipe" | "zoom" | "spin" | "none";
  duration: number;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

interface ColorCorrection {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  gamma: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
}

interface AudioSettings {
  volume: number;
  mute: boolean;
  fade: {
    in: number;
    out: number;
  };
  eq: {
    low: number;
    mid: number;
    high: number;
  };
  effects: string[];
}

interface VideoEditingSuiteProps {
  initialVideo?: File;
  duration: number;
  onExport: (videoBlob: Blob, metadata: any) => void;
  onClose: () => void;
  className?: string;
}

const VideoEditingSuite: React.FC<VideoEditingSuiteProps> = ({
  initialVideo,
  duration,
  onExport,
  onClose,
  className,
}) => {
  // Timeline state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<VideoLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [playheadPosition, setPlayheadPosition] = useState(0);

  // Editing state
  const [activeTab, setActiveTab] = useState<"cut" | "effects" | "audio" | "text" | "color">("cut");
  const [cutMode, setCutMode] = useState<"split" | "trim" | "delete">("split");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Tools state
  const [colorCorrection, setColorCorrection] = useState<ColorCorrection>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    gamma: 1,
    highlights: 0,
    shadows: 0,
    temperature: 0,
    tint: 0,
  });

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    volume: 100,
    mute: false,
    fade: { in: 0, out: 0 },
    eq: { low: 0, mid: 0, high: 0 },
    effects: [],
  });

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  const { toast } = useToast();

  // Initialize with video layer
  useEffect(() => {
    if (initialVideo) {
      const videoLayer: VideoLayer = {
        id: "main-video",
        type: "video",
        name: "Main Video",
        startTime: 0,
        endTime: duration,
        duration,
        visible: true,
        locked: false,
        opacity: 1,
        volume: 1,
        url: URL.createObjectURL(initialVideo),
        effects: [],
      };
      setLayers([videoLayer]);
    }
  }, [initialVideo, duration]);

  // Timeline controls
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
    setPlayheadPosition(percentage * 100);
  }, [duration]);

  const handleSplit = useCallback(() => {
    if (!selectedLayer) return;

    const layer = layers.find(l => l.id === selectedLayer);
    if (!layer) return;

    // Split layer at current time
    const newLayer: VideoLayer = {
      ...layer,
      id: `${layer.id}-split-${Date.now()}`,
      name: `${layer.name} (Split)`,
      startTime: currentTime,
      endTime: layer.endTime,
      duration: layer.endTime - currentTime,
    };

    const updatedLayers = layers.map(l => 
      l.id === selectedLayer 
        ? { ...l, endTime: currentTime, duration: currentTime - l.startTime }
        : l
    );

    setLayers([...updatedLayers, newLayer]);
    
    toast({
      title: "Layer Split",
      description: "Video layer has been split at the current position",
    });
  }, [selectedLayer, layers, currentTime]);

  const handleTrim = useCallback((layerId: string, start: number, end: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { 
            ...layer, 
            startTime: start, 
            endTime: end, 
            duration: end - start 
          }
        : layer
    ));
  }, []);

  const handleDeleteLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayer === layerId) {
      setSelectedLayer(null);
    }
    
    toast({
      title: "Layer Deleted",
      description: "Video layer has been removed",
    });
  }, [selectedLayer]);

  const addTextLayer = useCallback(() => {
    const textLayer: VideoLayer = {
      id: `text-${Date.now()}`,
      type: "text",
      name: "Text Layer",
      startTime: currentTime,
      endTime: currentTime + 5,
      duration: 5,
      visible: true,
      locked: false,
      opacity: 1,
      x: 50,
      y: 50,
      width: 300,
      height: 100,
      text: "Enter text here",
      style: {
        fontSize: 24,
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "transparent",
        textAlign: "center",
        fontWeight: "normal",
        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
      },
    };

    setLayers(prev => [...prev, textLayer]);
    setSelectedLayer(textLayer.id);
    
    toast({
      title: "Text Layer Added",
      description: "New text layer has been added to the timeline",
    });
  }, [currentTime]);

  const addImageLayer = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageLayer: VideoLayer = {
          id: `image-${Date.now()}`,
          type: "image",
          name: file.name,
          startTime: currentTime,
          endTime: currentTime + 3,
          duration: 3,
          visible: true,
          locked: false,
          opacity: 1,
          x: 0,
          y: 0,
          width: 200,
          height: 150,
          url: URL.createObjectURL(file),
        };

        setLayers(prev => [...prev, imageLayer]);
        setSelectedLayer(imageLayer.id);
      }
    };
    input.click();
  }, [currentTime]);

  const applyEffect = useCallback((effectType: string) => {
    if (!selectedLayer) return;

    setLayers(prev => prev.map(layer => 
      layer.id === selectedLayer 
        ? { 
            ...layer, 
            effects: [...(layer.effects || []), effectType] 
          }
        : layer
    ));
    
    toast({
      title: "Effect Applied",
      description: `${effectType} effect has been applied to the layer`,
    });
  }, [selectedLayer]);

  const applyColorCorrection = useCallback(() => {
    if (!selectedLayer) return;

    // Apply color correction to selected layer
    const layer = layers.find(l => l.id === selectedLayer);
    if (layer?.type === "video") {
      toast({
        title: "Color Correction Applied",
        description: "Color settings have been applied to the video",
      });
    }
  }, [selectedLayer, layers, colorCorrection]);

  const exportVideo = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Mock video export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setExportProgress(100);

      // Create mock video blob
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Edited Video", canvas.width / 2, canvas.height / 2);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const metadata = {
            layers: layers.length,
            duration,
            effects: layers.flatMap(l => l.effects || []),
            colorCorrection,
            audioSettings,
          };
          
          onExport(blob, metadata);
        }
      }, "video/webm");

      toast({
        title: "Export Complete",
        description: "Your edited video has been exported successfully",
      });

    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [layers, duration, colorCorrection, audioSettings, onExport]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("fixed inset-0 bg-black text-white z-50 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Video Editor</h1>
          <Badge variant="secondary">Professional</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <Button onClick={exportVideo} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting... {exportProgress}%
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Tools Panel */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab as any} className="h-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800">
              <TabsTrigger value="cut" className="text-xs">
                <Scissors className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">
                <Sparkles className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-xs">
                <Volume2 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs">
                <Type className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs">
                <Palette className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="p-4 space-y-4">
              <TabsContent value="cut" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Cut Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        variant={cutMode === "split" ? "default" : "ghost"}
                        onClick={() => setCutMode("split")}
                      >
                        <Scissors className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={cutMode === "trim" ? "default" : "ghost"}
                        onClick={() => setCutMode("trim")}
                      >
                        <Crop className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={cutMode === "delete" ? "default" : "ghost"}
                        onClick={() => setCutMode("delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleSplit}
                      disabled={!selectedLayer}
                    >
                      Split at Playhead
                    </Button>

                    <div className="space-y-2">
                      <Label>Timeline Zoom</Label>
                      <Slider
                        value={[zoom * 100]}
                        onValueChange={([value]) => setZoom(value / 100)}
                        min={50}
                        max={500}
                        step={25}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Video Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {["Blur", "Sharpen", "Vintage", "B&W", "Sepia", "Glow"].map((effect) => (
                        <Button
                          key={effect}
                          size="sm"
                          variant="ghost"
                          onClick={() => applyEffect(effect)}
                          disabled={!selectedLayer}
                        >
                          {effect}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Opacity</Label>
                      <Slider
                        value={[selectedLayer ? (layers.find(l => l.id === selectedLayer)?.opacity || 1) * 100 : 100]}
                        onValueChange={([value]) => {
                          if (selectedLayer) {
                            setLayers(prev => prev.map(layer => 
                              layer.id === selectedLayer 
                                ? { ...layer, opacity: value / 100 }
                                : layer
                            ));
                          }
                        }}
                        min={0}
                        max={100}
                        step={1}
                        disabled={!selectedLayer}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Audio Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Volume</Label>
                      <Slider
                        value={[audioSettings.volume]}
                        onValueChange={([value]) => 
                          setAudioSettings(prev => ({ ...prev, volume: value }))}
                        min={0}
                        max={200}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Equalizer</Label>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Low</span>
                          <span>Mid</span>
                          <span>High</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Slider
                            orientation="vertical"
                            value={[audioSettings.eq.low + 50]}
                            onValueChange={([value]) => 
                              setAudioSettings(prev => ({ 
                                ...prev, 
                                eq: { ...prev.eq, low: value - 50 } 
                              }))}
                            min={0}
                            max={100}
                            className="h-20"
                          />
                          <Slider
                            orientation="vertical"
                            value={[audioSettings.eq.mid + 50]}
                            onValueChange={([value]) => 
                              setAudioSettings(prev => ({ 
                                ...prev, 
                                eq: { ...prev.eq, mid: value - 50 } 
                              }))}
                            min={0}
                            max={100}
                            className="h-20"
                          />
                          <Slider
                            orientation="vertical"
                            value={[audioSettings.eq.high + 50]}
                            onValueChange={([value]) => 
                              setAudioSettings(prev => ({ 
                                ...prev, 
                                eq: { ...prev.eq, high: value - 50 } 
                              }))}
                            min={0}
                            max={100}
                            className="h-20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="ghost">
                        <Music className="w-4 h-4 mr-2" />
                        Add Music
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Voiceover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Text Layers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={addTextLayer} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Text
                    </Button>

                    <Button onClick={addImageLayer} className="w-full" variant="outline">
                      <Image className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>

                    {selectedLayer && layers.find(l => l.id === selectedLayer)?.type === "text" && (
                      <div className="space-y-3">
                        <div>
                          <Label>Text Content</Label>
                          <Textarea
                            value={layers.find(l => l.id === selectedLayer)?.text || ""}
                            onChange={(e) => {
                              setLayers(prev => prev.map(layer => 
                                layer.id === selectedLayer 
                                  ? { ...layer, text: e.target.value }
                                  : layer
                              ));
                            }}
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Font Size</Label>
                            <Input
                              type="number"
                              value={layers.find(l => l.id === selectedLayer)?.style?.fontSize || 24}
                              onChange={(e) => {
                                const layer = layers.find(l => l.id === selectedLayer);
                                if (layer) {
                                  setLayers(prev => prev.map(l => 
                                    l.id === selectedLayer 
                                      ? { 
                                          ...l, 
                                          style: { 
                                            ...l.style, 
                                            fontSize: parseInt(e.target.value) 
                                          } 
                                        }
                                      : l
                                  ));
                                }
                              }}
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <Input
                              type="color"
                              value={layers.find(l => l.id === selectedLayer)?.style?.color || "#ffffff"}
                              onChange={(e) => {
                                const layer = layers.find(l => l.id === selectedLayer);
                                if (layer) {
                                  setLayers(prev => prev.map(l => 
                                    l.id === selectedLayer 
                                      ? { 
                                          ...l, 
                                          style: { 
                                            ...l.style, 
                                            color: e.target.value 
                                          } 
                                        }
                                      : l
                                  ));
                                }
                              }}
                              className="bg-gray-700 border-gray-600 h-10"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="color" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Color Correction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(colorCorrection).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="capitalize">{key}</Label>
                        <Slider
                          value={[typeof value === "number" ? value + (key === "gamma" ? 0 : 50) : 50]}
                          onValueChange={([newValue]) => {
                            const adjustedValue = key === "gamma" 
                              ? Math.max(0.1, newValue / 50)
                              : newValue - 50;
                            setColorCorrection(prev => ({ 
                              ...prev, 
                              [key]: adjustedValue 
                            }));
                          }}
                          min={key === "gamma" ? 10 : 0}
                          max={key === "gamma" ? 300 : 100}
                          step={1}
                        />
                        <div className="text-xs text-gray-400 text-center">
                          {typeof value === "number" ? value.toFixed(1) : value}
                        </div>
                      </div>
                    ))}

                    <Button onClick={applyColorCorrection} className="w-full">
                      Apply Correction
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Preview and Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 bg-gray-800 flex items-center justify-center p-4">
            <div className="relative bg-black rounded-lg overflow-hidden max-w-4xl max-h-[60vh] aspect-video">
              <video
                ref={previewRef}
                className="w-full h-full object-contain"
                controls={false}
              />
              
              {/* Overlay elements for text and images */}
              {layers
                .filter(layer => layer.visible && layer.type !== "video")
                .map(layer => (
                  <div
                    key={layer.id}
                    className={cn(
                      "absolute cursor-move",
                      selectedLayer === layer.id && "ring-2 ring-blue-500"
                    )}
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: layer.width ? `${layer.width}px` : "auto",
                      height: layer.height ? `${layer.height}px` : "auto",
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation || 0}deg) scale(${layer.scaleX || 1}, ${layer.scaleY || 1})`,
                    }}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    {layer.type === "text" && (
                      <div
                        style={{
                          fontSize: `${layer.style?.fontSize || 24}px`,
                          fontFamily: layer.style?.fontFamily || "Arial",
                          color: layer.style?.color || "#ffffff",
                          backgroundColor: layer.style?.backgroundColor || "transparent",
                          textAlign: layer.style?.textAlign || "center",
                          fontWeight: layer.style?.fontWeight || "normal",
                          textShadow: layer.style?.textShadow || "none",
                          padding: "8px",
                        }}
                      >
                        {layer.text}
                      </div>
                    )}
                    
                    {layer.type === "image" && (
                      <img
                        src={layer.url}
                        alt={layer.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-gray-900 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button size="icon" variant="ghost">
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button size="icon" variant="ghost">
                  <SkipForward className="w-5 h-5" />
                </Button>
                
                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm">{Math.round(zoom * 100)}%</span>
                <Button size="sm" variant="ghost">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="space-y-2">
              {layers.map((layer, index) => (
                <div key={layer.id} className="flex items-center gap-2">
                  <div className="w-24 text-xs truncate">{layer.name}</div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6"
                      onClick={() => {
                        setLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, visible: !l.visible } : l
                        ));
                      }}
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6"
                      onClick={() => {
                        setLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, locked: !l.locked } : l
                        ));
                      }}
                    >
                      {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </Button>
                  </div>
                  
                  <div
                    ref={timelineRef}
                    className="flex-1 h-8 bg-gray-700 rounded relative cursor-pointer"
                    onClick={handleTimelineClick}
                  >
                    {/* Layer block */}
                    <div
                      className={cn(
                        "absolute h-full rounded",
                        layer.type === "video" ? "bg-blue-600" :
                        layer.type === "audio" ? "bg-green-600" :
                        layer.type === "text" ? "bg-purple-600" :
                        layer.type === "image" ? "bg-yellow-600" : "bg-gray-600",
                        selectedLayer === layer.id && "ring-2 ring-white"
                      )}
                      style={{
                        left: `${(layer.startTime / duration) * 100}%`,
                        width: `${(layer.duration / duration) * 100}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLayer(layer.id);
                      }}
                    />
                    
                    {/* Playhead */}
                    {index === 0 && (
                      <div
                        className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
                        style={{ left: `${playheadPosition}%` }}
                      />
                    )}
                  </div>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={() => handleDeleteLayer(layer.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditingSuite;
