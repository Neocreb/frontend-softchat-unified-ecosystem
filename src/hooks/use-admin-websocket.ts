import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotification } from '@/hooks/use-notification';

export interface AdminWebSocketMessage {
  type: 'admin_alert' | 'moderation_update' | 'user_action' | 'system_alert' | 'admin_presence' | 'collaboration_update';
  data: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  from?: string;
}

export interface AdminPresence {
  adminId: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentSection?: string;
}

export interface AdminCollaborationUpdate {
  type: 'case_assigned' | 'case_taken' | 'case_completed' | 'help_requested' | 'team_message';
  caseId?: string;
  assignedTo?: string;
  assignedBy?: string;
  message?: string;
  teamId?: string;
}

export const useAdminWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineAdmins, setOnlineAdmins] = useState<AdminPresence[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [lastMessage, setLastMessage] = useState<AdminWebSocketMessage | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { adminUser } = useAdmin();
  const notification = useNotification();
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    try {
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://${window.location.host}/admin/ws`
        : `ws://localhost:5000/admin/ws`;
        
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Admin WebSocket connected');
        setIsConnected(true);
        
        // Send authentication and presence
        if (adminUser) {
          send({
            type: 'admin_presence',
            data: {
              adminId: adminUser.id,
              name: adminUser.name,
              role: adminUser.role,
              status: 'online',
              currentSection: window.location.pathname
            },
            priority: 'low',
            timestamp: new Date().toISOString()
          });
        }
        
        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message: AdminWebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Handle different message types
          switch (message.type) {
            case 'admin_presence':
              setOnlineAdmins(message.data);
              break;
              
            case 'admin_alert':
              setUnreadAlerts(prev => prev + 1);
              if (message.priority === 'urgent' || message.priority === 'high') {
                notification.show({
                  title: 'Admin Alert',
                  description: message.data.message,
                  type: message.priority === 'urgent' ? 'error' : 'warning'
                });
              }
              break;
              
            case 'moderation_update':
              // Handle moderation queue updates
              if (window.location.pathname.includes('/admin/moderation')) {
                window.dispatchEvent(new CustomEvent('moderation_update', { detail: message.data }));
              }
              break;
              
            case 'collaboration_update':
              // Handle team collaboration updates
              const collab = message.data as AdminCollaborationUpdate;
              if (collab.assignedTo === adminUser?.id) {
                notification.show({
                  title: 'New Assignment',
                  description: `You've been assigned a new ${collab.type.replace('_', ' ')}`,
                  type: 'info'
                });
              }
              break;
              
            case 'system_alert':
              notification.show({
                title: 'System Alert',
                description: message.data.message,
                type: 'error'
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('Admin WebSocket disconnected');
        setIsConnected(false);
        
        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        
        // Attempt reconnection
        if (adminUser) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 5000);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('Admin WebSocket error:', error);
        setIsConnected(false);
      };
      
    } catch (error) {
      console.error('Failed to connect to admin WebSocket:', error);
    }
  }, [adminUser, notification]);
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
  }, []);
  
  const send = useCallback((message: AdminWebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);
  
  const updatePresence = useCallback((status: AdminPresence['status'], currentSection?: string) => {
    if (adminUser) {
      send({
        type: 'admin_presence',
        data: {
          adminId: adminUser.id,
          name: adminUser.name,
          role: adminUser.role,
          status,
          currentSection: currentSection || window.location.pathname,
          lastSeen: new Date().toISOString()
        },
        priority: 'low',
        timestamp: new Date().toISOString()
      });
    }
  }, [adminUser, send]);
  
  const sendAlert = useCallback((message: string, priority: AdminWebSocketMessage['priority'] = 'medium', targetAdminId?: string) => {
    send({
      type: 'admin_alert',
      data: {
        message,
        from: adminUser?.name,
        targetAdminId
      },
      priority,
      timestamp: new Date().toISOString()
    });
  }, [adminUser, send]);
  
  const markAlertsRead = useCallback(() => {
    setUnreadAlerts(0);
  }, []);
  
  // Connect when admin user is available
  useEffect(() => {
    if (adminUser) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [adminUser, connect, disconnect]);
  
  // Update presence when location changes
  useEffect(() => {
    updatePresence('online');
  }, [updatePresence]);
  
  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updatePresence]);
  
  return {
    isConnected,
    onlineAdmins,
    unreadAlerts,
    lastMessage,
    send,
    sendAlert,
    updatePresence,
    markAlertsRead,
    connect,
    disconnect
  };
};
