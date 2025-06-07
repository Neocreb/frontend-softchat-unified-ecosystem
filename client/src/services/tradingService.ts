
import { supabase } from "@/lib/supabase/client";

export interface Trade {
  id: string;
  buyer_id: string;
  seller_id: string;
  offer_id?: string;
  amount: number;
  price_per_unit: number;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  escrow_id?: string;
  dispute_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface Escrow {
  id: string;
  trade_id: string;
  amount: number;
  crypto_type: string;
  status: 'pending' | 'locked' | 'released' | 'refunded';
  created_at: string;
  released_at?: string;
  refunded_at?: string;
}

export interface Dispute {
  id: string;
  trade_id: string;
  raised_by: string;
  reason: string;
  description?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  resolved_by?: string;
  created_at: string;
  resolved_at?: string;
}

export interface TradeRating {
  id: string;
  trade_id: string;
  rater_id: string;
  rated_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  crypto_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
}

export const tradingService = {
  // Create a new trade
  async createTrade(trade: Omit<Trade, 'id' | 'created_at' | 'updated_at'>): Promise<Trade | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('trades')
        .insert(trade)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating trade:', error);
      return null;
    }
  },

  // Get user's trades
  async getUserTrades(userId: string): Promise<Trade[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('trades')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user trades:', error);
      return [];
    }
  },

  // Update trade status
  async updateTradeStatus(tradeId: string, status: Trade['status']): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('trades')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          ...(status === 'completed' && { completed_at: new Date().toISOString() }),
          ...(status === 'cancelled' && { cancelled_at: new Date().toISOString() })
        })
        .eq('id', tradeId);

      return !error;
    } catch (error) {
      console.error('Error updating trade status:', error);
      return false;
    }
  },

  // Create escrow
  async createEscrow(escrow: Omit<Escrow, 'id' | 'created_at'>): Promise<Escrow | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('escrows')
        .insert(escrow)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating escrow:', error);
      return null;
    }
  },

  // Release escrow
  async releaseEscrow(escrowId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('escrows')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('id', escrowId);

      return !error;
    } catch (error) {
      console.error('Error releasing escrow:', error);
      return false;
    }
  },

  // Create dispute
  async createDispute(dispute: Omit<Dispute, 'id' | 'created_at'>): Promise<Dispute | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('disputes')
        .insert(dispute)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating dispute:', error);
      return null;
    }
  },

  // Create trade rating
  async createTradeRating(rating: Omit<TradeRating, 'id' | 'created_at'>): Promise<TradeRating | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('trade_ratings')
        .insert(rating)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating trade rating:', error);
      return null;
    }
  },

  // Create price alert
  async createPriceAlert(alert: Omit<PriceAlert, 'id' | 'created_at'>): Promise<PriceAlert | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('price_alerts')
        .insert(alert)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating price alert:', error);
      return null;
    }
  },

  // Get user's price alerts
  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('price_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting price alerts:', error);
      return [];
    }
  }
};
