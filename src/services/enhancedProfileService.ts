// src/services/enhancedProfileService.ts
export interface UserProfile {
  // Basic Information
  id: string;
  username: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";

  // Contact Information
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  // Professional Information
  title?: string;
  company?: string;
  industry?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  portfolio?: string;
  linkedIn?: string;
  github?: string;
  website?: string;

  // Verification & Security
  kycLevel: 0 | 1 | 2 | 3;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;

  // Financial Information
  preferredCurrency: string;
  timeZone: string;
  language: string;

  // Platform Stats
  level: string;
  reputation: number;
  followers: number;
  following: number;
  posts: number;
  joinedDate: string;
  lastActive: string;

  // Privacy Settings
  profileVisibility: "public" | "followers" | "private";
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowDirectMessages: boolean;
  allowNotifications: boolean;

  // Bank Account Information
  bankAccounts: BankAccount[];

  // Notification Preferences
  notificationSettings: NotificationSettings;

  // Achievement & Progress
  achievements: Achievement[];
  completedChallenges: string[];
  badges: Badge[];
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  currency: string;
  country: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  email: {
    marketing: boolean;
    productUpdates: boolean;
    socialActivity: boolean;
    systemAlerts: boolean;
    newsletter: boolean;
  };
  push: {
    messages: boolean;
    mentions: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    trades: boolean;
    orders: boolean;
  };
  sms: {
    loginAlerts: boolean;
    transactionAlerts: boolean;
    emergencyAlerts: boolean;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: string;
  progress: number;
  maxProgress: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  earnedAt: string;
}

export interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  success: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal" | "crypto";
  last4?: string;
  brand?: string;
  country?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
  holderName: string;
}

export interface UserSettings {
  // Display Settings
  theme: "light" | "dark" | "system";
  language: string;
  timeZone: string;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";

  // Privacy Settings
  profileVisibility: "public" | "followers" | "private";
  showOnlineStatus: boolean;
  allowSearchEngineIndexing: boolean;
  allowDataAnalytics: boolean;

  // Communication Settings
  allowDirectMessages: "everyone" | "followers" | "none";
  allowTagging: boolean;
  allowMentions: boolean;
  autoPlayVideos: boolean;
  autoLoadImages: boolean;

  // Security Settings
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowRememberMe: boolean;

  // Trading Settings
  confirmAllTrades: boolean;
  defaultTradingPair: string;
  advancedOrderTypes: boolean;
  showBalanceInHeader: boolean;

  // Content Settings
  nsfw: boolean;
  autoplayMedia: boolean;
  showSensitiveContent: boolean;
  contentLanguages: string[];
}

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "BTC", name: "Bitcoin", symbol: "₿" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ" },
];

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

const SUPPORTED_TIMEZONES = [
  { code: "UTC", name: "UTC" },
  { code: "America/New_York", name: "Eastern Time (US)" },
  { code: "America/Chicago", name: "Central Time (US)" },
  { code: "America/Denver", name: "Mountain Time (US)" },
  { code: "America/Los_Angeles", name: "Pacific Time (US)" },
  { code: "Europe/London", name: "London" },
  { code: "Europe/Paris", name: "Paris" },
  { code: "Europe/Berlin", name: "Berlin" },
  { code: "Asia/Tokyo", name: "Tokyo" },
  { code: "Asia/Shanghai", name: "Shanghai" },
  { code: "Asia/Kolkata", name: "Mumbai" },
  { code: "Australia/Sydney", name: "Sydney" },
];

class EnhancedProfileService {
  // Profile Management
  async getProfile(userId: string): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock profile data
    return {
      id: userId,
      username: "john_doe",
      email: "john@example.com",
      displayName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      bio: "Software Developer | Tech Enthusiast | Coffee Lover ☕\nBuilding the future one line of code at a time 🚀",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      banner:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop",
      dateOfBirth: "1990-05-15",
      gender: "male",
      phone: "+1 (555) 123-4567",
      address: {
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        country: "United States",
        zipCode: "94105",
      },
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      industry: "Technology",
      experience: "8+ years",
      education: "Stanford University - Computer Science",
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "AI/ML",
        "Blockchain",
      ],
      portfolio: "https://johndoe.dev",
      linkedIn: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      website: "https://johndoe.dev",
      kycLevel: 2,
      isVerified: true,
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: true,
      preferredCurrency: "USD",
      timeZone: "America/New_York",
      language: "en",
      level: "Gold",
      reputation: 4.8,
      followers: 1234,
      following: 567,
      posts: 89,
      joinedDate: "2021-01-15T00:00:00Z",
      lastActive: new Date().toISOString(),
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowDirectMessages: true,
      allowNotifications: true,
      bankAccounts: [],
      notificationSettings: {
        email: {
          marketing: true,
          productUpdates: true,
          socialActivity: true,
          systemAlerts: true,
          newsletter: false,
        },
        push: {
          messages: true,
          mentions: true,
          likes: false,
          comments: true,
          follows: true,
          trades: true,
          orders: true,
        },
        sms: {
          loginAlerts: true,
          transactionAlerts: true,
          emergencyAlerts: true,
        },
      },
      achievements: [
        {
          id: "1",
          name: "Early Adopter",
          description: "Joined in the first month",
          icon: "🚀",
          category: "milestone",
          unlockedAt: "2021-01-15T00:00:00Z",
          progress: 1,
          maxProgress: 1,
        },
      ],
      completedChallenges: ["first_post", "first_trade", "verified_account"],
      badges: [
        {
          id: "1",
          name: "Verified User",
          icon: "✅",
          color: "blue",
          description: "Completed KYC verification",
          earnedAt: "2021-02-01T00:00:00Z",
        },
      ],
    };
  }

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In real implementation, this would update the database
    const currentProfile = await this.getProfile(userId);
    return { ...currentProfile, ...updates };
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real implementation, upload to storage service
    return URL.createObjectURL(file);
  }

  async uploadBanner(userId: string, file: File): Promise<string> {
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In real implementation, upload to storage service
    return URL.createObjectURL(file);
  }

  // Bank Account Management
  async addBankAccount(
    userId: string,
    bankAccount: Omit<BankAccount, "id" | "createdAt" | "isVerified">,
  ): Promise<BankAccount> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newAccount: BankAccount = {
      ...bankAccount,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isVerified: false,
    };

    return newAccount;
  }

  async verifyBankAccount(accountId: string): Promise<boolean> {
    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  }

  async deleteBankAccount(accountId: string): Promise<boolean> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }

  // Security Management
  async getSecurityLogs(userId: string): Promise<SecurityLog[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      {
        id: "1",
        action: "Login",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ipAddress: "192.168.1.1",
        location: "San Francisco, CA",
        device: "Chrome on MacOS",
        success: true,
      },
      {
        id: "2",
        action: "Password Change",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: "192.168.1.1",
        location: "San Francisco, CA",
        device: "Chrome on MacOS",
        success: true,
      },
    ];
  }

  async enable2FA(userId: string): Promise<{ secret: string; qrCode: string }> {
    // Simulate 2FA setup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      secret: "JBSWY3DPEHPK3PXP",
      qrCode:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    };
  }

  async disable2FA(userId: string, code: string): Promise<boolean> {
    // Simulate 2FA disable
    await new Promise((resolve) => setTimeout(resolve, 800));
    return code === "123456"; // Mock validation
  }

  // Settings Management
  async getUserSettings(userId: string): Promise<UserSettings> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      theme: "system",
      language: "en",
      timeZone: "America/New_York",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      profileVisibility: "public",
      showOnlineStatus: true,
      allowSearchEngineIndexing: true,
      allowDataAnalytics: true,
      allowDirectMessages: "followers",
      allowTagging: true,
      allowMentions: true,
      autoPlayVideos: true,
      autoLoadImages: true,
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: 30,
      allowRememberMe: true,
      confirmAllTrades: true,
      defaultTradingPair: "BTC/USD",
      advancedOrderTypes: false,
      showBalanceInHeader: true,
      nsfw: false,
      autoplayMedia: true,
      showSensitiveContent: false,
      contentLanguages: ["en"],
    };
  }

  async updateSettings(
    userId: string,
    settings: Partial<UserSettings>,
  ): Promise<UserSettings> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    const currentSettings = await this.getUserSettings(userId);
    return { ...currentSettings, ...settings };
  }

  // Data Management
  async exportUserData(userId: string): Promise<Blob> {
    // Simulate data export
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = {
      profile: await this.getProfile(userId),
      settings: await this.getUserSettings(userId),
      exportDate: new Date().toISOString(),
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
  }

  async deleteAccount(userId: string, confirmation: string): Promise<boolean> {
    // Simulate account deletion
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return confirmation === "DELETE";
  }

  // Helper methods
  getSupportedCurrencies() {
    return SUPPORTED_CURRENCIES;
  }

  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  getSupportedTimezones() {
    return SUPPORTED_TIMEZONES;
  }
}

export const enhancedProfileService = new EnhancedProfileService();
