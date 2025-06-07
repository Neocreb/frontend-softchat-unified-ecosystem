
type RewardAction = 
  | "login" 
  | "post_created" 
  | "post_liked" 
  | "product_purchased" 
  | "crypto_traded"
  | "friend_referred"
  | "profile_completed"
  | "daily_visit";

type RewardConfig = {
  [key in RewardAction]: {
    points: number;
    description: string;
  }
};

// Points configuration for different actions
const rewardConfig: RewardConfig = {
  login: {
    points: 5,
    description: "Daily login"
  },
  post_created: {
    points: 10,
    description: "Created a post"
  },
  post_liked: {
    points: 2,
    description: "Liked a post"
  },
  product_purchased: {
    points: 50,
    description: "Made a purchase"
  },
  crypto_traded: {
    points: 25,
    description: "Traded cryptocurrency"
  },
  friend_referred: {
    points: 200,
    description: "Referred a friend"
  },
  profile_completed: {
    points: 100,
    description: "Completed profile"
  },
  daily_visit: {
    points: 5,
    description: "Daily visit"
  }
};

// Level thresholds
const levelThresholds = {
  bronze: 0,
  silver: 5000,
  gold: 15000,
  platinum: 50000
};

type UserLevel = "bronze" | "silver" | "gold" | "platinum";

// Calculate user level based on points
export const calculateLevel = (points: number): UserLevel => {
  if (points >= levelThresholds.platinum) return "platinum";
  if (points >= levelThresholds.gold) return "gold";
  if (points >= levelThresholds.silver) return "silver";
  return "bronze";
};

// Get points for an action
export const getPointsForAction = (action: RewardAction): number => {
  return rewardConfig[action].points;
};

// Get description for an action
export const getDescriptionForAction = (action: RewardAction): string => {
  return rewardConfig[action].description;
};

// Calculate progress to next level
export const calculateNextLevelProgress = (
  points: number
): { currentLevel: UserLevel; nextLevel: UserLevel | null; progress: number } => {
  const currentLevel = calculateLevel(points);
  
  // If user is already at platinum level
  if (currentLevel === "platinum") {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
    };
  }
  
  // Determine next level
  let nextLevel: UserLevel;
  let currentThreshold: number;
  let nextThreshold: number;
  
  switch (currentLevel) {
    case "bronze":
      nextLevel = "silver";
      currentThreshold = levelThresholds.bronze;
      nextThreshold = levelThresholds.silver;
      break;
    case "silver":
      nextLevel = "gold";
      currentThreshold = levelThresholds.silver;
      nextThreshold = levelThresholds.gold;
      break;
    case "gold":
      nextLevel = "platinum";
      currentThreshold = levelThresholds.gold;
      nextThreshold = levelThresholds.platinum;
      break;
    default:
      // This should never happen but TypeScript needs it
      nextLevel = "silver";
      currentThreshold = 0;
      nextThreshold = 5000;
  }
  
  // Calculate progress percentage
  const pointsAboveCurrentThreshold = points - currentThreshold;
  const pointsNeededForNextLevel = nextThreshold - currentThreshold;
  const progress = Math.min(
    Math.round((pointsAboveCurrentThreshold / pointsNeededForNextLevel) * 100),
    100
  );
  
  return {
    currentLevel,
    nextLevel,
    progress,
  };
};

// Get available rewards to redeem
export const getAvailableRewards = (userLevel: UserLevel) => {
  const baseRewards = [
    { id: "discount_10", name: "10% Discount", points: 500, level: "bronze" },
    { id: "premium_week", name: "1 Week Premium", points: 1000, level: "bronze" },
  ];
  
  const silverRewards = [
    { id: "discount_25", name: "25% Discount", points: 2000, level: "silver" },
    { id: "free_shipping", name: "Free Shipping", points: 1500, level: "silver" },
  ];
  
  const goldRewards = [
    { id: "discount_50", name: "50% Discount", points: 5000, level: "gold" },
    { id: "premium_month", name: "1 Month Premium", points: 7500, level: "gold" },
  ];
  
  const platinumRewards = [
    { id: "discount_75", name: "75% Discount", points: 10000, level: "platinum" },
    { id: "premium_year", name: "1 Year Premium", points: 25000, level: "platinum" },
  ];
  
  let availableRewards = [...baseRewards];
  
  if (userLevel === "silver" || userLevel === "gold" || userLevel === "platinum") {
    availableRewards = [...availableRewards, ...silverRewards];
  }
  
  if (userLevel === "gold" || userLevel === "platinum") {
    availableRewards = [...availableRewards, ...goldRewards];
  }
  
  if (userLevel === "platinum") {
    availableRewards = [...availableRewards, ...platinumRewards];
  }
  
  return availableRewards;
};

export const REWARD_ACTIONS = Object.keys(rewardConfig) as RewardAction[];
