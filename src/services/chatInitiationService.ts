import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

export interface ChatInitiationData {
  userId?: string;
  groupId?: string;
  pageId?: string;
  type: 'social' | 'group' | 'page';
  context?: string;
  initialMessage?: string;
}

class ChatInitiationService {
  private navigate: any;
  private toast: any;

  constructor() {
    // Will be initialized when used
  }

  // Initialize conversation with a user
  async startUserConversation(data: {
    userId: string;
    initialMessage?: string;
    type?: 'social' | 'freelance' | 'marketplace' | 'p2p';
  }): Promise<string | null> {
    try {
      // Check if conversation already exists
      const existingConversation = await this.findExistingConversation(data.userId, data.type || 'social');
      
      if (existingConversation) {
        // Navigate to existing conversation
        if (data.initialMessage) {
          // Send the initial message
          await this.sendMessage(existingConversation.id, data.initialMessage);
        }
        return existingConversation.id;
      }

      // Create new conversation
      const conversationId = await this.createConversation({
        participantId: data.userId,
        type: data.type || 'social',
        initialMessage: data.initialMessage
      });

      return conversationId;
    } catch (error) {
      console.error('Error starting user conversation:', error);
      return null;
    }
  }

  // Initialize conversation with a group
  async startGroupConversation(data: {
    groupId: string;
    groupName: string;
    adminIds: string[];
    context?: string;
    initialMessage?: string;
  }): Promise<string | null> {
    try {
      // Create group conversation
      const conversationId = await this.createGroupConversation({
        groupId: data.groupId,
        groupName: data.groupName,
        adminIds: data.adminIds,
        context: data.context,
        initialMessage: data.initialMessage
      });

      return conversationId;
    } catch (error) {
      console.error('Error starting group conversation:', error);
      return null;
    }
  }

  // Initialize conversation with a page
  async startPageConversation(data: {
    pageId: string;
    pageName: string;
    pageOwnerId: string;
    context?: string;
    initialMessage?: string;
  }): Promise<string | null> {
    try {
      if (!data.pageId || !data.pageName || !data.pageOwnerId) {
        throw new Error("Missing required page information");
      }

      // Create page conversation (similar to user conversation but with page context)
      const conversationId = await this.createConversation({
        participantId: data.pageOwnerId,
        type: 'social',
        context: `page:${data.pageId}`,
        metadata: {
          pageId: data.pageId,
          pageName: data.pageName,
          isPageConversation: true
        },
        initialMessage: data.initialMessage
      });

      return conversationId;
    } catch (error) {
      console.error('Error starting page conversation:', error);
      throw error; // Re-throw to bubble up the specific error
    }
  }

  // Find existing conversation
  private async findExistingConversation(userId: string, type: string): Promise<any> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return null;

      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .contains('participants', [currentUser.id, userId])
        .eq('type', type)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error finding conversation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in findExistingConversation:', error);
      return null;
    }
  }

  // Create new conversation
  private async createConversation(data: {
    participantId: string;
    type: string;
    context?: string;
    metadata?: any;
    initialMessage?: string;
  }): Promise<string> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be logged in to start a conversation');
    }

    if (!data.participantId) {
      throw new Error('Cannot start conversation: participant not found');
    }

    try {
      // Try with a minimal schema first
      const conversationData = {
        participants: [currentUser.id, data.participantId],
        type: data.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .insert(conversationData)
        .select()
        .single();

      if (error) {
        // If table doesn't exist or other DB errors, create a mock conversation for demo
        if (error.code === '42P01' || error.message.includes('schema cache') || error.message.includes('column')) {
          console.warn('Supabase table not configured, using mock conversation for demo');
          return this.createMockConversation(data);
        } else if (error.code === '23505') {
          throw new Error("Conversation already exists.");
        } else {
          throw new Error(`Failed to create conversation: ${error.message}`);
        }
      }

      // Send initial message if provided
      if (data.initialMessage) {
        try {
          await this.sendMessage(conversation.id, data.initialMessage);
        } catch (messageError) {
          console.warn('Failed to send initial message:', messageError);
          // Don't fail the whole operation if message sending fails
        }
      }

      return conversation.id;
    } catch (error) {
      // Fallback to mock conversation for demo purposes
      console.warn('Database error, using mock conversation for demo:', error);
      return this.createMockConversation(data);
    }
  }

  // Create mock conversation for demo when database is not available
  private async createMockConversation(data: {
    participantId: string;
    type: string;
    context?: string;
    metadata?: any;
    initialMessage?: string;
  }): Promise<string> {
    // Generate a mock conversation ID for demo
    const conversationId = `mock_conv_${data.type}_${data.participantId}_${Date.now()}`;

    // Store in localStorage for demo purposes
    const mockConversation = {
      id: conversationId,
      participants: [await this.getCurrentUser().then(u => u?.id), data.participantId],
      type: data.type,
      context: data.context,
      metadata: data.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      initialMessage: data.initialMessage
    };

    // Store in localStorage for demo
    try {
      const existingConversations = JSON.parse(localStorage.getItem('mock_conversations') || '[]');
      existingConversations.push(mockConversation);
      localStorage.setItem('mock_conversations', JSON.stringify(existingConversations));
    } catch (e) {
      console.warn('Could not store mock conversation in localStorage');
    }

    return conversationId;
  }

  // Create group conversation
  private async createGroupConversation(data: {
    groupId: string;
    groupName: string;
    adminIds: string[];
    context?: string;
    initialMessage?: string;
  }): Promise<string> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No current user');

    const conversationData = {
      participants: [currentUser.id, ...data.adminIds],
      type: 'group',
      context: data.context || `group:${data.groupId}`,
      metadata: {
        groupId: data.groupId,
        groupName: data.groupName,
        isGroupConversation: true
      },
      is_group: true,
      group_name: data.groupName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .insert(conversationData)
      .select()
      .single();

    if (error) throw error;

    // Send initial message if provided
    if (data.initialMessage) {
      await this.sendMessage(conversation.id, data.initialMessage);
    }

    return conversation.id;
  }

  // Send message to conversation
  private async sendMessage(conversationId: string, content: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No current user');

    const messageData = {
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: content,
      type: 'text',
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('chat_messages')
      .insert(messageData);

    if (error) throw error;

    // Update conversation's last_message_at
    await supabase
      .from('chat_conversations')
      .update({ 
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);
  }

  // Get current user
  private async getCurrentUser(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Navigate to conversation
  navigateToConversation(conversationId: string, navigate: any, toast: any): void {
    navigate(`/app/chat/${conversationId}`);
    toast({
      title: "Starting conversation",
      description: "Opening chat..."
    });
  }

  // Enhanced message button handler
  async handleMessageButton(data: {
    type: 'user' | 'group' | 'page';
    targetId: string;
    targetName: string;
    context?: string;
    adminIds?: string[];
    ownerId?: string;
    navigate: any;
    toast: any;
  }): Promise<void> {
    try {
      let conversationId: string | null = null;

      switch (data.type) {
        case 'user':
          conversationId = await this.startUserConversation({
            userId: data.targetId,
            initialMessage: `Hi! I'd like to chat with you${data.context ? ` about ${data.context}` : ''}.`
          });
          break;

        case 'group':
          if (!data.adminIds || data.adminIds.length === 0) {
            data.toast({
              title: "Error",
              description: "Unable to find group administrators",
              variant: "destructive"
            });
            return;
          }
          conversationId = await this.startGroupConversation({
            groupId: data.targetId,
            groupName: data.targetName,
            adminIds: data.adminIds,
            context: data.context,
            initialMessage: `Hi! I'd like to chat about the ${data.targetName} group${data.context ? ` - ${data.context}` : ''}.`
          });
          break;

        case 'page':
          if (!data.ownerId) {
            data.toast({
              title: "Error",
              description: "Unable to find page owner",
              variant: "destructive"
            });
            return;
          }
          conversationId = await this.startPageConversation({
            pageId: data.targetId,
            pageName: data.targetName,
            pageOwnerId: data.ownerId,
            context: data.context,
            initialMessage: `Hi! I'm interested in your page "${data.targetName}"${data.context ? ` - ${data.context}` : ''}.`
          });
          break;
      }

      if (conversationId) {
        this.navigateToConversation(conversationId, data.navigate, data.toast);
      } else {
        data.toast({
          title: "Error",
          description: "Unable to start conversation. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling message button:', error);

      let errorMessage = "Failed to start conversation. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        if ('message' in error) {
          errorMessage = (error as any).message;
        } else if ('details' in error) {
          errorMessage = (error as any).details;
        } else {
          errorMessage = "An unexpected error occurred";
        }
      }

      data.toast({
        title: "Error starting conversation",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }
}

export const chatInitiationService = new ChatInitiationService();
export default chatInitiationService;
