import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface IncomingCall {
  id: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  type: 'voice' | 'video';
  isGroup: boolean;
  groupName?: string;
  participants?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  timestamp: Date;
}

export const useIncomingCalls = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callHistory, setCallHistory] = useState<IncomingCall[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Simulate incoming calls for demo purposes
  const simulateIncomingCall = useCallback((callData: Partial<IncomingCall>) => {
    const call: IncomingCall = {
      id: `call-${Date.now()}`,
      callerId: callData.callerId || 'demo-caller',
      callerName: callData.callerName || 'Demo User',
      callerAvatar: callData.callerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      type: callData.type || 'voice',
      isGroup: callData.isGroup || false,
      groupName: callData.groupName,
      participants: callData.participants,
      timestamp: new Date(),
    };

    setIncomingCall(call);
    
    // Play notification sound (in a real app)
    // playNotificationSound();
    
    toast({
      title: `Incoming ${call.type} call`,
      description: `${call.callerName} is calling...`,
      duration: 5000,
    });

    // Auto-decline after 30 seconds if not answered
    setTimeout(() => {
      if (incomingCall?.id === call.id) {
        handleDeclineCall();
      }
    }, 30000);
  }, [incomingCall, toast]);

  const handleAcceptCall = useCallback(() => {
    if (incomingCall) {
      setCallHistory(prev => [...prev, incomingCall]);
      setIncomingCall(null);
      
      toast({
        title: "Call accepted",
        description: `Connected to ${incomingCall.callerName}`,
      });
      
      return incomingCall;
    }
    return null;
  }, [incomingCall, toast]);

  const handleDeclineCall = useCallback(() => {
    if (incomingCall) {
      setCallHistory(prev => [...prev, { ...incomingCall, declined: true } as any]);
      setIncomingCall(null);
      
      toast({
        title: "Call declined",
        description: `Declined call from ${incomingCall.callerName}`,
      });
    }
  }, [incomingCall, toast]);

  // Listen for incoming calls (in a real app, this would use WebRTC/Socket.io)
  useEffect(() => {
    if (!user) return;

    // Simulate receiving calls for demo purposes
    const demoCallInterval = setInterval(() => {
      // Randomly receive calls for demo (very low probability)
      if (Math.random() < 0.01 && !incomingCall) { // 1% chance every 5 seconds
        const callTypes: ('voice' | 'video')[] = ['voice', 'video'];
        const demoCallers = [
          { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100' },
          { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
          { name: 'Lisa Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
        ];

        const randomCaller = demoCallers[Math.floor(Math.random() * demoCallers.length)];
        const randomType = callTypes[Math.floor(Math.random() * callTypes.length)];

        simulateIncomingCall({
          callerId: `demo-${Date.now()}`,
          callerName: randomCaller.name,
          callerAvatar: randomCaller.avatar,
          type: randomType,
          isGroup: Math.random() < 0.3, // 30% chance of group call
          groupName: Math.random() < 0.3 ? 'Team Meeting' : undefined,
        });
      }
    }, 5000);

    return () => clearInterval(demoCallInterval);
  }, [user, incomingCall, simulateIncomingCall]);

  // Listen for WebRTC signaling in a real app
  useEffect(() => {
    // This would be replaced with actual WebRTC/Socket.io listeners
    // Example:
    // socket.on('incoming-call', (callData) => {
    //   simulateIncomingCall(callData);
    // });
    // 
    // return () => {
    //   socket.off('incoming-call');
    // };
  }, []);

  return {
    incomingCall,
    callHistory,
    handleAcceptCall,
    handleDeclineCall,
    simulateIncomingCall,
  };
};

export default useIncomingCalls;
