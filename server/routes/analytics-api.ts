import express from "express";
import { z } from "zod";
import { eq, and, or, desc, asc, sql, like, inArray, count, sum, avg, gte, lte, between } from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  AppError,
} from "../config/security";
import {
  sellerAnalytics,
  productAnalytics
} from "../../shared/enhanced-schema";
import { users, profiles, posts, videos } from "../../shared/schema";

const router = express.Router();

// Rate limiters
const analyticsLimiter = createRateLimitMiddleware(100);
const reportsLimiter = createRateLimitMiddleware(20);

// Validation schemas
const analyticsQuerySchema = z.object({
  metric: z.enum([
    'users', 'content', 'revenue', 'engagement', 'performance',
    'retention', 'conversion', 'geographic', 'device', 'traffic',
    'social', 'video', 'marketplace', 'freelance', 'crypto'
  ]),
  timeframe: z.enum(['1h', '24h', '7d', '30d', '90d', '1y', 'all']).default('30d'),
  granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  filters: z.object({
    userSegment: z.string().optional(),
    contentType: z.string().optional(),
    platform: z.string().optional(),
    country: z.string().optional(),
    deviceType: z.string().optional(),
    trafficSource: z.string().optional(),
  }).optional(),
  compareWith: z.enum(['previous_period', 'previous_year', 'none']).default('none'),
  breakdown: z.array(z.string()).optional(),
});

const customEventSchema = z.object({
  eventName: z.string().min(1).max(50),
  userId: z.string().uuid().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.any()).optional(),
  metadata: z.object({
    userAgent: z.string().optional(),
    ip: z.string().optional(),
    referrer: z.string().optional(),
    url: z.string().optional(),
    timestamp: z.string().datetime().optional(),
  }).optional(),
});

const reportRequestSchema = z.object({
  reportType: z.enum([
    'daily_summary', 'weekly_summary', 'monthly_summary',
    'user_activity', 'content_performance', 'revenue_analysis',
    'engagement_report', 'platform_health', 'custom'
  ]),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  filters: z.record(z.any()).optional(),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  includeCharts: z.boolean().default(false),
  recipients: z.array(z.string().email()).optional(),
});

// =============================================================================
// DASHBOARD ANALYTICS
// =============================================================================

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard metrics
 */
router.get("/dashboard", authenticateToken, requireRole(['admin', 'analytics']), async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const dateRange = getDateRange(timeframe as string);

    // Get key metrics in parallel
    const [
      userMetrics,
      contentMetrics,
      revenueMetrics,
      engagementMetrics,
      performanceMetrics
    ] = await Promise.all([
      getUserMetrics(dateRange),
      getContentMetrics(dateRange),
      getRevenueMetrics(dateRange),
      getEngagementMetrics(dateRange),
      getPerformanceMetrics(dateRange),
    ]);

    // Get real-time metrics
    const realTimeData = await getRealTimeMetrics();

    // Calculate growth rates
    const previousPeriodRange = getPreviousPeriodRange(dateRange);
    const [
      previousUserMetrics,
      previousRevenueMetrics,
      previousEngagementMetrics
    ] = await Promise.all([
      getUserMetrics(previousPeriodRange),
      getRevenueMetrics(previousPeriodRange),
      getEngagementMetrics(previousPeriodRange),
    ]);

    const dashboard = {
      overview: {
        users: {
          total: userMetrics.totalUsers,
          active: userMetrics.activeUsers,
          new: userMetrics.newUsers,
          growth: calculateGrowthRate(userMetrics.newUsers, previousUserMetrics.newUsers),
        },
        content: {
          posts: contentMetrics.totalPosts,
          videos: contentMetrics.totalVideos,
          stories: contentMetrics.totalStories,
          engagement: contentMetrics.averageEngagement,
        },
        revenue: {
          total: revenueMetrics.totalRevenue,
          growth: calculateGrowthRate(revenueMetrics.totalRevenue, previousRevenueMetrics.totalRevenue),
          sources: revenueMetrics.revenueBySource,
          arpu: revenueMetrics.arpu,
        },
        engagement: {
          rate: engagementMetrics.overallRate,
          growth: calculateGrowthRate(engagementMetrics.overallRate, previousEngagementMetrics.overallRate),
          topContent: engagementMetrics.topContent,
          activeTime: engagementMetrics.averageSessionTime,
        },
        performance: {
          responseTime: performanceMetrics.averageResponseTime,
          uptime: performanceMetrics.uptime,
          errorRate: performanceMetrics.errorRate,
          throughput: performanceMetrics.requestsPerSecond,
        },
      },
      realTime: realTimeData,
      trends: await getTrendingMetrics(dateRange),
      alerts: await getSystemAlerts(),
    };

    res.json({
      success: true,
      dashboard,
      timeframe,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/users
 * Get detailed user analytics
 */
router.get("/users", authenticateToken, requireRole(['admin', 'analytics']), async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const dateRange = getDateRange(query.timeframe);

    const userAnalyticsData = await db
      .select({
        date: sql<string>`DATE_TRUNC(${query.granularity}, ${userAnalytics.date})`,
        newUsers: sum(userAnalytics.newUsers),
        activeUsers: sum(userAnalytics.activeUsers),
        returningUsers: sum(userAnalytics.returningUsers),
        totalSessions: sum(userAnalytics.totalSessions),
        averageSessionDuration: avg(userAnalytics.averageSessionDuration),
        bounceRate: avg(userAnalytics.bounceRate),
        conversionRate: avg(userAnalytics.conversionRate),
      })
      .from(userAnalytics)
      .where(
        and(
          gte(userAnalytics.date, dateRange.start),
          lte(userAnalytics.date, dateRange.end)
        )
      )
      .groupBy(sql`DATE_TRUNC(${query.granularity}, ${userAnalytics.date})`)
      .orderBy(sql`DATE_TRUNC(${query.granularity}, ${userAnalytics.date})`);

    // Get demographic breakdown
    const demographics = await getUserDemographics(dateRange, query.filters);

    // Get retention cohorts
    const retention = await getRetentionCohorts(dateRange);

    // Get user segments
    const segments = await getUserSegments(dateRange);

    res.json({
      success: true,
      data: {
        timeSeries: userAnalyticsData,
        demographics,
        retention,
        segments,
        summary: {
          totalUsers: userAnalyticsData.reduce((sum, d) => sum + Number(d.newUsers), 0),
          averageSessionDuration: userAnalyticsData.length > 0 ? 
            userAnalyticsData.reduce((sum, d) => sum + Number(d.averageSessionDuration), 0) / userAnalyticsData.length : 0,
          averageBounceRate: userAnalyticsData.length > 0 ? 
            userAnalyticsData.reduce((sum, d) => sum + Number(d.bounceRate), 0) / userAnalyticsData.length : 0,
        },
      },
      timeframe: query.timeframe,
      granularity: query.granularity,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/content
 * Get content performance analytics
 */
router.get("/content", authenticateToken, requireRole(['admin', 'analytics']), async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const dateRange = getDateRange(query.timeframe);

    const contentData = await db
      .select({
        date: sql<string>`DATE_TRUNC(${query.granularity}, ${contentAnalytics.date})`,
        totalPosts: sum(contentAnalytics.totalPosts),
        totalViews: sum(contentAnalytics.totalViews),
        totalLikes: sum(contentAnalytics.totalLikes),
        totalComments: sum(contentAnalytics.totalComments),
        totalShares: sum(contentAnalytics.totalShares),
        engagementRate: avg(contentAnalytics.engagementRate),
        viralContent: sum(contentAnalytics.viralContent),
      })
      .from(contentAnalytics)
      .where(
        and(
          gte(contentAnalytics.date, dateRange.start),
          lte(contentAnalytics.date, dateRange.end),
          query.filters?.contentType ? eq(contentAnalytics.contentType, query.filters.contentType) : undefined
        )
      )
      .groupBy(sql`DATE_TRUNC(${query.granularity}, ${contentAnalytics.date})`)
      .orderBy(sql`DATE_TRUNC(${query.granularity}, ${contentAnalytics.date})`);

    // Get top performing content
    const topContent = await getTopPerformingContent(dateRange, query.filters);

    // Get content categories breakdown
    const categories = await getContentCategoriesBreakdown(dateRange);

    // Get hashtag performance
    const hashtags = await getHashtagPerformance(dateRange);

    res.json({
      success: true,
      data: {
        timeSeries: contentData,
        topContent,
        categories,
        hashtags,
        summary: {
          totalPosts: contentData.reduce((sum, d) => sum + Number(d.totalPosts), 0),
          totalViews: contentData.reduce((sum, d) => sum + Number(d.totalViews), 0),
          averageEngagement: contentData.length > 0 ? 
            contentData.reduce((sum, d) => sum + Number(d.engagementRate), 0) / contentData.length : 0,
        },
      },
      timeframe: query.timeframe,
      granularity: query.granularity,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/revenue
 * Get revenue analytics
 */
router.get("/revenue", authenticateToken, requireRole(['admin', 'finance']), async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const dateRange = getDateRange(query.timeframe);

    const revenueData = await db
      .select({
        date: sql<string>`DATE_TRUNC(${query.granularity}, ${revenueAnalytics.date})`,
        totalRevenue: sum(revenueAnalytics.totalRevenue),
        subscriptionRevenue: sum(revenueAnalytics.subscriptionRevenue),
        marketplaceRevenue: sum(revenueAnalytics.marketplaceRevenue),
        freelanceRevenue: sum(revenueAnalytics.freelanceRevenue),
        cryptoRevenue: sum(revenueAnalytics.cryptoRevenue),
        adRevenue: sum(revenueAnalytics.adRevenue),
        platformFees: sum(revenueAnalytics.platformFees),
        refunds: sum(revenueAnalytics.refunds),
        chargeBacks: sum(revenueAnalytics.chargeBacks),
      })
      .from(revenueAnalytics)
      .where(
        and(
          gte(revenueAnalytics.date, dateRange.start),
          lte(revenueAnalytics.date, dateRange.end)
        )
      )
      .groupBy(sql`DATE_TRUNC(${query.granularity}, ${revenueAnalytics.date})`)
      .orderBy(sql`DATE_TRUNC(${query.granularity}, ${revenueAnalytics.date})`);

    // Get revenue forecasting
    const forecast = await getRevenueForecast(dateRange);

    // Get customer lifetime value
    const ltv = await getCustomerLifetimeValue(dateRange);

    // Get payment methods breakdown
    const paymentMethods = await getPaymentMethodsBreakdown(dateRange);

    res.json({
      success: true,
      data: {
        timeSeries: revenueData,
        forecast,
        ltv,
        paymentMethods,
        summary: {
          totalRevenue: revenueData.reduce((sum, d) => sum + Number(d.totalRevenue), 0),
          averageDailyRevenue: revenueData.length > 0 ? 
            revenueData.reduce((sum, d) => sum + Number(d.totalRevenue), 0) / revenueData.length : 0,
          topRevenueSource: getTopRevenueSource(revenueData),
        },
      },
      timeframe: query.timeframe,
      granularity: query.granularity,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analytics/events
 * Track custom events
 */
router.post("/events", authenticateToken, analyticsLimiter, async (req, res, next) => {
  try {
    const eventData = customEventSchema.parse(req.body);
    const userId = eventData.userId || req.user!.userId;

    // Store custom event
    await db.insert(customEvents).values({
      eventName: eventData.eventName,
      userId,
      sessionId: eventData.sessionId,
      properties: eventData.properties,
      metadata: {
        ...eventData.metadata,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      },
    });

    // Update real-time metrics
    await updateRealTimeMetrics(eventData.eventName, userId);

    res.json({
      success: true,
      message: "Event tracked successfully",
      eventId: `evt_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/funnel/:funnelId
 * Get conversion funnel analytics
 */
router.get("/funnel/:funnelId", authenticateToken, requireRole(['admin', 'analytics']), async (req, res, next) => {
  try {
    const { funnelId } = req.params;
    const { timeframe = '30d' } = req.query;
    const dateRange = getDateRange(timeframe as string);

    const funnelData = await db
      .select()
      .from(conversionFunnels)
      .where(
        and(
          eq(conversionFunnels.funnelId, funnelId),
          gte(conversionFunnels.date, dateRange.start),
          lte(conversionFunnels.date, dateRange.end)
        )
      )
      .orderBy(conversionFunnels.step);

    // Calculate conversion rates between steps
    const stepsWithConversion = funnelData.map((step, index) => {
      const nextStep = funnelData[index + 1];
      return {
        ...step,
        conversionRate: nextStep ? 
          (Number(nextStep.users) / Number(step.users)) * 100 : 100,
        dropOffRate: nextStep ? 
          ((Number(step.users) - Number(nextStep.users)) / Number(step.users)) * 100 : 0,
      };
    });

    res.json({
      success: true,
      funnel: {
        id: funnelId,
        steps: stepsWithConversion,
        overallConversion: funnelData.length > 0 ? 
          (Number(funnelData[funnelData.length - 1]?.users) / Number(funnelData[0]?.users)) * 100 : 0,
        totalUsers: funnelData[0]?.users || 0,
        completedUsers: funnelData[funnelData.length - 1]?.users || 0,
      },
      timeframe,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/cohorts
 * Get cohort analysis
 */
router.get("/cohorts", authenticateToken, requireRole(['admin', 'analytics']), async (req, res, next) => {
  try {
    const { type = 'retention', period = 'weekly' } = req.query;

    const cohorts = await db
      .select()
      .from(cohortAnalytics)
      .where(
        and(
          eq(cohortAnalytics.cohortType, type as string),
          eq(cohortAnalytics.period, period as string)
        )
      )
      .orderBy(cohortAnalytics.cohortDate, cohortAnalytics.periodNumber);

    // Group by cohort date
    const groupedCohorts = cohorts.reduce((acc, cohort) => {
      const key = cohort.cohortDate.toISOString();
      if (!acc[key]) {
        acc[key] = {
          cohortDate: cohort.cohortDate,
          cohortSize: cohort.cohortSize,
          periods: [],
        };
      }
      acc[key].periods.push({
        period: cohort.periodNumber,
        users: cohort.users,
        retentionRate: cohort.retentionRate,
        revenue: cohort.revenue,
      });
      return acc;
    }, {} as Record<string, any>);

    res.json({
      success: true,
      cohorts: Object.values(groupedCohorts),
      type,
      period,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analytics/reports
 * Generate custom analytics report
 */
router.post("/reports", authenticateToken, requireRole(['admin', 'analytics']), reportsLimiter, async (req, res, next) => {
  try {
    const reportData = reportRequestSchema.parse(req.body);

    const report = await generateAnalyticsReport({
      type: reportData.reportType,
      dateRange: {
        start: new Date(reportData.dateRange.start),
        end: new Date(reportData.dateRange.end),
      },
      filters: reportData.filters,
      format: reportData.format,
      includeCharts: reportData.includeCharts,
    });

    // Send via email if recipients specified
    if (reportData.recipients && reportData.recipients.length > 0) {
      setImmediate(async () => {
        await sendReportViaEmail(report, reportData.recipients);
      });
    }

    res.json({
      success: true,
      report,
      message: reportData.recipients ? 
        "Report generated and sent via email" : 
        "Report generated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getDateRange(timeframe: string): { start: Date; end: Date } {
  const end = new Date();
  let start = new Date();

  switch (timeframe) {
    case '1h':
      start.setHours(start.getHours() - 1);
      break;
    case '24h':
      start.setDate(start.getDate() - 1);
      break;
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case '90d':
      start.setDate(start.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    case 'all':
      start = new Date('2024-01-01');
      break;
  }

  return { start, end };
}

function getPreviousPeriodRange(currentRange: { start: Date; end: Date }): { start: Date; end: Date } {
  const duration = currentRange.end.getTime() - currentRange.start.getTime();
  return {
    start: new Date(currentRange.start.getTime() - duration),
    end: new Date(currentRange.start.getTime()),
  };
}

function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Mock implementation functions - these would be implemented with actual analytics logic
async function getUserMetrics(dateRange: { start: Date; end: Date }) {
  return {
    totalUsers: 10000,
    activeUsers: 5000,
    newUsers: 500,
  };
}

async function getContentMetrics(dateRange: { start: Date; end: Date }) {
  return {
    totalPosts: 50000,
    totalVideos: 20000,
    totalStories: 30000,
    averageEngagement: 8.5,
  };
}

async function getRevenueMetrics(dateRange: { start: Date; end: Date }) {
  return {
    totalRevenue: 100000,
    revenueBySource: {
      subscriptions: 40000,
      marketplace: 30000,
      freelance: 20000,
      crypto: 10000,
    },
    arpu: 20,
  };
}

async function getEngagementMetrics(dateRange: { start: Date; end: Date }) {
  return {
    overallRate: 12.5,
    topContent: [],
    averageSessionTime: 1800, // 30 minutes
  };
}

async function getPerformanceMetrics(dateRange: { start: Date; end: Date }) {
  return {
    averageResponseTime: 250,
    uptime: 99.9,
    errorRate: 0.1,
    requestsPerSecond: 1000,
  };
}

async function getRealTimeMetrics() {
  return {
    activeUsers: 2500,
    postsPerMinute: 50,
    revenue: 1000,
    errors: 2,
  };
}

async function getTrendingMetrics(dateRange: { start: Date; end: Date }) {
  return {
    hashtags: ['#trending', '#viral', '#popular'],
    topics: ['AI', 'Crypto', 'Social'],
    creators: [],
  };
}

async function getSystemAlerts() {
  return [
    {
      id: '1',
      type: 'performance',
      message: 'Response time increased by 15%',
      severity: 'warning',
      timestamp: new Date(),
    },
  ];
}

async function getUserDemographics(dateRange: any, filters: any) {
  return {
    age: { '18-24': 30, '25-34': 40, '35-44': 20, '45+': 10 },
    gender: { male: 55, female: 43, other: 2 },
    location: { 'US': 40, 'UK': 20, 'CA': 15, 'Other': 25 },
  };
}

async function getRetentionCohorts(dateRange: any) {
  return [
    { week: 1, retention: 70 },
    { week: 2, retention: 45 },
    { week: 4, retention: 30 },
    { week: 8, retention: 20 },
  ];
}

async function getUserSegments(dateRange: any) {
  return [
    { segment: 'New Users', count: 1000, percentage: 20 },
    { segment: 'Active Users', count: 3000, percentage: 60 },
    { segment: 'Power Users', count: 1000, percentage: 20 },
  ];
}

async function getTopPerformingContent(dateRange: any, filters: any) {
  return [];
}

async function getContentCategoriesBreakdown(dateRange: any) {
  return {
    entertainment: 40,
    education: 25,
    lifestyle: 20,
    business: 15,
  };
}

async function getHashtagPerformance(dateRange: any) {
  return [];
}

async function getRevenueForecast(dateRange: any) {
  return {
    predicted: 120000,
    confidence: 85,
    factors: ['seasonal', 'growth_trend', 'market_conditions'],
  };
}

async function getCustomerLifetimeValue(dateRange: any) {
  return {
    average: 150,
    segments: {
      bronze: 50,
      silver: 100,
      gold: 250,
      platinum: 500,
    },
  };
}

async function getPaymentMethodsBreakdown(dateRange: any) {
  return {
    crypto: 45,
    credit_card: 35,
    paypal: 15,
    bank_transfer: 5,
  };
}

function getTopRevenueSource(revenueData: any[]) {
  return 'subscriptions';
}

async function updateRealTimeMetrics(eventName: string, userId: string) {
  // Update real-time metrics
}

async function generateAnalyticsReport(params: any) {
  return {
    id: `report_${Date.now()}`,
    type: params.type,
    data: {},
    generatedAt: new Date(),
    format: params.format,
  };
}

async function sendReportViaEmail(report: any, recipients: string[]) {
  // Send report via email
}

export default router;
