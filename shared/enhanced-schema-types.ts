// Additional marketplace types for enhanced-schema.ts
// This file contains the missing type exports that should be added to the end of enhanced-schema.ts

// Enhanced marketplace types
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type CampaignProduct = typeof campaignProducts.$inferSelect;
export type ProductBoost = typeof productBoosts.$inferSelect;
export type OrderStatusLog = typeof orderStatusLogs.$inferSelect;
export type ShoppingCart = typeof shoppingCarts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type ProductAnalytics = typeof productAnalytics.$inferSelect;
export type MarketplaceDispute = typeof marketplaceDisputes.$inferSelect;
export type MarketplaceReview = typeof marketplaceReviews.$inferSelect;
export type ReviewResponse = typeof reviewResponses.$inferSelect;
export type ReviewHelpfulness = typeof reviewHelpfulness.$inferSelect;
export type SellerAnalytics = typeof sellerAnalytics.$inferSelect;
export type SellerScore = typeof sellerScores.$inferSelect;
export type ProductPriceHistory = typeof productPriceHistory.$inferSelect;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;

// Enhanced marketplace insert types
export type InsertProduct = typeof products.$inferInsert;
export type InsertProductVariant = typeof productVariants.$inferInsert;
export type InsertProductCategory = typeof productCategories.$inferInsert;
export type InsertCampaign = typeof campaigns.$inferInsert;
export type InsertCampaignProduct = typeof campaignProducts.$inferInsert;
export type InsertProductBoost = typeof productBoosts.$inferInsert;
export type InsertOrderStatusLog = typeof orderStatusLogs.$inferInsert;
export type InsertShoppingCart = typeof shoppingCarts.$inferInsert;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type InsertWishlist = typeof wishlists.$inferInsert;
export type InsertWishlistItem = typeof wishlistItems.$inferInsert;
export type InsertProductAnalytics = typeof productAnalytics.$inferInsert;
export type InsertMarketplaceDispute = typeof marketplaceDisputes.$inferInsert;
export type InsertMarketplaceReview = typeof marketplaceReviews.$inferInsert;
export type InsertReviewResponse = typeof reviewResponses.$inferInsert;
export type InsertReviewHelpfulness = typeof reviewHelpfulness.$inferInsert;
export type InsertSellerAnalytics = typeof sellerAnalytics.$inferInsert;
export type InsertSellerScore = typeof sellerScores.$inferInsert;
export type InsertProductPriceHistory = typeof productPriceHistory.$inferInsert;
export type InsertProductRecommendation =
  typeof productRecommendations.$inferInsert;

// Additional insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  averageRating: true,
  totalReviews: true,
  totalSales: true,
  viewCount: true,
  clickCount: true,
  favoriteCount: true,
});

export const insertProductVariantSchema = createInsertSchema(
  productVariants,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductCategorySchema = createInsertSchema(
  productCategories,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  productCount: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
  viewCount: true,
  clickCount: true,
  conversionCount: true,
  totalRevenue: true,
});

export const insertCampaignProductSchema = createInsertSchema(
  campaignProducts,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  campaignViews: true,
  campaignClicks: true,
  campaignSales: true,
  campaignRevenue: true,
});

export const insertProductBoostSchema = createInsertSchema(productBoosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  startDate: true,
  endDate: true,
  approvedAt: true,
  impressions: true,
  clicks: true,
  conversions: true,
  conversionValue: true,
  roi: true,
});

export const insertSellerAnalyticsSchema = createInsertSchema(
  sellerAnalytics,
).omit({
  id: true,
  createdAt: true,
});

export const insertSellerScoreSchema = createInsertSchema(sellerScores).omit({
  id: true,
  createdAt: true,
  calculatedAt: true,
});

export const insertProductPriceHistorySchema = createInsertSchema(
  productPriceHistory,
).omit({
  id: true,
  createdAt: true,
});

export const insertProductRecommendationSchema = createInsertSchema(
  productRecommendations,
).omit({
  id: true,
  createdAt: true,
  shownAt: true,
  clickedAt: true,
  purchasedAt: true,
});
