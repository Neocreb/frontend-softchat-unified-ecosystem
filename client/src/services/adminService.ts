
import { supabase } from "@/lib/supabase/client";

export interface AdminRole {
  role: 'super_admin' | 'content_admin' | 'user_admin' | 'marketplace_admin' | 'crypto_admin';
}

export const getAdminRoles = async (userId: string): Promise<AdminRole[]> => {
  if (!userId) return [];

  try {
    // Using any to bypass TypeScript issues with Supabase types
    const { data, error } = await (supabase as any)
      .from('admin_permissions')
      .select('role')
      .eq('user_id', userId);

    if (error) throw error;

    return data as AdminRole[];
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    return [];
  }
};
