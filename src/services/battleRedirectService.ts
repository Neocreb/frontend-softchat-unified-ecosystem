// Service to handle battle creation and redirection to Live/Battle tab
export interface BattleRedirectConfig {
  battleId: string;
  creator1Id: string;
  creator2Id: string;
  title: string;
  description?: string;
  duration: number;
  allowVoting?: boolean;
  isPublic?: boolean;
}

class BattleRedirectService {
  private pendingBattles: Map<string, BattleRedirectConfig> = new Map();

  // Store battle configuration and redirect to Live/Battle page
  createBattleAndRedirect(config: BattleRedirectConfig): string {
    // Store the battle config
    this.pendingBattles.set(config.battleId, config);
    
    // Return the redirect URL with battle info
    const redirectUrl = `/app/live-battle?tab=battle&battleId=${config.battleId}`;
    return redirectUrl;
  }

  // Get pending battle configuration
  getPendingBattle(battleId: string): BattleRedirectConfig | null {
    return this.pendingBattles.get(battleId) || null;
  }

  // Clear pending battle once it's started
  clearPendingBattle(battleId: string): void {
    this.pendingBattles.delete(battleId);
  }

  // Get all pending battles
  getAllPendingBattles(): BattleRedirectConfig[] {
    return Array.from(this.pendingBattles.values());
  }
}

export const battleRedirectService = new BattleRedirectService();
