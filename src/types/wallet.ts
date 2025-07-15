export interface WalletBalance {
  total: number;
  ecommerce: number;
  crypto: number;
  creator_economy: number;
  freelance: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "earned" | "transfer";
  amount: number;
  source:
    | "ecommerce"
    | "crypto"
    | "creator_economy"
    | "freelance"
    | "bank"
    | "card";
  description: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  sourceIcon?: string;
}

export interface WalletSource {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  description: string;
}

export interface WithdrawalRequest {
  amount: number;
  source?: "total" | "ecommerce" | "crypto" | "creator_economy" | "freelance";
  bankAccount: string;
  description?: string;
}

export interface DepositRequest {
  amount: number;
  method: "card" | "bank" | "crypto";
  source: "ecommerce" | "crypto" | "creator_economy" | "freelance";
  description?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  isDefault: boolean;
}
