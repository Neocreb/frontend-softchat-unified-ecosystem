# Unified Wallet System

## Overview

The Unified Wallet System is a centralized financial hub that brings together all earnings, deposits, and payouts from different income streams in one clear interface. It provides a comprehensive view of finances with dedicated sections for E-Commerce, Crypto, Rewards, and Freelance income.

## Features

### ✅ Centralized Total Balance

- Combined balance from all income streams displayed at the top
- Toggle balance visibility for privacy
- Real-time earnings growth tracking

### 🧭 Segmented Views/Tabs

- **E-Commerce Earnings** 🛒 - Marketplace sales and commissions
- **Crypto Portfolio** 💹 - Trading profits and investments
- **Rewards System** 🎁 - Points, bonuses, and achievements
- **Freelance Income** 💼 - Project payments and milestones

Each tab shows:

- Individual balance for that income stream
- Recent transactions with source labels and icons
- Earnings trends and statistics

### 💸 Action Buttons

- **Withdraw Funds**: Select source, amount, and bank account
- **Deposit Funds**: Add funds via card, bank transfer, or crypto
- Real-time transaction processing with status updates

## Technical Implementation

### Components

#### Core Components

- `UnifiedWalletDashboard.tsx` - Main dashboard component
- `WalletSourceCard.tsx` - Individual income source display
- `TransactionItem.tsx` - Individual transaction component
- `WithdrawModal.tsx` - Withdrawal interface
- `DepositModal.tsx` - Deposit interface
- `FreelanceWalletCard.tsx` - Specialized freelance integration

#### UI Components Used

- Card, Button, Tabs from shadcn/ui
- Form inputs with validation
- Progress bars for project tracking
- Badges for status indicators
- Skeleton loaders for better UX

### Data Management

#### Types (`src/types/wallet.ts`)

```typescript
interface WalletBalance {
  total: number;
  ecommerce: number;
  crypto: number;
  rewards: number;
  freelance: number;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "earned" | "transfer";
  amount: number;
  source: "ecommerce" | "crypto" | "rewards" | "freelance" | "bank" | "card";
  description: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  sourceIcon?: string;
}
```

#### Context Provider (`src/contexts/WalletContext.tsx`)

- Centralized wallet state management
- Real-time data synchronization
- Error handling and loading states
- Transaction filtering and aggregation

#### Service Layer (`src/services/walletService.ts`)

- API communication with backend
- Mock data fallback for development
- Transaction processing
- Bank account management

### API Endpoints

#### Backend Routes (`server/routes.ts`)

```typescript
GET / api / wallet; // Get wallet balance
GET / api / wallet / transactions; // Get transaction history
POST / api / wallet / withdraw; // Process withdrawal
POST / api / wallet / deposit; // Process deposit
GET / api / wallet / bank - accounts; // Get bank accounts
```

### Custom Hooks

#### `useWallet` Hook (`src/hooks/use-wallet.ts`)

```typescript
const {
  walletBalance,
  transactions,
  isLoading,
  error,
  refreshWallet,
  getTransactionsBySource,
  getTotalEarnings,
  getSourceBalance,
} = useWallet();
```

## Usage

### Basic Implementation

```typescript
import UnifiedWalletDashboard from '@/components/wallet/UnifiedWalletDashboard';

function WalletPage() {
  return <UnifiedWalletDashboard />;
}
```

### Using Wallet Context

```typescript
import { WalletProvider, useWalletContext } from '@/contexts/WalletContext';

function App() {
  return (
    <WalletProvider>
      <YourAppComponents />
    </WalletProvider>
  );
}

function SomeComponent() {
  const { walletBalance, refreshWallet } = useWalletContext();
  // Use wallet data here
}
```

### Freelance Integration

```typescript
import FreelanceWalletCard from '@/components/wallet/FreelanceWalletCard';

function FreelancePage() {
  return (
    <div>
      <FreelanceWalletCard />
      {/* Other freelance components */}
    </div>
  );
}
```

## Styling

### Design System

- **Mobile-first responsive design**
- **TailwindCSS** for styling
- **Gradient backgrounds** for visual hierarchy
- **Icon-based navigation** with emojis
- **Consistent color coding** per income source:
  - E-Commerce: Green gradient
  - Crypto: Orange gradient
  - Rewards: Purple gradient
  - Freelance: Indigo gradient

### Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## Security Considerations

### Data Protection

- Balance visibility toggle
- Secure API endpoints
- Input validation and sanitization
- Error handling without exposing sensitive data

### Transaction Safety

- Confirmation modals for all actions
- Amount limits and validation
- Bank account verification
- Transaction status tracking

## Future Enhancements

### Planned Features

- [ ] Real-time notifications for transactions
- [ ] Advanced analytics and reporting
- [ ] Multi-currency support
- [ ] Automated savings rules
- [ ] Integration with external financial services
- [ ] Export functionality for tax purposes
- [ ] Recurring payment scheduling

### Integration Opportunities

- Payment processors (Stripe, PayPal)
- Cryptocurrency exchanges
- Banking APIs (Plaid, Yodlee)
- Accounting software (QuickBooks)
- Tax preparation services

## Development Notes

### Mock Data

The system currently uses mock data for development but is designed to easily integrate with real APIs. All mock data is clearly marked and can be replaced with actual API calls.

### Error Handling

Comprehensive error handling with graceful fallbacks to ensure the wallet remains functional even when some services are unavailable.

### Performance

- Lazy loading of transaction history
- Efficient state management with React Context
- Optimized re-renders with proper dependency arrays
- Image optimization for icons and avatars

This unified wallet system provides a solid foundation for managing multiple income streams while maintaining excellent user experience and developer ergonomics.
