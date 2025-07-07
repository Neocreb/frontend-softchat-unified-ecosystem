import { FreelanceEscrow, FreelanceDispute } from "@shared/schema";

export interface EscrowCreateRequest {
  projectId: string;
  clientId: string;
  freelancerId: string;
  amount: number;
  cryptoType: "USDT" | "BTC" | "ETH";
}

export interface EscrowReleaseRequest {
  escrowId: string;
  projectId: string;
  clientId: string;
  milestoneId?: string;
}

export interface DisputeCreateRequest {
  projectId: string;
  escrowId?: string;
  reason: string;
  description: string;
  evidence: string[];
}

export interface EscrowTransaction {
  id: string;
  escrowId: string;
  type: "lock" | "release" | "refund" | "dispute";
  amount: number;
  cryptoType: string;
  transactionHash: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: string;
}

// Mock data for development
const mockEscrowContracts: FreelanceEscrow[] = [
  {
    id: "escrow_1",
    projectId: "project_1",
    clientId: "client_1",
    freelancerId: "freelancer_1",
    amount: "5000.00",
    cryptoType: "USDT",
    contractAddress: "0x742d35Cc6634C0532925a3b8D81C3cd8Cc26",
    transactionHash: "0x8f8e6c8c2e9f7e8b9a0d1c2d3e4f5a6b7c8d9e0f1",
    status: "locked",
    lockedAt: new Date("2024-01-15T10:00:00Z"),
    releasedAt: null,
    disputeId: null,
    createdAt: new Date("2024-01-15T09:30:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
];

const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: "tx_1",
    escrowId: "escrow_1",
    type: "lock",
    amount: 5000,
    cryptoType: "USDT",
    transactionHash: "0x8f8e6c8c2e9f7e8b9a0d1c2d3e4f5a6b7c8d9e0f1",
    status: "confirmed",
    timestamp: "2024-01-15T10:00:00Z",
  },
];

export const escrowService = {
  // Create escrow contract
  async createEscrow(request: EscrowCreateRequest): Promise<FreelanceEscrow> {
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newEscrow: FreelanceEscrow = {
        id: `escrow_${Date.now()}`,
        projectId: request.projectId,
        clientId: request.clientId,
        freelancerId: request.freelancerId,
        amount: request.amount.toString(),
        cryptoType: request.cryptoType,
        contractAddress: `0x${Math.random().toString(16).substr(2, 32)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: "pending",
        lockedAt: null,
        releasedAt: null,
        disputeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEscrowContracts.push(newEscrow);

      // Simulate smart contract deployment
      setTimeout(() => {
        newEscrow.status = "locked";
        newEscrow.lockedAt = new Date();
        newEscrow.updatedAt = new Date();
      }, 3000);

      return newEscrow;
    } catch (error) {
      console.error("Error creating escrow:", error);
      throw new Error("Failed to create escrow contract");
    }
  },

  // Get escrow by project ID
  async getEscrowByProject(projectId: string): Promise<FreelanceEscrow | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEscrowContracts.find((e) => e.projectId === projectId) || null;
  },

  // Get escrow by ID
  async getEscrow(escrowId: string): Promise<FreelanceEscrow | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEscrowContracts.find((e) => e.id === escrowId) || null;
  },

  // Release funds from escrow
  async releaseFunds(request: EscrowReleaseRequest): Promise<{
    success: boolean;
    transactionHash?: string;
    message: string;
  }> {
    try {
      const escrow = mockEscrowContracts.find((e) => e.id === request.escrowId);
      if (!escrow) {
        return { success: false, message: "Escrow contract not found" };
      }

      if (escrow.status !== "locked") {
        return { success: false, message: "Escrow is not in locked state" };
      }

      if (escrow.clientId !== request.clientId) {
        return {
          success: false,
          message: "Unauthorized: Only client can release funds",
        };
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update escrow status
      escrow.status = "released";
      escrow.releasedAt = new Date();
      escrow.updatedAt = new Date();

      // Add transaction record
      const transaction: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        escrowId: escrow.id,
        type: "release",
        amount: parseFloat(escrow.amount),
        cryptoType: escrow.cryptoType,
        transactionHash,
        status: "confirmed",
        timestamp: new Date().toISOString(),
      };

      mockEscrowTransactions.push(transaction);

      return {
        success: true,
        transactionHash,
        message: "Funds released successfully",
      };
    } catch (error) {
      console.error("Error releasing funds:", error);
      return { success: false, message: "Failed to release funds" };
    }
  },

  // Initiate dispute
  async createDispute(request: DisputeCreateRequest): Promise<{
    success: boolean;
    disputeId?: string;
    message: string;
  }> {
    try {
      const disputeId = `dispute_${Date.now()}`;

      // Update escrow status if applicable
      if (request.escrowId) {
        const escrow = mockEscrowContracts.find(
          (e) => e.id === request.escrowId,
        );
        if (escrow) {
          escrow.status = "disputed";
          escrow.disputeId = disputeId;
          escrow.updatedAt = new Date();
        }
      }

      return {
        success: true,
        disputeId,
        message:
          "Dispute created successfully. Admin will review within 24 hours.",
      };
    } catch (error) {
      console.error("Error creating dispute:", error);
      return { success: false, message: "Failed to create dispute" };
    }
  },

  // Get escrow transactions
  async getEscrowTransactions(escrowId: string): Promise<EscrowTransaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEscrowTransactions.filter((t) => t.escrowId === escrowId);
  },

  // Get user's escrow contracts
  async getUserEscrows(
    userId: string,
    userType: "client" | "freelancer",
  ): Promise<FreelanceEscrow[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return mockEscrowContracts.filter((escrow) => {
      if (userType === "client") {
        return escrow.clientId === userId;
      } else {
        return escrow.freelancerId === userId;
      }
    });
  },

  // Check escrow status
  async checkEscrowStatus(escrowId: string): Promise<{
    status: string;
    balance: number;
    cryptoType: string;
    isDisputed: boolean;
    canRelease: boolean;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const escrow = mockEscrowContracts.find((e) => e.id === escrowId);
    if (!escrow) {
      throw new Error("Escrow not found");
    }

    return {
      status: escrow.status,
      balance: parseFloat(escrow.amount),
      cryptoType: escrow.cryptoType,
      isDisputed: escrow.status === "disputed",
      canRelease: escrow.status === "locked" && !escrow.disputeId,
    };
  },

  // Admin functions for dispute resolution
  async resolveDispute(
    disputeId: string,
    resolution: "refund" | "release",
    adminNotes: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Find escrow with this dispute
      const escrow = mockEscrowContracts.find((e) => e.disputeId === disputeId);
      if (!escrow) {
        return { success: false, message: "Dispute not found" };
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      if (resolution === "release") {
        escrow.status = "released";
        escrow.releasedAt = new Date();
      } else {
        escrow.status = "refunded";
      }

      escrow.updatedAt = new Date();

      // Add transaction record
      const transaction: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        escrowId: escrow.id,
        type: resolution === "release" ? "release" : "refund",
        amount: parseFloat(escrow.amount),
        cryptoType: escrow.cryptoType,
        transactionHash,
        status: "confirmed",
        timestamp: new Date().toISOString(),
      };

      mockEscrowTransactions.push(transaction);

      return {
        success: true,
        message: `Dispute resolved: ${resolution === "release" ? "Funds released to freelancer" : "Funds refunded to client"}`,
      };
    } catch (error) {
      console.error("Error resolving dispute:", error);
      return { success: false, message: "Failed to resolve dispute" };
    }
  },

  // Get platform escrow statistics
  async getEscrowStats(): Promise<{
    totalLocked: number;
    totalReleased: number;
    totalDisputed: number;
    activeContracts: number;
    disputeRate: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const totalLocked = mockEscrowContracts
      .filter((e) => e.status === "locked")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const totalReleased = mockEscrowContracts
      .filter((e) => e.status === "released")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const totalDisputed = mockEscrowContracts.filter(
      (e) => e.status === "disputed",
    ).length;
    const activeContracts = mockEscrowContracts.filter(
      (e) => e.status === "locked",
    ).length;
    const disputeRate = (totalDisputed / mockEscrowContracts.length) * 100;

    return {
      totalLocked,
      totalReleased,
      totalDisputed,
      activeContracts,
      disputeRate,
    };
  },
};
