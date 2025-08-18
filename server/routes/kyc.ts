import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { 
  initiateKYCVerification,
  verifyIdentityDocument,
  performBiometricVerification,
  verifyBVN,
  verifyGhanaCard,
  verifyPhoneNumber,
  getKYCStatus,
  updateKYCLevel,
  performAMLScreening,
  generateVerificationSession
} from '../services/kycService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure file upload for KYC documents
const kycStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    const userId = req.userId || 'unknown';
    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop();
    cb(null, `kyc_${userId}_${timestamp}_${file.fieldname}.${extension}`);
  }
});

const kycUpload = multer({
  storage: kycStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF allowed.'));
    }
  }
});

// =============================================================================
// KYC STATUS AND INITIATION
// =============================================================================

// Get user's KYC status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    const kycStatus = await getKYCStatus(userId);
    
    res.json({
      userId,
      kycLevel: kycStatus.level,
      status: kycStatus.status,
      verifications: {
        email: kycStatus.emailVerified,
        phone: kycStatus.phoneVerified,
        identity: kycStatus.identityVerified,
        address: kycStatus.addressVerified,
        biometric: kycStatus.biometricVerified,
        bankAccount: kycStatus.bankAccountVerified
      },
      documents: kycStatus.documents,
      limitations: kycStatus.limitations,
      nextSteps: kycStatus.nextSteps,
      lastUpdated: kycStatus.lastUpdated
    });
  } catch (error) {
    logger.error('KYC status fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch KYC status' });
  }
});

// Initiate KYC verification process
router.post('/initiate', authenticateToken, async (req, res) => {
  try {
    const { country, verificationType, personalInfo } = req.body;
    const userId = req.userId;
    
    if (!country || !verificationType) {
      return res.status(400).json({ 
        error: 'Country and verification type are required' 
      });
    }
    
    const kycData = {
      userId,
      country: country.toUpperCase(),
      verificationType, // 'basic', 'enhanced', 'premium'
      personalInfo: {
        firstName: personalInfo?.firstName,
        lastName: personalInfo?.lastName,
        dateOfBirth: personalInfo?.dateOfBirth,
        nationality: personalInfo?.nationality,
        address: personalInfo?.address
      }
    };
    
    const result = await initiateKYCVerification(kycData);
    
    if (result.success) {
      logger.info('KYC verification initiated', { 
        userId, 
        country, 
        verificationType, 
        sessionId: result.sessionId 
      });
      
      res.status(201).json({
        success: true,
        sessionId: result.sessionId,
        verificationSteps: result.steps,
        supportedDocuments: result.supportedDocuments,
        estimatedTime: result.estimatedTime,
        message: 'KYC verification process initiated'
      });
    } else {
      res.status(400).json({ 
        error: 'KYC initiation failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('KYC initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate KYC verification' });
  }
});

// =============================================================================
// DOCUMENT VERIFICATION
// =============================================================================

// Upload and verify identity documents
router.post('/documents/verify', 
  authenticateToken, 
  kycUpload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
    { name: 'selfieWithDocument', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const userId = req.userId;
      const { documentType, country, documentNumber, issueDate, expiryDate } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.front || !documentType || !country) {
        return res.status(400).json({ 
          error: 'Document front image, document type, and country are required' 
        });
      }
      
      const verificationData = {
        userId,
        documentType, // 'passport', 'national_id', 'drivers_license'
        country: country.toUpperCase(),
        documentNumber,
        issueDate,
        expiryDate,
        images: {
          front: files.front[0].path,
          back: files.back?.[0]?.path,
          selfie: files.selfie?.[0]?.path,
          selfieWithDocument: files.selfieWithDocument?.[0]?.path
        }
      };
      
      const result = await verifyIdentityDocument(verificationData);
      
      if (result.success) {
        logger.info('Document verification completed', { 
          userId, 
          documentType, 
          verificationId: result.verificationId,
          confidence: result.confidence 
        });
        
        res.json({
          success: true,
          verificationId: result.verificationId,
          status: result.status,
          confidence: result.confidence,
          extractedData: result.extractedData,
          checks: result.checks,
          message: result.status === 'verified' ? 
            'Document verification successful' : 
            'Document verification pending review'
        });
      } else {
        res.status(400).json({ 
          error: 'Document verification failed', 
          details: result.error,
          reasons: result.reasons 
        });
      }
    } catch (error) {
      logger.error('Document verification error:', error);
      res.status(500).json({ error: 'Failed to verify document' });
    }
  }
);

// =============================================================================
// BIOMETRIC VERIFICATION
// =============================================================================

// Perform liveness detection and biometric verification
router.post('/biometric/verify', authenticateToken, kycUpload.single('livePhoto'), async (req, res) => {
  try {
    const userId = req.userId;
    const { referenceImagePath } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Live photo is required' });
    }
    
    const biometricData = {
      userId,
      livePhotoPath: req.file.path,
      referenceImagePath: referenceImagePath || null
    };
    
    const result = await performBiometricVerification(biometricData);
    
    if (result.success) {
      logger.info('Biometric verification completed', { 
        userId, 
        verificationId: result.verificationId,
        livenessScore: result.livenessScore,
        matchScore: result.matchScore 
      });
      
      res.json({
        success: true,
        verificationId: result.verificationId,
        status: result.status,
        livenessDetected: result.livenessDetected,
        livenessScore: result.livenessScore,
        faceMatched: result.faceMatched,
        matchScore: result.matchScore,
        message: result.status === 'verified' ? 
          'Biometric verification successful' : 
          'Biometric verification failed'
      });
    } else {
      res.status(400).json({ 
        error: 'Biometric verification failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Biometric verification error:', error);
    res.status(500).json({ error: 'Failed to perform biometric verification' });
  }
});

// =============================================================================
// COUNTRY-SPECIFIC VERIFICATION
// =============================================================================

// Nigerian BVN verification
router.post('/nigeria/bvn', authenticateToken, async (req, res) => {
  try {
    const { bvn, firstName, lastName, phoneNumber, dateOfBirth } = req.body;
    const userId = req.userId;
    
    if (!bvn || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'BVN, first name, and last name are required' 
      });
    }
    
    // Validate BVN format (11 digits)
    if (!/^\d{11}$/.test(bvn)) {
      return res.status(400).json({ 
        error: 'Invalid BVN format. BVN must be 11 digits.' 
      });
    }
    
    const verificationData = {
      userId,
      bvn,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth
    };
    
    const result = await verifyBVN(verificationData);
    
    if (result.success) {
      logger.info('BVN verification completed', { 
        userId, 
        bvn: bvn.substring(0, 3) + '********', // Log partial BVN for security
        verified: result.verified 
      });
      
      res.json({
        success: true,
        verified: result.verified,
        matchedData: result.matchedData,
        confidence: result.confidence,
        message: result.verified ? 
          'BVN verification successful' : 
          'BVN verification failed - data mismatch'
      });
    } else {
      res.status(400).json({ 
        error: 'BVN verification failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('BVN verification error:', error);
    res.status(500).json({ error: 'Failed to verify BVN' });
  }
});

// Ghanaian Ghana Card verification
router.post('/ghana/ghana-card', authenticateToken, async (req, res) => {
  try {
    const { ghanaCardNumber, firstName, lastName, dateOfBirth } = req.body;
    const userId = req.userId;
    
    if (!ghanaCardNumber || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Ghana Card number, first name, and last name are required' 
      });
    }
    
    // Validate Ghana Card format (GHA-XXXXXXXXX-X)
    if (!/^GHA-\d{9}-\d$/.test(ghanaCardNumber)) {
      return res.status(400).json({ 
        error: 'Invalid Ghana Card format. Format: GHA-XXXXXXXXX-X' 
      });
    }
    
    const verificationData = {
      userId,
      ghanaCardNumber,
      firstName,
      lastName,
      dateOfBirth
    };
    
    const result = await verifyGhanaCard(verificationData);
    
    if (result.success) {
      logger.info('Ghana Card verification completed', { 
        userId, 
        ghanaCardNumber: ghanaCardNumber.substring(0, 7) + '****', 
        verified: result.verified 
      });
      
      res.json({
        success: true,
        verified: result.verified,
        matchedData: result.matchedData,
        confidence: result.confidence,
        message: result.verified ? 
          'Ghana Card verification successful' : 
          'Ghana Card verification failed - data mismatch'
      });
    } else {
      res.status(400).json({ 
        error: 'Ghana Card verification failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Ghana Card verification error:', error);
    res.status(500).json({ error: 'Failed to verify Ghana Card' });
  }
});

// Phone number verification
router.post('/phone/verify', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, method = 'sms' } = req.body;
    const userId = req.userId;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Validate phone number format (international format)
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Use international format (+1234567890)' 
      });
    }
    
    const result = await verifyPhoneNumber(userId, phoneNumber, method);
    
    if (result.success) {
      logger.info('Phone verification initiated', { 
        userId, 
        phoneNumber: phoneNumber.substring(0, 4) + '****', 
        method,
        verificationId: result.verificationId 
      });
      
      res.json({
        success: true,
        verificationId: result.verificationId,
        method: result.method,
        sentTo: phoneNumber.substring(0, 4) + '****' + phoneNumber.slice(-2),
        expiresIn: result.expiresIn,
        message: `Verification code sent via ${method}`
      });
    } else {
      res.status(400).json({ 
        error: 'Phone verification failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Phone verification error:', error);
    res.status(500).json({ error: 'Failed to initiate phone verification' });
  }
});

// Verify phone OTP
router.post('/phone/verify-otp', authenticateToken, async (req, res) => {
  try {
    const { verificationId, otp } = req.body;
    const userId = req.userId;
    
    if (!verificationId || !otp) {
      return res.status(400).json({ 
        error: 'Verification ID and OTP are required' 
      });
    }
    
    const result = await verifyPhoneOTP(userId, verificationId, otp);
    
    if (result.success) {
      logger.info('Phone OTP verified', { 
        userId, 
        verificationId, 
        phoneNumber: result.phoneNumber.substring(0, 4) + '****' 
      });
      
      res.json({
        success: true,
        verified: true,
        phoneNumber: result.phoneNumber,
        verifiedAt: result.verifiedAt,
        message: 'Phone number verified successfully'
      });
    } else {
      res.status(400).json({ 
        error: 'OTP verification failed', 
        details: result.error,
        attemptsRemaining: result.attemptsRemaining 
      });
    }
  } catch (error) {
    logger.error('Phone OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// =============================================================================
// AML SCREENING
// =============================================================================

// Perform AML (Anti-Money Laundering) screening
router.post('/aml/screen', authenticateToken, async (req, res) => {
  try {
    const { fullName, dateOfBirth, nationality, country } = req.body;
    const userId = req.userId;
    
    if (!fullName || !dateOfBirth || !nationality) {
      return res.status(400).json({ 
        error: 'Full name, date of birth, and nationality are required' 
      });
    }
    
    const screeningData = {
      userId,
      fullName,
      dateOfBirth,
      nationality: nationality.toUpperCase(),
      country: country?.toUpperCase(),
      screeningLists: [
        'UN_SANCTIONS',
        'US_OFAC',
        'EU_SANCTIONS',
        'UK_SANCTIONS',
        'INTERPOL',
        'PEP_LIST' // Politically Exposed Persons
      ]
    };
    
    const result = await performAMLScreening(screeningData);
    
    if (result.success) {
      logger.info('AML screening completed', { 
        userId, 
        screeningId: result.screeningId,
        riskScore: result.riskScore,
        matches: result.matches.length 
      });
      
      res.json({
        success: true,
        screeningId: result.screeningId,
        status: result.status,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        matches: result.matches,
        recommendations: result.recommendations,
        screenedLists: result.screenedLists,
        screenedAt: result.screenedAt
      });
    } else {
      res.status(400).json({ 
        error: 'AML screening failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('AML screening error:', error);
    res.status(500).json({ error: 'Failed to perform AML screening' });
  }
});

// =============================================================================
// THIRD-PARTY VERIFICATION SESSIONS
// =============================================================================

// Create Veriff verification session
router.post('/veriff/session', authenticateToken, async (req, res) => {
  try {
    const { documentCountry, language = 'en' } = req.body;
    const userId = req.userId;
    
    if (!documentCountry) {
      return res.status(400).json({ error: 'Document country is required' });
    }
    
    const sessionData = {
      userId,
      provider: 'veriff',
      documentCountry: documentCountry.toUpperCase(),
      language,
      callbackUrl: `${process.env.BACKEND_URL}/api/kyc/veriff/callback`,
      returnUrl: `${process.env.FRONTEND_URL}/kyc/verification-complete`
    };
    
    const result = await generateVerificationSession(sessionData);
    
    if (result.success) {
      logger.info('Veriff session created', { 
        userId, 
        sessionId: result.sessionId,
        provider: 'veriff' 
      });
      
      res.json({
        success: true,
        sessionId: result.sessionId,
        sessionUrl: result.sessionUrl,
        qrCode: result.qrCode,
        expiresAt: result.expiresAt,
        provider: 'veriff',
        message: 'Verification session created successfully'
      });
    } else {
      res.status(400).json({ 
        error: 'Session creation failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Veriff session creation error:', error);
    res.status(500).json({ error: 'Failed to create verification session' });
  }
});

// Create Jumio verification session
router.post('/jumio/session', authenticateToken, async (req, res) => {
  try {
    const { documentType, documentCountry, userReference } = req.body;
    const userId = req.userId;
    
    if (!documentType || !documentCountry) {
      return res.status(400).json({ 
        error: 'Document type and country are required' 
      });
    }
    
    const sessionData = {
      userId,
      provider: 'jumio',
      documentType, // 'ID', 'PASSPORT', 'DRIVING_LICENSE'
      documentCountry: documentCountry.toUpperCase(),
      userReference: userReference || userId,
      callbackUrl: `${process.env.BACKEND_URL}/api/kyc/jumio/callback`,
      successUrl: `${process.env.FRONTEND_URL}/kyc/verification-complete`,
      errorUrl: `${process.env.FRONTEND_URL}/kyc/verification-error`
    };
    
    const result = await generateVerificationSession(sessionData);
    
    if (result.success) {
      logger.info('Jumio session created', { 
        userId, 
        sessionId: result.sessionId,
        provider: 'jumio' 
      });
      
      res.json({
        success: true,
        sessionId: result.sessionId,
        redirectUrl: result.redirectUrl,
        workflowId: result.workflowId,
        expiresAt: result.expiresAt,
        provider: 'jumio',
        message: 'Verification session created successfully'
      });
    } else {
      res.status(400).json({ 
        error: 'Session creation failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Jumio session creation error:', error);
    res.status(500).json({ error: 'Failed to create verification session' });
  }
});

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

// Veriff webhook handler
router.post('/veriff/callback', async (req, res) => {
  try {
    const event = req.body;
    const signature = req.headers['x-veriff-signature'];
    
    // Verify webhook signature
    if (!verifyVeriffSignature(event, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await handleVeriffWebhook(event);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Veriff webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Jumio webhook handler
router.post('/jumio/callback', async (req, res) => {
  try {
    const event = req.body;
    const signature = req.headers['x-jumio-signature'];
    
    // Verify webhook signature
    if (!verifyJumioSignature(event, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await handleJumioWebhook(event);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Jumio webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// =============================================================================
// ADMIN ENDPOINTS
// =============================================================================

// Update user's KYC level (admin only)
router.post('/admin/update-level', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, newLevel, reason, approvedBy } = req.body;
    const adminId = req.userId;
    
    // Check if user has admin permissions
    const hasAdminPermission = await checkAdminPermission(adminId, 'kyc_management');
    if (!hasAdminPermission) {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    
    if (!targetUserId || typeof newLevel !== 'number' || !reason) {
      return res.status(400).json({ 
        error: 'Target user ID, new level, and reason are required' 
      });
    }
    
    const result = await updateKYCLevel(targetUserId, newLevel, {
      reason,
      approvedBy: approvedBy || adminId,
      adminId,
      timestamp: new Date()
    });
    
    if (result.success) {
      logger.info('KYC level updated by admin', { 
        targetUserId, 
        newLevel, 
        adminId, 
        reason 
      });
      
      res.json({
        success: true,
        userId: targetUserId,
        oldLevel: result.oldLevel,
        newLevel: result.newLevel,
        updatedAt: result.updatedAt,
        message: 'KYC level updated successfully'
      });
    } else {
      res.status(400).json({ 
        error: 'KYC level update failed', 
        details: result.error 
      });
    }
  } catch (error) {
    logger.error('Admin KYC level update error:', error);
    res.status(500).json({ error: 'Failed to update KYC level' });
  }
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function verifyVeriffSignature(payload: any, signature: string): boolean {
  // In production, verify actual Veriff webhook signature
  return process.env.NODE_ENV !== 'production' || signature === process.env.VERIFF_WEBHOOK_SECRET;
}

function verifyJumioSignature(payload: any, signature: string): boolean {
  // In production, verify actual Jumio webhook signature
  return process.env.NODE_ENV !== 'production' || signature === process.env.JUMIO_WEBHOOK_SECRET;
}

async function handleVeriffWebhook(event: any) {
  try {
    const { verification } = event;
    
    switch (verification.status) {
      case 'approved':
        await updateVerificationStatus(verification.id, 'verified');
        break;
      case 'declined':
        await updateVerificationStatus(verification.id, 'failed');
        break;
      case 'resubmission_requested':
        await updateVerificationStatus(verification.id, 'resubmission_required');
        break;
      default:
        logger.info('Unhandled Veriff status:', verification.status);
    }
  } catch (error) {
    logger.error('Veriff webhook handling error:', error);
  }
}

async function handleJumioWebhook(event: any) {
  try {
    const { eventType, payload } = event;
    
    switch (eventType) {
      case 'workflow.finished':
        await processJumioWorkflowResult(payload);
        break;
      case 'verification.finished':
        await processJumioVerificationResult(payload);
        break;
      default:
        logger.info('Unhandled Jumio event:', eventType);
    }
  } catch (error) {
    logger.error('Jumio webhook handling error:', error);
  }
}

async function verifyPhoneOTP(userId: string, verificationId: string, otp: string) {
  // Mock OTP verification - replace with actual implementation
  return {
    success: true,
    phoneNumber: '+1234567890',
    verifiedAt: new Date()
  };
}

async function checkAdminPermission(userId: string, permission: string): Promise<boolean> {
  // Mock admin permission check
  return true;
}

async function updateVerificationStatus(verificationId: string, status: string) {
  logger.info('Verification status updated', { verificationId, status });
}

async function processJumioWorkflowResult(payload: any) {
  logger.info('Jumio workflow result processed', { payload });
}

async function processJumioVerificationResult(payload: any) {
  logger.info('Jumio verification result processed', { payload });
}

export default router;
