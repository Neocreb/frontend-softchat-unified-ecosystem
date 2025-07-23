export const adSettings = {
  // Video ad settings
  inVideoAdDelay: 5, // seconds before ad starts
  interstitialFrequency: 4, // ad after every 4 videos
  inVideoAdSkipDelay: 3, // seconds before skip option appears
  
  // Feed ad settings
  feedAdFrequency: 6, // native ad after every 6 posts
  feedSponsoredFrequency: 8, // Softchat sponsored post
  
  // Marketplace ad settings
  marketplaceInterstitialFrequency: 10, // ad after every 10 products
  
  // Story/Status ad settings
  storyAdFrequency: 5, // ad after every 5 stories
  
  // Freelance ad settings
  freelanceAdFrequency: 15, // ad after every 15 gigs
  
  // Global settings
  enableAds: true,
  adsEnabled: process.env.NODE_ENV !== 'development', // Disable in dev by default
  
  // SoftPoints reward settings
  adRewardPoints: 2, // points earned per ad view
  maxDailyAdRewards: 10, // maximum ads that can earn points per day
  
  // Ad dimensions
  bannerDimensions: {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 }
  },
  
  // Ad types
  adTypes: {
    EXTERNAL: 'external', // AdSense, Adsterra, PropellerAds
    SPONSORED: 'sponsored', // Internal Softchat campaigns
  },
  
  // Ad labels
  adLabels: {
    external: 'Ad',
    advertisement: 'Advertisement',
    sponsored: 'Sponsored'
  }
};

export type AdType = typeof adSettings.adTypes[keyof typeof adSettings.adTypes];
export type AdLabel = typeof adSettings.adLabels[keyof typeof adSettings.adLabels];
