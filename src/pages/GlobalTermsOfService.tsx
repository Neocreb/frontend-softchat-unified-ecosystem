import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Users, ShoppingCart, Briefcase, Coins, Shield, AlertTriangle, Globe, Zap } from "lucide-react";

const GlobalTermsOfService = () => {
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
              Global Terms of Service
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Effective globally across all supported regions and countries
            </p>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Welcome to SoftChat Global
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Global Terms of Service ("Terms") govern your use of SoftChat, a comprehensive 
              AI-powered social media and financial services platform operating across multiple 
              countries and regions worldwide. SoftChat provides social networking, marketplace 
              functionality, freelancing services, cryptocurrency trading, real-time financial 
              services, Watch2Earn video monetization, multi-regional payment processing, global 
              KYC verification, and advanced analytics features.
            </p>
            <p>
              By accessing or using SoftChat, you agree to be bound by these Terms and all 
              applicable local laws and regulations in your jurisdiction. If you disagree with 
              any part of these terms, you may not access the Service.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Global Operations Notice:</h4>
              <p className="text-sm text-blue-800">
                SoftChat operates across multiple jurisdictions including but not limited to: 
                North America (US, Canada), Europe (UK, EU countries), Africa (Nigeria, Kenya, 
                Ghana, South Africa), Asia-Pacific (India, Australia, Singapore), and Latin 
                America (Brazil, Mexico, Argentina). Specific regional terms may apply based 
                on your location and applicable laws.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Regional Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Multi-Regional Compliance & Jurisdiction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Regional Data Protection Laws</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Europe:</strong> GDPR compliance for EU/UK users with lawful basis for processing</li>
                <li><strong>Africa:</strong> NDPR (Nigeria), POPIA (South Africa), DPA 2019 (Kenya) compliance</li>
                <li><strong>North America:</strong> CCPA (California), PIPEDA (Canada) compliance</li>
                <li><strong>Asia-Pacific:</strong> PDPA compliance (Singapore), Privacy Act (Australia)</li>
                <li><strong>Latin America:</strong> LGPD (Brazil), local privacy laws compliance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Financial Regulations Compliance</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>AML/KYC:</strong> Compliant with FATF guidelines and local AML regulations</li>
                <li><strong>Payment Services:</strong> Licensed/registered with relevant financial authorities</li>
                <li><strong>Cryptocurrency:</strong> Compliant with local crypto regulations where applicable</li>
                <li><strong>Cross-border Transfers:</strong> Compliant with international money transfer laws</li>
                <li><strong>Tax Reporting:</strong> Supports local tax reporting requirements</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regional Service Availability</h4>
              <p className="text-sm">
                Service availability and features may vary by region based on local laws, 
                regulations, and licensing requirements. Some features may be restricted 
                or unavailable in certain jurisdictions. Users will be notified of any 
                regional restrictions applicable to their location.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Features Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Real-Time Features & Live Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Watch2Earn Video Platform</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time video viewing with integrated advertisement system</li>
                <li>Automated reward distribution based on watch time and ad completion</li>
                <li>Facebook-style inline ads inserted during video consumption</li>
                <li>Reward calculations are automated and processed in real-time</li>
                <li>Minimum watch time requirements apply for reward eligibility</li>
                <li>Ad blocking or circumvention violates Terms and may result in account suspension</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Real-Time Trading & P2P Exchange</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Live cryptocurrency price feeds and order book updates</li>
                <li>Real-time P2P trading with automated escrow management</li>
                <li>WebSocket-based price updates with sub-second latency</li>
                <li>Automated order matching and execution systems</li>
                <li>Real-time risk management and fraud detection</li>
                <li>Emergency trading halts may occur during high volatility or technical issues</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Live Chat & Communication</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time messaging with end-to-end encryption</li>
                <li>WebSocket-based instant message delivery</li>
                <li>Live typing indicators and read receipts</li>
                <li>Real-time user presence and status updates</li>
                <li>Automatic message backup and synchronization</li>
                <li>Message retention policies vary by subscription tier</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Real-Time Notifications & Alerts</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Instant push notifications for important events</li>
                <li>Real-time wallet balance and transaction updates</li>
                <li>Live market alerts and price movement notifications</li>
                <li>Instant order status updates and confirmations</li>
                <li>Real-time creator economy analytics and milestone alerts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Global Payment Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Global Payment Services & Financial Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Multi-Regional Payment Processing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>North America:</strong> Stripe, PayPal, ACH transfers, credit/debit cards</li>
                <li><strong>Europe:</strong> Adyen, SEPA transfers, iDEAL, Sofort, Bancontact</li>
                <li><strong>Africa:</strong> Flutterwave, Paystack, MTN MoMo, Airtel Money, bank transfers</li>
                <li><strong>Asia-Pacific:</strong> Razorpay (India), Alipay, WeChat Pay, local bank transfers</li>
                <li><strong>Latin America:</strong> MercadoPago, PIX (Brazil), OXXO (Mexico), PagSeguro</li>
                <li>Currency conversion handled at competitive exchange rates</li>
                <li>Regional payment fees apply based on local provider rates</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Global KYC & Identity Verification</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Smile Identity:</strong> African identity verification (BVN, NIN, Ghana Card)</li>
                <li><strong>Jumio:</strong> Global document verification with liveness detection</li>
                <li><strong>Onfido:</strong> EU/UK compliant identity verification</li>
                <li><strong>Youverify:</strong> Nigerian BVN and regional African verification</li>
                <li><strong>Truora:</strong> Latin American identity verification (CPF, RFC, Cedula)</li>
                <li>Verification requirements vary by region and service tier</li>
                <li>Enhanced verification unlocks higher transaction limits and premium features</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Cross-Border Transaction Terms</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>International transfers subject to local money transmission laws</li>
                <li>Exchange rate fluctuations may affect transaction values</li>
                <li>Additional fees may apply for cross-border transactions</li>
                <li>Transaction limits vary by country and verification level</li>
                <li>Some countries may restrict or prohibit certain transaction types</li>
                <li>We comply with sanctions lists and international trade restrictions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Cryptocurrency & Digital Assets</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Cryptocurrency services available where legally permitted</li>
                <li>P2P trading with automated escrow and dispute resolution</li>
                <li>Real-time price feeds from multiple global exchanges</li>
                <li>Wallet services with institutional-grade security</li>
                <li>Tax reporting assistance for cryptocurrency transactions</li>
                <li>Service restrictions may apply in certain jurisdictions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Global Communication Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Global Communication & SMS Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Regional SMS & Communication Providers</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Africa:</strong> Africa's Talking, Termii for SMS, voice, and USSD</li>
                <li><strong>North America:</strong> Twilio for SMS, voice, and WhatsApp Business</li>
                <li><strong>Europe:</strong> Vonage for GDPR-compliant messaging services</li>
                <li><strong>Asia-Pacific:</strong> MSG91 (India) and regional SMS providers</li>
                <li><strong>Latin America:</strong> Zenvia for multi-channel communication</li>
                <li>Two-factor authentication (2FA) via SMS, voice, or app-based methods</li>
                <li>Multi-language support for local languages in each region</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Communication Features</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time messaging with WebSocket technology</li>
                <li>Voice and video calling with global connectivity</li>
                <li>Multi-channel notifications (SMS, email, push, WhatsApp)</li>
                <li>Language localization for 15+ major languages</li>
                <li>Offline message delivery and synchronization</li>
                <li>Emergency communication features for critical alerts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Premium Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              Global Premium Features & Subscription Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Premium Subscription Benefits</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Global Verified Badge:</strong> Identity verification across all regions</li>
                <li><strong>Enhanced Trading Limits:</strong> Higher daily/monthly transaction limits</li>
                <li><strong>Priority Customer Support:</strong> 24/7 multilingual support team</li>
                <li><strong>Advanced Analytics:</strong> Real-time performance dashboards</li>
                <li><strong>API Access:</strong> Developer tools for advanced integrations</li>
                <li><strong>Reduced Fees:</strong> Lower transaction fees across all services</li>
                <li><strong>Early Access:</strong> Beta features and new service rollouts</li>
                <li><strong>Multi-Currency Wallet:</strong> Support for 30+ global currencies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regional Pricing & Billing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Subscription pricing adjusted for local purchasing power</li>
                <li>Multiple payment methods available per region</li>
                <li>Local currency billing where supported</li>
                <li>Regional tax compliance (VAT, GST, sales tax)</li>
                <li>Flexible billing cycles (monthly, quarterly, annual)</li>
                <li>Student and academic discounts available in supported regions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Global KYC Verification Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Premium users must complete identity verification within 30 days</li>
                <li>Verification requirements vary by country and local regulations</li>
                <li>Enhanced verification unlocks additional features and limits</li>
                <li>Periodic re-verification may be required for compliance</li>
                <li>Failure to maintain verification may result in service restrictions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Risk Disclosures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risk Disclosures & Investment Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Cryptocurrency & Trading Risks</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>High Volatility:</strong> Cryptocurrency prices can fluctuate dramatically</li>
                <li><strong>Total Loss Risk:</strong> You may lose your entire investment</li>
                <li><strong>Regulatory Risk:</strong> Changing regulations may affect service availability</li>
                <li><strong>Technology Risk:</strong> Blockchain networks may experience disruptions</li>
                <li><strong>Liquidity Risk:</strong> Some assets may be difficult to trade</li>
                <li><strong>Market Risk:</strong> Global events can impact cryptocurrency markets</li>
                <li>Past performance does not indicate future results</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Platform & Technology Risks</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time services may experience latency or downtime</li>
                <li>WebSocket connections may be interrupted by network issues</li>
                <li>Automated systems may malfunction or produce errors</li>
                <li>Third-party payment providers may experience outages</li>
                <li>Cross-border transactions subject to processing delays</li>
                <li>Exchange rate fluctuations may affect transaction values</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regional & Regulatory Risks</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Services may be restricted or suspended in certain jurisdictions</li>
                <li>Changes in local laws may affect service availability</li>
                <li>Government sanctions may impact cross-border transactions</li>
                <li>Banking partnerships may change, affecting payment methods</li>
                <li>Tax obligations vary by jurisdiction and user responsibility</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution & Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Global Dispute Resolution & Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Multi-Jurisdictional Dispute Resolution</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Disputes resolved under the laws of user's primary residence</li>
                <li>International commercial arbitration for cross-border disputes</li>
                <li>Local consumer protection laws apply where stronger than these Terms</li>
                <li>EU users may use Online Dispute Resolution (ODR) platform</li>
                <li>Escalation process includes mediation before arbitration</li>
                <li>Class action waivers may not apply where prohibited by law</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regional Legal Contacts</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>North America:</strong> legal-na@softchat.com</li>
                <li><strong>Europe:</strong> legal-eu@softchat.com (GDPR Data Protection Officer)</li>
                <li><strong>Africa:</strong> legal-africa@softchat.com</li>
                <li><strong>Asia-Pacific:</strong> legal-apac@softchat.com</li>
                <li><strong>Latin America:</strong> legal-latam@softchat.com</li>
                <li>Local language support available for legal inquiries</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Global Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Global Headquarters</h4>
                <p><strong>Email:</strong> legal@softchat.com</p>
                <p><strong>Response Time:</strong> 5 business days</p>
                <p><strong>Emergency Support:</strong> Available 24/7 for verified users</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Regional Support</h4>
                <p><strong>Multi-language Support:</strong> 15+ languages</p>
                <p><strong>Time Zones:</strong> 24/7 coverage across all regions</p>
                <p><strong>Escalation:</strong> Regional legal teams available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/privacy")}>
              Global Privacy Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/global-compliance")}>
              Regional Compliance
            </Button>
            <Button variant="outline" onClick={() => navigate("/risk-disclosure")}>
              Investment Risks
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalTermsOfService;
