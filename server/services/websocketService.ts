import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { db } from "../db";
import {
  chatMessages,
  chatThreads,
  adminUsers,
  adminActivityLogs,
  p2pTrades,
  escrowContracts,
} from "../../shared/enhanced-schema";

import { users, profiles, notifications } from "../../shared/schema";
import { eq, and, or, desc, inArray } from "drizzle-orm";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  adminId?: string;
  isAdmin?: boolean;
  roles?: string[];
  permissions?: string[];
  subscribedChannels?: Set<string>;
}

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  messageId?: string;
}

interface ChatMessage {
  threadId: string;
  content: string;
  messageType?: string;
  attachments?: any[];
  replyToId?: string;
}

interface NotificationMessage {
  userId: string;
  title: string;
  content: string;
  type: string;
  relatedUserId?: string;
  relatedPostId?: string;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();
  private adminClients: Map<string, AuthenticatedWebSocket> = new Map();
  private channels: Map<string, Set<string>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
    });

    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on("connection", async (ws: AuthenticatedWebSocket, request) => {
      console.log("New WebSocket connection");

      try {
        // Extract token from query params or headers
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const token =
          url.searchParams.get("token") ||
          request.headers.authorization?.replace("Bearer ", "");

        if (!token) {
          ws.close(1008, "Authentication required");
          return;
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        ws.userId = decoded.userId;
        ws.isAdmin = decoded.type === "admin";
        ws.adminId = decoded.adminId;
        ws.roles = decoded.roles || [];
        ws.permissions = decoded.permissions || [];
        ws.subscribedChannels = new Set();

        // Store client reference
        if (ws.isAdmin && ws.adminId) {
          this.adminClients.set(ws.adminId, ws);
        } else if (ws.userId) {
          this.clients.set(ws.userId, ws);
        }

        // Send connection acknowledgment
        this.sendMessage(ws, {
          type: "connection_ack",
          data: {
            userId: ws.userId,
            isAdmin: ws.isAdmin,
            timestamp: Date.now(),
          },
          timestamp: Date.now(),
        });

        // Set up message handlers
        ws.on("message", (data) => {
          this.handleMessage(ws, data);
        });

        // Handle client disconnect
        ws.on("close", () => {
          this.handleDisconnect(ws);
        });

        ws.on("error", (error) => {
          console.error("WebSocket error:", error);
          this.handleDisconnect(ws);
        });
      } catch (error) {
        console.error("WebSocket authentication error:", error);
        ws.close(1008, "Authentication failed");
      }
    });
  }

  private async handleMessage(ws: AuthenticatedWebSocket, data: Buffer) {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());

      switch (message.type) {
        case "join_channel":
          await this.handleJoinChannel(ws, message.data);
          break;

        case "leave_channel":
          await this.handleLeaveChannel(ws, message.data);
          break;

        case "send_message":
          await this.handleChatMessage(ws, message.data);
          break;

        case "typing_start":
          await this.handleTypingStart(ws, message.data);
          break;

        case "typing_stop":
          await this.handleTypingStop(ws, message.data);
          break;

        case "mark_read":
          await this.handleMarkRead(ws, message.data);
          break;

        case "admin_action":
          if (ws.isAdmin) {
            await this.handleAdminAction(ws, message.data);
          }
          break;

        case "ping":
          this.sendMessage(ws, {
            type: "pong",
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
          });
          break;

        default:
          console.warn("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
      this.sendMessage(ws, {
        type: "error",
        data: { error: "Invalid message format" },
        timestamp: Date.now(),
      });
    }
  }

  private async handleJoinChannel(
    ws: AuthenticatedWebSocket,
    data: { channel: string },
  ) {
    const { channel } = data;

    try {
      // Validate channel access
      const hasAccess = await this.validateChannelAccess(ws, channel);
      if (!hasAccess) {
        this.sendMessage(ws, {
          type: "channel_error",
          data: { error: "Access denied to channel", channel },
          timestamp: Date.now(),
        });
        return;
      }

      // Add to channel
      if (!this.channels.has(channel)) {
        this.channels.set(channel, new Set());
      }

      const clientId = ws.isAdmin ? ws.adminId! : ws.userId!;
      this.channels.get(channel)!.add(clientId);
      ws.subscribedChannels!.add(channel);

      this.sendMessage(ws, {
        type: "channel_joined",
        data: { channel },
        timestamp: Date.now(),
      });

      console.log(`Client ${clientId} joined channel: ${channel}`);
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  }

  private async handleLeaveChannel(
    ws: AuthenticatedWebSocket,
    data: { channel: string },
  ) {
    const { channel } = data;
    const clientId = ws.isAdmin ? ws.adminId! : ws.userId!;

    if (this.channels.has(channel)) {
      this.channels.get(channel)!.delete(clientId);
      ws.subscribedChannels!.delete(channel);

      this.sendMessage(ws, {
        type: "channel_left",
        data: { channel },
        timestamp: Date.now(),
      });
    }
  }

  private async handleChatMessage(
    ws: AuthenticatedWebSocket,
    data: ChatMessage,
  ) {
    if (!ws.userId) return;

    try {
      const { threadId, content, messageType, attachments, replyToId } = data;

      // Validate thread access
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!thread) {
        this.sendMessage(ws, {
          type: "message_error",
          data: { error: "Thread not found" },
          timestamp: Date.now(),
        });
        return;
      }

      // Check if user is participant
      if (!thread.participants.includes(ws.userId)) {
        this.sendMessage(ws, {
          type: "message_error",
          data: { error: "Not a participant in this thread" },
          timestamp: Date.now(),
        });
        return;
      }

      // Save message to database
      const [savedMessage] = await db
        .insert(chatMessages)
        .values({
          threadId,
          senderId: ws.userId,
          content,
          messageType: messageType || "text",
          attachments,
          replyToId,
        })
        .returning();

      // Update thread metadata
      await db
        .update(chatThreads)
        .set({
          lastMessageId: savedMessage.id,
          lastMessageAt: savedMessage.createdAt,
          messageCount: db.$count(
            chatMessages,
            eq(chatMessages.threadId, threadId),
          ),
        })
        .where(eq(chatThreads.id, threadId));

      // Get sender profile for message enrichment
      const [senderProfile] = await db
        .select({
          name: profiles.name,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
        })
        .from(profiles)
        .where(eq(profiles.userId, ws.userId))
        .limit(1);

      const enrichedMessage = {
        ...savedMessage,
        sender: senderProfile,
      };

      // Broadcast to all thread participants
      const channel = `chat_thread_${threadId}`;
      this.broadcastToChannel(channel, {
        type: "new_message",
        data: { message: enrichedMessage },
        timestamp: Date.now(),
      });

      // Send real-time notifications to offline participants
      const onlineParticipants = new Set();
      thread.participants.forEach((participantId) => {
        if (this.clients.has(participantId)) {
          onlineParticipants.add(participantId);
        }
      });

      // Create notifications for offline participants
      const offlineParticipants = thread.participants.filter(
        (id) => id !== ws.userId && !onlineParticipants.has(id),
      );

      if (offlineParticipants.length > 0) {
        const notificationData = offlineParticipants.map((userId) => ({
          userId,
          title: `New message from ${senderProfile?.name || "Someone"}`,
          content:
            content.length > 50 ? content.substring(0, 50) + "..." : content,
          type: "chat_message",
          relatedUserId: ws.userId,
        }));

        await db.insert(notifications).values(notificationData);

        // Send push notifications (implement based on your push service)
        // await this.sendPushNotifications(offlineParticipants, notificationData);
      }
    } catch (error) {
      console.error("Error handling chat message:", error);
      this.sendMessage(ws, {
        type: "message_error",
        data: { error: "Failed to send message" },
        timestamp: Date.now(),
      });
    }
  }

  private async handleTypingStart(
    ws: AuthenticatedWebSocket,
    data: { threadId: string },
  ) {
    if (!ws.userId) return;

    const { threadId } = data;
    const channel = `chat_thread_${threadId}`;

    // Get user profile
    const [profile] = await db
      .select({
        name: profiles.name,
        fullName: profiles.fullName,
      })
      .from(profiles)
      .where(eq(profiles.userId, ws.userId))
      .limit(1);

    this.broadcastToChannel(
      channel,
      {
        type: "typing_start",
        data: {
          threadId,
          userId: ws.userId,
          userName: profile?.name || profile?.fullName || "Someone",
        },
        timestamp: Date.now(),
      },
      ws.userId,
    );
  }

  private async handleTypingStop(
    ws: AuthenticatedWebSocket,
    data: { threadId: string },
  ) {
    if (!ws.userId) return;

    const { threadId } = data;
    const channel = `chat_thread_${threadId}`;

    this.broadcastToChannel(
      channel,
      {
        type: "typing_stop",
        data: {
          threadId,
          userId: ws.userId,
        },
        timestamp: Date.now(),
      },
      ws.userId,
    );
  }

  private async handleMarkRead(
    ws: AuthenticatedWebSocket,
    data: { threadId: string; messageIds: string[] },
  ) {
    if (!ws.userId) return;

    const { threadId, messageIds } = data;

    try {
      // Update read receipts in database
      for (const messageId of messageIds) {
        await db
          .update(chatMessages)
          .set({
            readBy: db.$jsonSet(
              chatMessages.readBy,
              `$.${ws.userId}`,
              new Date().toISOString(),
            ),
          })
          .where(eq(chatMessages.id, messageId));
      }

      // Notify other participants about read status
      const channel = `chat_thread_${threadId}`;
      this.broadcastToChannel(
        channel,
        {
          type: "messages_read",
          data: {
            threadId,
            userId: ws.userId,
            messageIds,
          },
          timestamp: Date.now(),
        },
        ws.userId,
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }

  private async handleAdminAction(ws: AuthenticatedWebSocket, data: any) {
    if (!ws.isAdmin || !ws.adminId) return;

    try {
      const { action, targetType, targetId, details } = data;

      // Log admin action
      await db.insert(adminActivityLogs).values({
        adminId: ws.adminId,
        action,
        targetType,
        targetId,
        description: `Real-time admin action: ${action}`,
        severity: "medium",
        ipAddress: "websocket",
        userAgent: "websocket_client",
      });

      // Broadcast to admin channel
      this.broadcastToAdmins({
        type: "admin_action",
        data: {
          adminId: ws.adminId,
          action,
          targetType,
          targetId,
          details,
        },
        timestamp: Date.now(),
      });

      // Handle specific admin actions
      switch (action) {
        case "user_suspend":
          await this.handleUserSuspension(targetId, details);
          break;

        case "trade_force_complete":
          await this.handleForceCompleteTradeAdmin(targetId, details);
          break;

        case "global_announcement":
          await this.handleGlobalAnnouncement(details);
          break;
      }
    } catch (error) {
      console.error("Error handling admin action:", error);
    }
  }

  private async handleUserSuspension(userId: string, details: any) {
    // Disconnect user if online
    if (this.clients.has(userId)) {
      const userWs = this.clients.get(userId)!;
      this.sendMessage(userWs, {
        type: "account_suspended",
        data: {
          reason: details.reason,
          duration: details.duration,
          message: "Your account has been suspended",
        },
        timestamp: Date.now(),
      });

      // Close connection after a delay
      setTimeout(() => {
        userWs.close(1008, "Account suspended");
      }, 5000);
    }
  }

  private async handleForceCompleteTradeAdmin(tradeId: string, details: any) {
    // Get trade details
    const [trade] = await db
      .select()
      .from(p2pTrades)
      .where(eq(p2pTrades.id, tradeId))
      .limit(1);

    if (trade) {
      // Notify both parties
      const notificationData = {
        type: "trade_admin_action",
        data: {
          tradeId,
          action: "force_complete",
          reason: details.reason,
          message: "Trade has been completed by admin intervention",
        },
        timestamp: Date.now(),
      };

      if (this.clients.has(trade.buyerId)) {
        this.sendMessage(this.clients.get(trade.buyerId)!, notificationData);
      }

      if (this.clients.has(trade.sellerId)) {
        this.sendMessage(this.clients.get(trade.sellerId)!, notificationData);
      }
    }
  }

  private async handleGlobalAnnouncement(details: any) {
    const announcement = {
      type: "global_announcement",
      data: {
        title: details.title,
        content: details.content,
        priority: details.priority || "medium",
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    // Send to all connected users
    this.clients.forEach((client) => {
      this.sendMessage(client, announcement);
    });
  }

  private async validateChannelAccess(
    ws: AuthenticatedWebSocket,
    channel: string,
  ): Promise<boolean> {
    // Admin channels
    if (channel.startsWith("admin_")) {
      return ws.isAdmin === true;
    }

    // Chat thread channels
    if (channel.startsWith("chat_thread_")) {
      const threadId = channel.replace("chat_thread_", "");

      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      return thread ? thread.participants.includes(ws.userId!) : false;
    }

    // User-specific channels
    if (channel.startsWith("user_")) {
      const userId = channel.replace("user_", "");
      return ws.userId === userId;
    }

    // Global channels (public)
    if (channel === "global" || channel === "announcements") {
      return true;
    }

    return false;
  }

  private handleDisconnect(ws: AuthenticatedWebSocket) {
    const clientId = ws.isAdmin ? ws.adminId : ws.userId;

    if (clientId) {
      if (ws.isAdmin) {
        this.adminClients.delete(clientId);
      } else {
        this.clients.delete(clientId);
      }

      // Remove from all channels
      ws.subscribedChannels?.forEach((channel) => {
        if (this.channels.has(channel)) {
          this.channels.get(channel)!.delete(clientId);
        }
      });

      console.log(`Client ${clientId} disconnected`);
    }
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcastToChannel(
    channel: string,
    message: WebSocketMessage,
    excludeUserId?: string,
  ) {
    if (!this.channels.has(channel)) return;

    const subscribers = this.channels.get(channel)!;

    subscribers.forEach((clientId) => {
      if (excludeUserId && clientId === excludeUserId) return;

      const client =
        this.clients.get(clientId) || this.adminClients.get(clientId);
      if (client) {
        this.sendMessage(client, message);
      }
    });
  }

  private broadcastToAdmins(message: WebSocketMessage) {
    this.adminClients.forEach((client) => {
      this.sendMessage(client, message);
    });
  }

  // Public methods for external use
  public sendNotificationToUser(
    userId: string,
    notification: NotificationMessage,
  ) {
    const client = this.clients.get(userId);
    if (client) {
      this.sendMessage(client, {
        type: "notification",
        data: notification,
        timestamp: Date.now(),
      });
    }
  }

  public sendTradeUpdate(tradeId: string, update: any) {
    this.broadcastToChannel(`trade_${tradeId}`, {
      type: "trade_update",
      data: update,
      timestamp: Date.now(),
    });
  }

  public sendEscrowUpdate(escrowId: string, update: any) {
    this.broadcastToChannel(`escrow_${escrowId}`, {
      type: "escrow_update",
      data: update,
      timestamp: Date.now(),
    });
  }

  public getOnlineUsersCount(): number {
    return this.clients.size;
  }

  public getOnlineAdminsCount(): number {
    return this.adminClients.size;
  }

  public isUserOnline(userId: string): boolean {
    return this.clients.has(userId);
  }
}

// Export singleton instance
let websocketService: WebSocketService;

export const initializeWebSocketService = (
  server: Server,
): WebSocketService => {
  websocketService = new WebSocketService(server);
  return websocketService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!websocketService) {
    throw new Error("WebSocket service not initialized");
  }
  return websocketService;
};
