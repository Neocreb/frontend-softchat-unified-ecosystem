import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { AtSign, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { GroupParticipant } from "@/types/group-chat";

interface MentionSuggestion {
  id: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'member';
  customTitle?: string;
  isOnline?: boolean;
}

interface GroupMentionInputProps {
  value: string;
  onChange: (value: string, mentionedUsers: MentionSuggestion[]) => void;
  participants: GroupParticipant[];
  currentUserId: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onEnterPress?: () => void;
  maxLength?: number;
}

export const GroupMentionInput: React.FC<GroupMentionInputProps> = ({
  value,
  onChange,
  participants,
  currentUserId,
  placeholder = "Type a message...",
  className,
  disabled = false,
  onEnterPress,
  maxLength = 1000,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartPos, setMentionStartPos] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [mentionedUsers, setMentionedUsers] = useState<MentionSuggestion[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter participants for suggestions (exclude current user and already mentioned)
  const availableParticipants = participants.filter(
    p => p.id !== currentUserId && p.isActive
  );

  // Filter suggestions based on mention query
  const filteredSuggestions = availableParticipants.filter(participant =>
    participant.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle input change and detect mentions
  const handleInputChange = (newValue: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    setCursorPosition(cursorPos);

    // Find @ symbol before cursor
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      // Check if @ is at start or preceded by whitespace
      const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' ';
      if (charBeforeAt === ' ' || lastAtIndex === 0) {
        const afterAt = textBeforeCursor.slice(lastAtIndex + 1);
        
        // Check if there's no space after @
        if (!afterAt.includes(' ') && !afterAt.includes('\n')) {
          setMentionQuery(afterAt);
          setMentionStartPos(lastAtIndex);
          setShowSuggestions(true);
          setSelectedSuggestionIndex(0);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    // Update mentioned users based on current text
    const mentions = extractMentions(newValue);
    setMentionedUsers(mentions);
    onChange(newValue, mentions);
  };

  // Extract mentioned users from text
  const extractMentions = (text: string): MentionSuggestion[] => {
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    const mentions: MentionSuggestion[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionName = match[1];
      const participant = availableParticipants.find(
        p => p.name.toLowerCase() === mentionName.toLowerCase()
      );
      
      if (participant && !mentions.find(m => m.id === participant.id)) {
        mentions.push({
          id: participant.id,
          name: participant.name,
          avatar: participant.avatar,
          role: participant.role,
          customTitle: participant.customTitle,
          isOnline: participant.isOnline,
        });
      }
    }

    return mentions;
  };

  // Insert mention into text
  const insertMention = (participant: GroupParticipant) => {
    if (mentionStartPos === -1) return;

    const beforeMention = value.slice(0, mentionStartPos);
    const afterCursor = value.slice(cursorPosition);
    const newValue = `${beforeMention}@${participant.name} ${afterCursor}`;
    
    setShowSuggestions(false);
    
    // Update cursor position after mention
    const newCursorPos = mentionStartPos + participant.name.length + 2; // +2 for @ and space
    
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    handleInputChange(newValue);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          insertMention(filteredSuggestions[selectedSuggestionIndex]);
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnterPress?.();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex, showSuggestions]);

  return (
    <div className={cn("relative", className)}>
      {/* Main input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            "w-full min-h-10 max-h-32 px-4 py-2 pr-12 resize-none",
            "border border-border rounded-lg",
            "bg-background text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          )}
          rows={1}
        />
        
        {/* @ indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AtSign className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Character count */}
        {maxLength && (
          <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Mention suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <Card className="absolute bottom-full left-0 right-0 mb-2 shadow-lg z-50">
          <CardContent className="p-0">
            <div className="p-2 text-xs text-muted-foreground border-b">
              Mention someone
            </div>
            <ScrollArea className="max-h-48" ref={suggestionsRef}>
              {filteredSuggestions.map((participant, index) => (
                <div
                  key={participant.id}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                    "hover:bg-accent",
                    index === selectedSuggestionIndex && "bg-accent"
                  )}
                  onClick={() => insertMention(participant)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                    </Avatar>
                    {participant.isOnline && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {participant.name}
                      </span>
                      {participant.role === 'admin' && (
                        <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    {participant.customTitle && (
                      <Badge variant="outline" className="text-xs h-4 px-1 mt-1">
                        {participant.customTitle}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    @{participant.name.toLowerCase().replace(/\s+/g, '')}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Mentioned users preview */}
      {mentionedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {mentionedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="text-xs">
              <AtSign className="h-3 w-3 mr-1" />
              {user.name}
              {user.role === 'admin' && (
                <Crown className="h-3 w-3 ml-1 text-yellow-500" />
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Usage hint */}
      {!showSuggestions && value.length === 0 && (
        <div className="absolute top-full left-0 mt-1 text-xs text-muted-foreground">
          Type @ to mention someone
        </div>
      )}
    </div>
  );
};
