import express from 'express';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';
import { 
  sendSMSNotification,
  sendEmailNotification,
  sendPushNotification,
  sendWhatsAppMessage,
  createBulkNotification,
  getNotificationHistory,
  updateNotificationPreferences,
  getNotificationTemplates,
  trackNotificationDelivery,
  sendVoiceCall,
  sendUSSDMenu,
  phoneNumberLookup
} from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// =============================================================================
// SMS NOTIFICATION ENDPOINTS
// =============================================================================

// Send single SMS notification
router.post('/sms/send', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, message, type, template, variables } = req.body;
    const userId = req.userId;
    
    if (!phoneNumber || (!message && !template)) {
      return res.status(400).json({ 
        error: 'Phone number and either message or template are required' 
      });
    }
    
    const smsData = {
      userId,
      phoneNumber,
      message,
      type: type || 'general', // otp, marketing, transactional, alert
      template,
      variables,
      priority: 'normal'
    };
    
    const result = await sendSMSNotification(smsData);
    
    if (result.success) {
      logger.info('SMS sent successfully', { 
        userId, 
        messageId: result.messageId,
        phoneNumber: phoneNumber.substring(0, 4) + '****',
        provider: result.provider 
      });
      
      res.json({
        success: true,
        messageId: result.messageId,
        status: result.status,
        provider: result.provider,
        cost: result.cost,
        estimatedDelivery: result.estimatedDelivery
      });
    } else {
      res.status(400).json({ 
        error: 'SMS sending failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('SMS send error:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send OTP via SMS
router.post('/sms/otp', async (req, res) => {
  try {
    const { phoneNumber, purpose, expiryMinutes = 10 } = req.body;
    
    if (!phoneNumber || !purpose) {
      return res.status(400).json({ 
        error: 'Phone number and purpose are required' 
      });
    }
    
    const result = await sendOTPSMS(phoneNumber, purpose, expiryMinutes);
    
    if (result.success) {
      logger.info('OTP SMS sent', { 
        phoneNumber: phoneNumber.substring(0, 4) + '****',
        purpose,
        otpId: result.otpId 
      });
      
      res.json({
        success: true,
        otpId: result.otpId,
        messageId: result.messageId,
        expiresIn: result.expiresIn,
        maskedPhone: phoneNumber.substring(0, 4) + '****' + phoneNumber.slice(-2)
      });
    } else {
      res.status(400).json({ 
        error: 'OTP sending failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('OTP SMS error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/sms/verify-otp', async (req, res) => {
  try {
    const { otpId, otp, phoneNumber } = req.body;
    
    if (!otpId || !otp) {
      return res.status(400).json({ 
        error: 'OTP ID and OTP code are required' 
      });
    }
    
    const result = await verifyOTP(otpId, otp, phoneNumber);
    
    if (result.success) {
      logger.info('OTP verified successfully', { otpId, phoneNumber: phoneNumber?.substring(0, 4) + '****' });
      
      res.json({
        success: true,
        verified: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({ 
        error: 'OTP verification failed', 
        details: result.error,
        attemptsRemaining: result.attemptsRemaining 
      });
    }
  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Send bulk SMS
router.post('/sms/bulk', authenticateAdmin, async (req, res) => {
  try {
    const { recipients, message, template, variables, scheduledAt } = req.body;
    const adminId = req.userId;
    
    if (!recipients || recipients.length === 0 || (!message && !template)) {
      return res.status(400).json({ 
        error: 'Recipients and either message or template are required' 
      });
    }
    
    if (recipients.length > 10000) {
      return res.status(400).json({ 
        error: 'Maximum 10,000 recipients allowed per bulk SMS' 
      });
    }
    
    const bulkData = {
      adminId,
      recipients,
      message,
      template,
      variables,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      type: 'bulk_sms'
    };
    
    const result = await createBulkNotification(bulkData);
    
    if (result.success) {
      logger.info('Bulk SMS initiated', { 
        adminId, 
        campaignId: result.campaignId,
        recipientCount: recipients.length 
      });
      
      res.status(201).json({
        success: true,
        campaignId: result.campaignId,
        recipientCount: recipients.length,
        estimatedCost: result.estimatedCost,
        status: result.status,
        scheduledAt: result.scheduledAt
      });
    } else {
      res.status(400).json({ 
        error: 'Bulk SMS creation failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Bulk SMS error:', error);
    res.status(500).json({ error: 'Failed to create bulk SMS campaign' });
  }
});

// =============================================================================
// VOICE CALL ENDPOINTS
// =============================================================================

// Send voice call notification
router.post('/voice/call', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, message, language = 'en', voice = 'female' } = req.body;
    const userId = req.userId;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ 
        error: 'Phone number and message are required' 
      });
    }
    
    const voiceData = {
      userId,
      phoneNumber,
      message,
      language,
      voice, // male, female
      priority: 'high'
    };
    
    const result = await sendVoiceCall(voiceData);
    
    if (result.success) {
      logger.info('Voice call initiated', { 
        userId, 
        callId: result.callId,
        phoneNumber: phoneNumber.substring(0, 4) + '****' 
      });
      
      res.json({
        success: true,
        callId: result.callId,
        status: result.status,
        duration: result.duration,
        cost: result.cost
      });
    } else {
      res.status(400).json({ 
        error: 'Voice call failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Voice call error:', error);
    res.status(500).json({ error: 'Failed to initiate voice call' });
  }
});

// =============================================================================
// USSD MENU ENDPOINTS
// =============================================================================

// Create USSD menu session
router.post('/ussd/create', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, menuStructure, sessionData } = req.body;
    const userId = req.userId;
    
    if (!phoneNumber || !menuStructure) {
      return res.status(400).json({ 
        error: 'Phone number and menu structure are required' 
      });
    }
    
    const ussdData = {
      userId,
      phoneNumber,
      menuStructure,
      sessionData: sessionData || {}
    };
    
    const result = await sendUSSDMenu(ussdData);
    
    if (result.success) {
      logger.info('USSD menu created', { 
        userId, 
        sessionId: result.sessionId,
        phoneNumber: phoneNumber.substring(0, 4) + '****' 
      });
      
      res.json({
        success: true,
        sessionId: result.sessionId,
        shortCode: result.shortCode,
        menuText: result.menuText
      });
    } else {
      res.status(400).json({ 
        error: 'USSD menu creation failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('USSD menu error:', error);
    res.status(500).json({ error: 'Failed to create USSD menu' });
  }
});

// =============================================================================
// WHATSAPP MESSAGING ENDPOINTS
// =============================================================================

// Send WhatsApp message
router.post('/whatsapp/send', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, message, messageType, templateName, templateVariables } = req.body;
    const userId = req.userId;
    
    if (!phoneNumber || (!message && !templateName)) {
      return res.status(400).json({ 
        error: 'Phone number and either message or template name are required' 
      });
    }
    
    const whatsappData = {
      userId,
      phoneNumber,
      message,
      messageType: messageType || 'text', // text, template, media
      templateName,
      templateVariables,
      namespace: process.env.WHATSAPP_NAMESPACE
    };
    
    const result = await sendWhatsAppMessage(whatsappData);
    
    if (result.success) {
      logger.info('WhatsApp message sent', { 
        userId, 
        messageId: result.messageId,
        phoneNumber: phoneNumber.substring(0, 4) + '****' 
      });
      
      res.json({
        success: true,
        messageId: result.messageId,
        status: result.status,
        timestamp: result.timestamp
      });
    } else {
      res.status(400).json({ 
        error: 'WhatsApp message failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('WhatsApp message error:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// =============================================================================
// EMAIL NOTIFICATION ENDPOINTS
// =============================================================================

// Send email notification
router.post('/email/send', authenticateToken, async (req, res) => {
  try {
    const { to, subject, message, template, variables, attachments } = req.body;
    const userId = req.userId;
    
    if (!to || (!subject && !template) || (!message && !template)) {
      return res.status(400).json({ 
        error: 'Recipient, subject, and message (or template) are required' 
      });
    }
    
    const emailData = {
      userId,
      to: Array.isArray(to) ? to : [to],
      subject,
      message,
      template,
      variables,
      attachments,
      priority: 'normal'
    };
    
    const result = await sendEmailNotification(emailData);
    
    if (result.success) {
      logger.info('Email sent successfully', { 
        userId, 
        messageId: result.messageId,
        recipients: emailData.to.length 
      });
      
      res.json({
        success: true,
        messageId: result.messageId,
        status: result.status,
        recipients: result.recipients
      });
    } else {
      res.status(400).json({ 
        error: 'Email sending failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// =============================================================================
// PUSH NOTIFICATION ENDPOINTS
// =============================================================================

// Send push notification
router.post('/push/send', authenticateToken, async (req, res) => {
  try {
    const { title, body, data, targetUsers, deviceTokens } = req.body;
    const userId = req.userId;
    
    if (!title || !body || (!targetUsers && !deviceTokens)) {
      return res.status(400).json({ 
        error: 'Title, body, and either target users or device tokens are required' 
      });
    }
    
    const pushData = {
      userId,
      title,
      body,
      data: data || {},
      targetUsers,
      deviceTokens,
      priority: 'normal'
    };
    
    const result = await sendPushNotification(pushData);
    
    if (result.success) {
      logger.info('Push notification sent', { 
        userId, 
        notificationId: result.notificationId,
        targetCount: result.targetCount 
      });
      
      res.json({
        success: true,
        notificationId: result.notificationId,
        targetCount: result.targetCount,
        successCount: result.successCount,
        failureCount: result.failureCount
      });
    } else {
      res.status(400).json({ 
        error: 'Push notification failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Push notification error:', error);
    res.status(500).json({ error: 'Failed to send push notification' });
  }
});

// =============================================================================
// NOTIFICATION HISTORY AND TRACKING
// =============================================================================

// Get notification history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      type, 
      status, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 50 
    } = req.query;
    
    const filters = {
      type, // sms, email, push, voice, whatsapp
      status, // sent, delivered, failed, pending
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };
    
    const history = await getNotificationHistory(userId, filters, parseInt(page), parseInt(limit));
    
    res.json({
      notifications: history.notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: history.total,
        pages: Math.ceil(history.total / parseInt(limit))
      },
      summary: history.summary
    });
  } catch (error) {
    logger.error('Notification history error:', error);
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
});

// Track notification delivery status
router.get('/track/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;
    
    const tracking = await trackNotificationDelivery(messageId, userId);
    
    if (tracking) {
      res.json({
        messageId,
        status: tracking.status,
        deliveredAt: tracking.deliveredAt,
        readAt: tracking.readAt,
        failureReason: tracking.failureReason,
        attempts: tracking.attempts,
        lastAttempt: tracking.lastAttempt
      });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    logger.error('Notification tracking error:', error);
    res.status(500).json({ error: 'Failed to track notification' });
  }
});

// =============================================================================
// NOTIFICATION PREFERENCES
// =============================================================================

// Get user notification preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    const preferences = await getUserNotificationPreferences(userId);
    
    res.json({
      userId,
      preferences: {
        email: preferences.email || {},
        sms: preferences.sms || {},
        push: preferences.push || {},
        whatsapp: preferences.whatsapp || {}
      },
      updatedAt: preferences.updatedAt
    });
  } catch (error) {
    logger.error('Notification preferences fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { email, sms, push, whatsapp } = req.body;
    
    const preferences = {
      email: email || {},
      sms: sms || {},
      push: push || {},
      whatsapp: whatsapp || {}
    };
    
    const result = await updateNotificationPreferences(userId, preferences);
    
    if (result.success) {
      logger.info('Notification preferences updated', { userId });
      
      res.json({
        success: true,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to update preferences', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Notification preferences update error:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// =============================================================================
// PHONE NUMBER UTILITIES
// =============================================================================

// Phone number lookup and validation
router.post('/phone/lookup', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const lookup = await phoneNumberLookup(phoneNumber);
    
    if (lookup.success) {
      res.json({
        phoneNumber,
        isValid: lookup.isValid,
        country: lookup.country,
        carrier: lookup.carrier,
        lineType: lookup.lineType,
        canReceiveSMS: lookup.canReceiveSMS,
        canReceiveVoice: lookup.canReceiveVoice,
        timezone: lookup.timezone
      });
    } else {
      res.status(400).json({ 
        error: 'Phone lookup failed', 
        details: lookup.error 
      });
    }
  } catch (error) {
    logger.error('Phone lookup error:', error);
    res.status(500).json({ error: 'Failed to lookup phone number' });
  }
});

// =============================================================================
// NOTIFICATION TEMPLATES
// =============================================================================

// Get available notification templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const { type, language = 'en' } = req.query;
    
    const templates = await getNotificationTemplates(type, language);
    
    res.json({
      templates,
      language,
      type: type || 'all'
    });
  } catch (error) {
    logger.error('Templates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// =============================================================================
// ADMIN ENDPOINTS
// =============================================================================

// Get notification analytics (admin only)
router.get('/admin/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { timeframe = '7d', type } = req.query;
    
    const analytics = await getNotificationAnalytics(timeframe, type);
    
    res.json({
      timeframe,
      type: type || 'all',
      analytics: {
        totalSent: analytics.totalSent,
        deliveryRate: analytics.deliveryRate,
        failureRate: analytics.failureRate,
        costTotal: analytics.costTotal,
        breakdown: analytics.breakdown,
        trends: analytics.trends
      }
    });
  } catch (error) {
    logger.error('Notification analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

// Africa's Talking delivery webhook
router.post('/webhooks/africas-talking', async (req, res) => {
  try {
    const { id, status, phoneNumber, networkCode, cost } = req.body;
    
    await handleDeliveryStatus('africas_talking', {
      messageId: id,
      status,
      phoneNumber,
      networkCode,
      cost,
      timestamp: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Africa\'s Talking webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Termii delivery webhook
router.post('/webhooks/termii', async (req, res) => {
  try {
    const { message_id, status, phone_number, cost } = req.body;
    
    await handleDeliveryStatus('termii', {
      messageId: message_id,
      status,
      phoneNumber: phone_number,
      cost,
      timestamp: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Termii webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Twilio status webhook
router.post('/webhooks/twilio', async (req, res) => {
  try {
    const { MessageSid, MessageStatus, To, ErrorCode } = req.body;
    
    await handleDeliveryStatus('twilio', {
      messageId: MessageSid,
      status: MessageStatus,
      phoneNumber: To,
      errorCode: ErrorCode,
      timestamp: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Twilio webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

async function sendOTPSMS(phoneNumber: string, purpose: string, expiryMinutes: number) {
  // Generate OTP and send via SMS
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpId = 'otp_' + Date.now();
  
  const message = `Your ${purpose} verification code is: ${otp}. Valid for ${expiryMinutes} minutes. Do not share this code.`;
  
  const result = await sendSMSNotification({
    phoneNumber,
    message,
    type: 'otp',
    priority: 'high'
  });
  
  if (result.success) {
    // Save OTP to database/cache for verification
    await saveOTPForVerification(otpId, otp, phoneNumber, purpose, expiryMinutes);
    
    return {
      success: true,
      otpId,
      messageId: result.messageId,
      expiresIn: expiryMinutes * 60 // in seconds
    };
  } else {
    return {
      success: false,
      error: result.error
    };
  }
}

async function verifyOTP(otpId: string, otp: string, phoneNumber?: string) {
  // Verify OTP from database/cache
  const storedOTP = await getStoredOTP(otpId);
  
  if (!storedOTP) {
    return {
      success: false,
      error: 'OTP not found or expired'
    };
  }
  
  if (storedOTP.otp !== otp) {
    // Increment attempt count
    await incrementOTPAttempts(otpId);
    
    return {
      success: false,
      error: 'Invalid OTP',
      attemptsRemaining: Math.max(0, 3 - (storedOTP.attempts + 1))
    };
  }
  
  // Mark OTP as used
  await markOTPAsUsed(otpId);
  
  return {
    success: true,
    verified: true
  };
}

async function getUserNotificationPreferences(userId: string) {
  // Mock preferences - replace with database query
  return {
    email: {
      marketing: true,
      transactional: true,
      security: true
    },
    sms: {
      otp: true,
      alerts: true,
      marketing: false
    },
    push: {
      enabled: true,
      trading: true,
      social: true
    },
    whatsapp: {
      enabled: false,
      updates: false
    },
    updatedAt: new Date()
  };
}

async function getNotificationAnalytics(timeframe: string, type?: string) {
  // Mock analytics - replace with actual database queries
  return {
    totalSent: 10000,
    deliveryRate: 95.5,
    failureRate: 4.5,
    costTotal: 150.75,
    breakdown: {
      sms: { sent: 6000, delivered: 5800, cost: 120.00 },
      email: { sent: 3000, delivered: 2950, cost: 15.00 },
      push: { sent: 1000, delivered: 980, cost: 0.00 }
    },
    trends: []
  };
}

async function handleDeliveryStatus(provider: string, data: any) {
  logger.info('Delivery status received', { provider, messageId: data.messageId, status: data.status });
  // Update message status in database
}

// Mock database functions
async function saveOTPForVerification(otpId: string, otp: string, phoneNumber: string, purpose: string, expiryMinutes: number) {
  logger.info('OTP saved for verification', { otpId, phoneNumber: phoneNumber.substring(0, 4) + '****', purpose });
}

async function getStoredOTP(otpId: string) {
  // Mock stored OTP
  return {
    otp: '123456',
    attempts: 0,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  };
}

async function incrementOTPAttempts(otpId: string) {
  logger.info('OTP attempt incremented', { otpId });
}

async function markOTPAsUsed(otpId: string) {
  logger.info('OTP marked as used', { otpId });
}

export default router;
