
import { supabase } from "@/lib/supabase/client";

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: 'passport' | 'driver_license' | 'national_id' | 'utility_bill' | 'bank_statement';
  document_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: string;
  created_at: string;
}

export interface TradingLimits {
  id: string;
  user_id: string;
  kyc_level: number;
  daily_limit: number;
  monthly_limit: number;
  current_daily_volume: number;
  current_monthly_volume: number;
  updated_at: string;
}

export const kycService = {
  // Upload KYC document
  async uploadKYCDocument(document: Omit<KYCDocument, 'id' | 'created_at'>): Promise<KYCDocument | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('kyc_documents')
        .insert(document)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading KYC document:', error);
      return null;
    }
  },

  // Get user's KYC documents
  async getUserKYCDocuments(userId: string): Promise<KYCDocument[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting KYC documents:', error);
      return [];
    }
  },

  // Get user's trading limits
  async getUserTradingLimits(userId: string): Promise<TradingLimits | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('trading_limits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no limits exist, create default ones
        if (error.code === 'PGRST116') {
          return await this.createDefaultTradingLimits(userId);
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error getting trading limits:', error);
      return null;
    }
  },

  // Create default trading limits
  async createDefaultTradingLimits(userId: string): Promise<TradingLimits | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('trading_limits')
        .insert({
          user_id: userId,
          kyc_level: 0,
          daily_limit: 1000,
          monthly_limit: 10000
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating default trading limits:', error);
      return null;
    }
  },

  // Update trading limits based on KYC level
  async updateTradingLimits(userId: string, kycLevel: number): Promise<boolean> {
    try {
      const limits = {
        0: { daily: 1000, monthly: 10000 },
        1: { daily: 5000, monthly: 50000 },
        2: { daily: 25000, monthly: 250000 },
        3: { daily: 100000, monthly: 1000000 }
      };

      const newLimits = limits[kycLevel as keyof typeof limits] || limits[0];

      const { error } = await (supabase as any)
        .from('trading_limits')
        .upsert({
          user_id: userId,
          kyc_level: kycLevel,
          daily_limit: newLimits.daily,
          monthly_limit: newLimits.monthly,
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error updating trading limits:', error);
      return false;
    }
  }
};
