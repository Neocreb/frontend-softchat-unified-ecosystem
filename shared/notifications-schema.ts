import { pgTable, text, timestamp, integer, boolean, uuid, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Main notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  type: varchar('type', { length: 30 }).notNull(), // like, comment, follow, mention, system, etc.
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data').$type<any>(), // structured data specific to notification type
  actorId: uuid('actor_id'), // user who triggered the notification
  targetType: varchar('target_type', { length: 20 }), // post, video, comment, user
  targetId: uuid('target_id'),
  actionUrl: text('action_url'), // deep link or URL to navigate to
  priority: varchar('priority', { length: 10 }).notNull().default('medium'), // low, medium, high, urgent
  category: varchar('category', { length: 30 }), // social, system, marketing, alerts
  status: varchar('status', { length: 20 }).notNull().default('unread'), // unread, read, archived
  deliveryStatus: varchar('delivery_status', { length: 20 }).notNull().default('pending'), // pending, sent, failed
  scheduledFor: timestamp('scheduled_for'),
  sentAt: timestamp('sent_at'),
  readAt: timestamp('read_at'),
  clickedAt: timestamp('clicked_at'),
  dismissedAt: timestamp('dismissed_at'),
  expiresAt: timestamp('expires_at'),
  groupKey: text('group_key'), // for grouping similar notifications
  batchId: uuid('batch_id'), // for bulk notifications
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  typeIdx: index('notifications_type_idx').on(table.type),
  statusIdx: index('notifications_status_idx').on(table.status),
  priorityIdx: index('notifications_priority_idx').on(table.priority),
  scheduledForIdx: index('notifications_scheduled_for_idx').on(table.scheduledFor),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
  groupKeyIdx: index('notifications_group_key_idx').on(table.groupKey),
}));

// Push notifications
export const pushNotifications = pgTable('push_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  notificationId: uuid('notification_id').notNull(),
  deviceToken: text('device_token').notNull(),
  platform: varchar('platform', { length: 10 }).notNull(), // ios, android, web
  title: text('title').notNull(),
  body: text('body').notNull(),
  icon: text('icon'),
  image: text('image'),
  badge: integer('badge'),
  sound: varchar('sound', { length: 30 }),
  clickAction: text('click_action'),
  data: jsonb('data').$type<any>(),
  ttl: integer('ttl'), // time to live in seconds
  collapseKey: text('collapse_key'),
  priority: varchar('priority', { length: 10 }).default('normal'), // low, normal, high
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, sent, failed, clicked
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  clickedAt: timestamp('clicked_at'),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  notificationIdx: index('push_notifications_notification_idx').on(table.notificationId),
  deviceTokenIdx: index('push_notifications_device_token_idx').on(table.deviceToken),
  platformIdx: index('push_notifications_platform_idx').on(table.platform),
  statusIdx: index('push_notifications_status_idx').on(table.status),
  sentAtIdx: index('push_notifications_sent_at_idx').on(table.sentAt),
}));

// Email notifications
export const emailNotifications = pgTable('email_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  notificationId: uuid('notification_id').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  htmlContent: text('html_content').notNull(),
  textContent: text('text_content'),
  fromEmail: text('from_email').notNull(),
  fromName: text('from_name'),
  replyTo: text('reply_to'),
  templateId: text('template_id'),
  templateData: jsonb('template_data').$type<any>(),
  priority: varchar('priority', { length: 10 }).default('normal'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, sent, failed, bounced, opened, clicked
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  bouncedAt: timestamp('bounced_at'),
  unsubscribedAt: timestamp('unsubscribed_at'),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  trackingPixel: text('tracking_pixel'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  notificationIdx: index('email_notifications_notification_idx').on(table.notificationId),
  emailIdx: index('email_notifications_email_idx').on(table.email),
  statusIdx: index('email_notifications_status_idx').on(table.status),
  sentAtIdx: index('email_notifications_sent_at_idx').on(table.sentAt),
}));

// SMS notifications
export const smsNotifications = pgTable('sms_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  notificationId: uuid('notification_id').notNull(),
  phoneNumber: text('phone_number').notNull(),
  message: text('message').notNull(),
  provider: varchar('provider', { length: 20 }), // twilio, aws_sns, etc.
  messageType: varchar('message_type', { length: 20 }).default('transactional'), // transactional, promotional
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, sent, failed, delivered, clicked
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  clickedAt: timestamp('clicked_at'),
  failedAt: timestamp('failed_at'),
  errorMessage: text('error_message'),
  cost: decimal('cost', { precision: 8, scale: 4 }), // cost in USD
  segments: integer('segments').default(1), // number of SMS segments
  providerId: text('provider_id'), // external provider message ID
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  notificationIdx: index('sms_notifications_notification_idx').on(table.notificationId),
  phoneIdx: index('sms_notifications_phone_idx').on(table.phoneNumber),
  statusIdx: index('sms_notifications_status_idx').on(table.status),
  sentAtIdx: index('sms_notifications_sent_at_idx').on(table.sentAt),
}));

// User notification preferences
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  preferences: jsonb('preferences').$type<any>().notNull(), // detailed preferences by type and channel
  globalEnabled: boolean('global_enabled').notNull().default(true),
  pushEnabled: boolean('push_enabled').notNull().default(true),
  emailEnabled: boolean('email_enabled').notNull().default(true),
  smsEnabled: boolean('sms_enabled').notNull().default(false),
  inAppEnabled: boolean('in_app_enabled').notNull().default(true),
  quietHoursStart: varchar('quiet_hours_start', { length: 5 }), // HH:MM format
  quietHoursEnd: varchar('quiet_hours_end', { length: 5 }), // HH:MM format
  timezone: varchar('timezone', { length: 50 }),
  frequency: varchar('frequency', { length: 20 }).default('instant'), // instant, hourly, daily, weekly
  digest: boolean('digest').default(false), // enable digest notifications
  digestTime: varchar('digest_time', { length: 5 }), // preferred digest time
  digestDays: jsonb('digest_days').$type<string[]>().default([]), // days for weekly digest
  language: varchar('language', { length: 10 }).default('en'),
  unsubscribeToken: text('unsubscribe_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notification_preferences_user_idx').on(table.userId),
  unsubscribeTokenIdx: index('notification_preferences_unsubscribe_token_idx').on(table.unsubscribeToken),
}));

// Device tokens for push notifications
export const deviceTokens = pgTable('device_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  token: text('token').notNull().unique(),
  platform: varchar('platform', { length: 10 }).notNull(), // ios, android, web
  deviceInfo: jsonb('device_info').$type<any>(), // device model, OS version, etc.
  appVersion: varchar('app_version', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  lastUsed: timestamp('last_used').defaultNow().notNull(),
  badgeCount: integer('badge_count').notNull().default(0),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('device_tokens_user_idx').on(table.userId),
  tokenIdx: index('device_tokens_token_idx').on(table.token),
  platformIdx: index('device_tokens_platform_idx').on(table.platform),
  isActiveIdx: index('device_tokens_is_active_idx').on(table.isActive),
  lastUsedIdx: index('device_tokens_last_used_idx').on(table.lastUsed),
}));

// Notification templates
export const notificationTemplates = pgTable('notification_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 30 }).notNull(),
  channel: varchar('channel', { length: 20 }).notNull(), // push, email, sms, in_app
  language: varchar('language', { length: 10 }).notNull().default('en'),
  subject: text('subject'), // for email notifications
  title: text('title'),
  body: text('body').notNull(),
  htmlContent: text('html_content'), // for email notifications
  variables: jsonb('variables').$type<string[]>().default([]), // available template variables
  defaultData: jsonb('default_data').$type<any>(), // default values for variables
  isActive: boolean('is_active').notNull().default(true),
  version: integer('version').notNull().default(1),
  createdBy: uuid('created_by').notNull(),
  approvedBy: uuid('approved_by'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('notification_templates_name_idx').on(table.name),
  typeIdx: index('notification_templates_type_idx').on(table.type),
  channelIdx: index('notification_templates_channel_idx').on(table.channel),
  languageIdx: index('notification_templates_language_idx').on(table.language),
  isActiveIdx: index('notification_templates_is_active_idx').on(table.isActive),
}));

// Notification campaigns
export const notificationCampaigns = pgTable('notification_campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  templateId: uuid('template_id').notNull(),
  targetAudience: jsonb('target_audience').$type<any>().notNull(), // user segmentation criteria
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, scheduled, running, completed, paused, cancelled
  scheduledFor: timestamp('scheduled_for'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  totalRecipients: integer('total_recipients').notNull().default(0),
  sentCount: integer('sent_count').notNull().default(0),
  deliveredCount: integer('delivered_count').notNull().default(0),
  openedCount: integer('opened_count').notNull().default(0),
  clickedCount: integer('clicked_count').notNull().default(0),
  unsubscribedCount: integer('unsubscribed_count').notNull().default(0),
  failedCount: integer('failed_count').notNull().default(0),
  priority: varchar('priority', { length: 10 }).default('medium'),
  abTestEnabled: boolean('ab_test_enabled').default(false),
  abTestConfig: jsonb('ab_test_config').$type<any>(),
  frequency: varchar('frequency', { length: 20 }).default('once'), // once, daily, weekly, monthly
  maxOccurrences: integer('max_occurrences'),
  currentOccurrence: integer('current_occurrence').default(0),
  createdBy: uuid('created_by').notNull(),
  approvedBy: uuid('approved_by'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('notification_campaigns_status_idx').on(table.status),
  scheduledForIdx: index('notification_campaigns_scheduled_for_idx').on(table.scheduledFor),
  createdByIdx: index('notification_campaigns_created_by_idx').on(table.createdBy),
  createdAtIdx: index('notification_campaigns_created_at_idx').on(table.createdAt),
}));

// Campaign recipients tracking
export const campaignRecipients = pgTable('campaign_recipients', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').notNull(),
  userId: uuid('user_id').notNull(),
  notificationId: uuid('notification_id'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, sent, failed, opened, clicked
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  unsubscribedAt: timestamp('unsubscribed_at'),
  errorMessage: text('error_message'),
  abTestGroup: varchar('ab_test_group', { length: 10 }), // A, B, C, etc.
  personalizedData: jsonb('personalized_data').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  campaignIdx: index('campaign_recipients_campaign_idx').on(table.campaignId),
  userIdx: index('campaign_recipients_user_idx').on(table.userId),
  statusIdx: index('campaign_recipients_status_idx').on(table.status),
  campaignUserIdx: index('campaign_recipients_campaign_user_idx').on(table.campaignId, table.userId),
}));

// Notification analytics
export const notificationAnalytics = pgTable('notification_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  notificationType: varchar('notification_type', { length: 30 }),
  channel: varchar('channel', { length: 20 }).notNull(), // push, email, sms, in_app
  campaignId: uuid('campaign_id'),
  sent: integer('sent').notNull().default(0),
  delivered: integer('delivered').notNull().default(0),
  opened: integer('opened').notNull().default(0),
  clicked: integer('clicked').notNull().default(0),
  failed: integer('failed').notNull().default(0),
  bounced: integer('bounced').notNull().default(0),
  unsubscribed: integer('unsubscribed').notNull().default(0),
  cost: decimal('cost', { precision: 10, scale: 4 }).default('0.00'),
  openRate: decimal('open_rate', { precision: 5, scale: 2 }),
  clickRate: decimal('click_rate', { precision: 5, scale: 2 }),
  deliveryRate: decimal('delivery_rate', { precision: 5, scale: 2 }),
  unsubscribeRate: decimal('unsubscribe_rate', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  dateIdx: index('notification_analytics_date_idx').on(table.date),
  typeIdx: index('notification_analytics_type_idx').on(table.notificationType),
  channelIdx: index('notification_analytics_channel_idx').on(table.channel),
  campaignIdx: index('notification_analytics_campaign_idx').on(table.campaignId),
  dateChannelIdx: index('notification_analytics_date_channel_idx').on(table.date, table.channel),
}));

// Unsubscribe records
export const unsubscribeRecords = pgTable('unsubscribe_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  email: text('email'),
  phoneNumber: text('phone_number'),
  unsubscribeType: varchar('unsubscribe_type', { length: 20 }).notNull(), // all, email, sms, specific_type
  notificationType: varchar('notification_type', { length: 30 }), // specific type if not all
  reason: varchar('reason', { length: 50 }),
  comment: text('comment'),
  source: varchar('source', { length: 30 }), // email_link, settings_page, support
  token: text('token'), // unsubscribe token used
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('unsubscribe_records_user_idx').on(table.userId),
  emailIdx: index('unsubscribe_records_email_idx').on(table.email),
  phoneIdx: index('unsubscribe_records_phone_idx').on(table.phoneNumber),
  typeIdx: index('unsubscribe_records_type_idx').on(table.unsubscribeType),
  tokenIdx: index('unsubscribe_records_token_idx').on(table.token),
}));
