import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Mic,
  MicOff,
  Smile,
  Paperclip,
  Image,
  Camera,
  Plus,
  Sticker,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import WhatsAppEmojiPicker from "./WhatsAppEmojiPicker";
import WhatsAppStickerPicker from "./WhatsAppStickerPicker";
import ImageUploadModal from "./ImageUploadModal";

interface WhatsAppChatInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: (
    type: "text" | "voice" | "sticker" | "media" | "emoji",
    content: string,
    metadata?: any,
  ) => void;
  isMobile?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const WhatsAppChatInput: React.FC<WhatsAppChatInputProps> = ({
  messageInput,
  setMessageInput,
  onSendMessage,
  isMobile = false,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiSticker, setShowEmojiSticker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [voicePermission, setVoicePermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check microphone permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        setVoicePermission(permission.state);
        permission.onchange = () => setVoicePermission(permission.state);
      } catch (error) {
        console.log("Permission API not supported");
      }
    };
    checkPermission();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        onSendMessage("voice", audioUrl, {
          duration: recordingTime,
          transcription: "Voice message recorded",
          audioBlob,
        });

        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = inputRef.current?.selectionStart || messageInput.length;
    const newValue = 
      messageInput.slice(0, cursorPosition) + 
      emoji + 
      messageInput.slice(cursorPosition);
    
    setMessageInput(newValue);
    setShowEmojiSticker(false);
    
    // Focus back and set cursor position
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    }, 100);
  };

  const handleStickerSelect = (sticker: any) => {
    onSendMessage("sticker", sticker.emoji, {
      name: sticker.name,
      id: sticker.id,
      pack: sticker.pack,
      animated: sticker.animated,
    });
    setShowEmojiSticker(false);
  };

  const handleFileUpload = async (files: FileList | null, type: "file" | "camera") => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileUrl = URL.createObjectURL(file);
      
      onSendMessage("media", fileUrl, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        mediaType: file.type.startsWith("image/") ? "image" : 
                  file.type.startsWith("video/") ? "video" : "file",
        file,
        source: type,
      });
    }
  };

  const handleImageUploadSend = (files: File[], caption?: string) => {
    files.forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      onSendMessage("media", fileUrl, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        mediaType: file.type.startsWith("image/") ? "image" : 
                  file.type.startsWith("video/") ? "video" : "file",
        file,
        caption,
        source: "gallery",
      });
    });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendText = () => {
    if (messageInput.trim()) {
      onSendMessage("text", messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <>
      <div
        className={cn(
          "border-t bg-white dark:bg-gray-900 transition-all duration-200",
          isMobile ? "p-2" : "p-3",
          isRecording && "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
        )}
      >
        {/* Recording overlay */}
        {isRecording && (
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {formatRecordingTime(recordingTime)}
              </span>
              <Button
                onClick={stopRecording}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 h-8 px-3"
              >
                <MicOff className="w-4 h-4 mr-1" />
                Stop
              </Button>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleFileUpload(e.target.files, "file")}
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        />
        <input
          ref={cameraInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          capture="environment"
          onChange={(e) => handleFileUpload(e.target.files, "camera")}
        />

        {/* Main input area */}
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <Popover open={showAttachments} onOpenChange={setShowAttachments}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
                  isMobile ? "h-10 w-10" : "h-9 w-9"
                )}
                disabled={disabled || isRecording}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-56 p-2" align="start">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="h-auto p-3 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  onClick={() => {
                    setShowImageUpload(true);
                    setShowAttachments(false);
                  }}
                >
                  <Image className="h-6 w-6 text-blue-600" />
                  <span className="text-xs font-medium">Photos</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-auto p-3 flex flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                  onClick={() => {
                    cameraInputRef.current?.click();
                    setShowAttachments(false);
                  }}
                >
                  <Camera className="h-6 w-6 text-green-600" />
                  <span className="text-xs font-medium">Camera</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-auto p-3 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachments(false);
                  }}
                >
                  <Paperclip className="h-6 w-6 text-purple-600" />
                  <span className="text-xs font-medium">Document</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-auto p-3 flex flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg"
                  onClick={() => {
                    setShowEmojiSticker(true);
                    setShowAttachments(false);
                  }}
                >
                  <Sticker className="h-6 w-6 text-orange-600" />
                  <span className="text-xs font-medium">Sticker</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Message input container */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={cn(
                "rounded-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:border-green-500 focus:ring-green-500 transition-all duration-200 pr-12",
                isMobile ? "h-10 text-base" : "h-9 text-sm"
              )}
              disabled={disabled || isRecording}
              maxLength={4096}
            />

            {/* Emoji/Sticker button inside input */}
            <Popover open={showEmojiSticker} onOpenChange={setShowEmojiSticker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200",
                    isMobile ? "h-8 w-8" : "h-7 w-7"
                  )}
                  disabled={disabled || isRecording}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" className="w-auto p-0" align="end">
                <Tabs defaultValue="emojis" className="w-80">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="emojis" className="text-sm">
                      😊 Emojis
                    </TabsTrigger>
                    <TabsTrigger value="stickers" className="text-sm">
                      🎯 Stickers
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="emojis" className="p-0">
                    <WhatsAppEmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </TabsContent>
                  <TabsContent value="stickers" className="p-0">
                    <WhatsAppStickerPicker onStickerSelect={handleStickerSelect} />
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </div>

          {/* Send/Voice button */}
          {messageInput.trim() ? (
            <Button
              onClick={handleSendText}
              className={cn(
                "flex-shrink-0 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105",
                isMobile ? "h-10 w-10" : "h-9 w-9"
              )}
              disabled={disabled}
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "flex-shrink-0 rounded-full transition-all duration-200 hover:scale-105 shadow-lg",
                isRecording
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                  : "bg-green-600 hover:bg-green-700 text-white",
                isMobile ? "h-10 w-10" : "h-9 w-9"
              )}
              disabled={disabled || voicePermission === "denied"}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Character count for long messages */}
        {messageInput.length > 3000 && (
          <div className="mt-1 text-right">
            <span className={cn(
              "text-xs",
              messageInput.length > 4000 ? "text-red-500" : "text-gray-500"
            )}>
              {messageInput.length}/4096
            </span>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onSend={handleImageUploadSend}
        allowMultiple={true}
        maxFiles={10}
        maxSize={50}
      />
    </>
  );
};

export default WhatsAppChatInput;
