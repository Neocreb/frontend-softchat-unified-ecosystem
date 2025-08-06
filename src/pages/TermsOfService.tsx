import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Users, ShoppingCart, Briefcase, Coins, Shield, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              Terms of Service
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SoftChat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms of Service ("Terms") govern your use of SoftChat, an AI-powered
              social media and marketplace platform that includes social networking,
              marketplace functionality, freelancing services, cryptocurrency trading,
              delivery services, verified premium subscriptions, and advanced analytics features.
            </p>
            <p>
              By accessing or using SoftChat, you agree to be bound by these Terms.
              If you disagree with any part of these terms, you may not access the Service.
            </p>
          </CardContent>
        </Card>

        {/* Premium Subscription Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              Premium Subscription & Verified Badge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Free vs Premium Plans</h4>
              <p className="text-sm">
                SoftChat offers both free and premium subscription tiers. Free users have access to all
                core features with certain limitations (10 video uploads/month, 5GB storage, 90-day content
                retention). Premium users ($9.99/month or $99.99/year) receive enhanced features including
                verified badges, unlimited uploads, 100GB storage, and priority support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">KYC Verification Requirements</h4>
              <p className="text-sm mb-2">
                To receive a verified badge, Premium users must complete Know Your Customer (KYC) verification:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Upload valid government-issued photo identification (front and back)</li>
                <li>Complete real-time selfie verification with liveness detection</li>
                <li>Verify phone number and email address</li>
                <li>Provide accurate personal information</li>
              </ul>
              <p className="text-sm mt-2">
                KYC verification is mandatory for verified badge activation. False or misleading information
                may result in account suspension or termination.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Billing & Payment</h4>
              <p className="text-sm">
                Premium subscriptions are billed through your unified wallet. Sufficient funds must be
                available at renewal time. Failed payments result in a 5-day grace period before
                downgrade to free tier. Users receive notifications 3 days before subscription expiration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Content Retention & Storage</h4>
              <p className="text-sm">
                Free users: Content is automatically deleted after 90 days. Premium users: No automatic
                deletion. Storage limits apply (5GB free, 100GB premium). Users approaching storage
                limits will receive upgrade prompts.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Verified Badge Usage</h4>
              <p className="text-sm">
                The verified badge indicates identity verification and premium status. Misrepresenting
                verification status or impersonating verified users is prohibited. The badge appears
                across all platform features including profiles, posts, marketplace listings, and chat.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Account Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Creation</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>You must be at least 13 years old to use SoftChat</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>One person may not maintain multiple accounts</li>
                <li>You must verify your email address to activate your account</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Account Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Keep your login credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>You are liable for all activities under your account</li>
                <li>Update your information to keep it current and accurate</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Account Termination</h4>
              <p className="text-sm">
                We reserve the right to suspend or terminate accounts that violate these Terms, 
                engage in fraudulent activities, or pose security risks to our platform or users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Services */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Social Networking
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Share posts, photos, videos, and stories</li>
                <li>Connect with friends and join communities</li>
                <li>Participate in real-time messaging and video calls</li>
                <li>Receive AI-powered content recommendations</li>
                <li>Access live streaming and interactive features</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Marketplace
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Buy and sell products and services</li>
                <li>Secure payment processing through Stripe</li>
                <li>Seller verification and rating systems</li>
                <li>Dispute resolution and customer protection</li>
                <li>Integrated shipping and logistics support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Freelancing Services
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Post and apply for freelance opportunities</li>
                <li>Secure escrow system for project payments</li>
                <li>Project management and collaboration tools</li>
                <li>Skills verification and portfolio showcasing</li>
                <li>Client-freelancer communication platform</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Cryptocurrency Features
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Cryptocurrency trading and portfolio management</li>
                <li>P2P cryptocurrency exchange</li>
                <li>Secure wallet integration and management</li>
                <li>Real-time market data and analytics</li>
                <li>DeFi integrations and yield farming</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Conduct */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              User Conduct
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Acceptable Use</h4>
              <p className="text-sm mb-2">You agree to use SoftChat responsibly and in compliance with:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All applicable local, state, national, and international laws</li>
                <li>These Terms of Service and our Community Guidelines</li>
                <li>Intellectual property rights of others</li>
                <li>Platform security measures and anti-fraud policies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Prohibited Activities</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Harassment, bullying, or threatening other users</li>
                <li>Posting illegal, harmful, or inappropriate content</li>
                <li>Spam, phishing, or fraudulent activities</li>
                <li>Unauthorized access to other users' accounts</li>
                <li>Manipulation of platform features or algorithms</li>
                <li>Distribution of malware or harmful code</li>
                <li>Money laundering or terrorist financing</li>
                <li>Market manipulation in cryptocurrency trading</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Financial Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Payment Processing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All payments are processed securely through Stripe</li>
                <li>Transaction fees may apply to marketplace and freelance services</li>
                <li>Cryptocurrency transactions are subject to network fees</li>
                <li>Refunds are processed according to our Refund Policy</li>
                <li>Currency conversion rates are updated in real-time</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Escrow Services</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Freelance payments are held in secure escrow until completion</li>
                <li>Escrow release requires mutual agreement or dispute resolution</li>
                <li>Disputes are handled through our mediation process</li>
                <li>Emergency releases may be processed in exceptional circumstances</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">KYC and Compliance</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Enhanced features require identity verification (KYC)</li>
                <li>We comply with anti-money laundering (AML) regulations</li>
                <li>Large transactions may require additional verification</li>
                <li>We report suspicious activities to relevant authorities</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">User Content</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>You retain ownership of content you create and share</li>
                <li>You grant us license to display, distribute, and promote your content</li>
                <li>You are responsible for ensuring you have rights to content you share</li>
                <li>We may remove content that violates intellectual property rights</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Platform Rights</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>SoftChat and related marks are our intellectual property</li>
                <li>Our AI algorithms and recommendation systems are proprietary</li>
                <li>Platform software and infrastructure are protected by copyright</li>
                <li>Users may not reverse engineer or copy our technology</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Your privacy is important to us. Our collection, use, and protection of your 
              personal information is governed by our Privacy Policy, which is incorporated 
              into these Terms by reference.
            </p>
            <div>
              <h4 className="font-semibold mb-2">Data Usage</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We use your data to provide and improve our services</li>
                <li>AI systems analyze usage patterns to enhance recommendations</li>
                <li>We implement strong security measures to protect your information</li>
                <li>You can control your privacy settings and data sharing preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers and Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Service Availability</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Services are provided "as is" without warranties</li>
                <li>We may experience downtime for maintenance or technical issues</li>
                <li>Cryptocurrency markets operate 24/7 but platform access may vary</li>
                <li>AI recommendations are algorithmic and may not always be accurate</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Investment Risks</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Cryptocurrency trading involves significant financial risk</li>
                <li>Market prices can be highly volatile and unpredictable</li>
                <li>Past performance does not guarantee future results</li>
                <li>You should only invest what you can afford to lose</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Limitation of Liability</h4>
              <p className="text-sm">
                To the fullest extent permitted by law, SoftChat shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including 
                but not limited to loss of profits, data, or business opportunities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Internal Resolution</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We encourage users to resolve disputes through direct communication</li>
                <li>Our support team can assist with mediation when needed</li>
                <li>Marketplace disputes have dedicated resolution processes</li>
                <li>Escalated cases are reviewed by our dispute resolution team</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Legal Proceedings</h4>
              <p className="text-sm">
                Any disputes that cannot be resolved through our internal processes will be 
                subject to binding arbitration in accordance with applicable laws and regulations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card>
          <CardHeader>
            <CardTitle>Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We reserve the right to modify these Terms at any time. We will notify users of 
              material changes via email or platform notifications. Continued use of SoftChat 
              after modifications constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              These Terms are governed by and construed in accordance with applicable laws. 
              Any legal action or proceeding arising under these Terms will be brought 
              exclusively in the appropriate courts.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> legal@softchat.com</p>
              <p><strong>Address:</strong> SoftChat Legal Department</p>
              <p><strong>Response Time:</strong> We aim to respond within 5 business days</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/app/privacy")}>
              Privacy Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/cookies")}>
              Cookie Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/advertising")}>
              Advertising Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/feed")}>
              Back to Feed
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
