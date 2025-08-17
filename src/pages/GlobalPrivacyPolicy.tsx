import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail, UserCheck, Zap, AlertTriangle } from "lucide-react";

const GlobalPrivacyPolicy = () => {
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
              <Shield className="w-8 h-8 text-primary" />
              Global Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              GDPR, NDPR, CCPA, PIPEDA, LGPD & Multi-Regional Compliance
            </p>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Our Global Privacy Commitment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At SoftChat, we are committed to protecting your privacy and ensuring the security 
              of your personal information across all regions where we operate. This Global Privacy 
              Policy explains how we collect, use, disclose, and safeguard your information when you 
              use our comprehensive AI-powered social media, financial services, real-time trading, 
              and marketplace platform.
            </p>
            <p>
              We operate globally while respecting local privacy laws and regulations. This policy 
              describes our practices in compliance with major privacy frameworks including GDPR 
              (Europe), NDPR (Nigeria), CCPA (California), PIPEDA (Canada), LGPD (Brazil), and 
              other applicable regional privacy laws.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Our Privacy Principles:</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li><strong>Transparency:</strong> Clear information about data practices</li>
                <li><strong>Choice:</strong> Meaningful control over your personal information</li>
                <li><strong>Security:</strong> Industry-leading protection measures</li>
                <li><strong>Accountability:</strong> Regular audits and compliance monitoring</li>
                <li><strong>Minimization:</strong> Collect only necessary data for services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Regional Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Multi-Regional Privacy Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Regional Privacy Law Compliance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Europe (GDPR)</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Lawful basis for all data processing</li>
                    <li>Data Protection Officer appointed</li>
                    <li>Right to be forgotten implementation</li>
                    <li>Data portability and access rights</li>
                    <li>Cookie consent management</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Africa (NDPR, POPIA, DPA)</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Nigeria Data Protection Regulation compliance</li>
                    <li>South Africa POPIA compliance</li>
                    <li>Kenya Data Protection Act compliance</li>
                    <li>Local data processing requirements</li>
                    <li>Cross-border transfer safeguards</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">North America (CCPA, PIPEDA)</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>California Consumer Privacy Act rights</li>
                    <li>Canada PIPEDA compliance</li>
                    <li>Right to know and delete data</li>
                    <li>Opt-out of data sales</li>
                    <li>Non-discrimination protections</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Latin America (LGPD)</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Brazil LGPD compliance</li>
                    <li>Data subject rights implementation</li>
                    <li>Local data processing requirements</li>
                    <li>Privacy impact assessments</li>
                    <li>Data breach notification procedures</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Your Rights by Region</h4>
              <p className="text-sm mb-2">
                Your privacy rights may vary based on your location and applicable laws. 
                All users enjoy baseline protections, with additional rights in regions 
                with stronger privacy laws:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Universal Rights:</strong> Access, correction, deletion, and data portability</li>
                <li><strong>GDPR Users:</strong> Right to object, restriction of processing, DPO contact</li>
                <li><strong>CCPA Users:</strong> Right to know, delete, opt-out, and non-discrimination</li>
                <li><strong>LGPD Users:</strong> Right to information, access, correction, and opposition</li>
                <li><strong>NDPR Users:</strong> Right to access, rectification, and objection to processing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Information We Collect Globally
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Name, email address, and contact information</li>
                <li>Profile information including bio, interests, and preferences</li>
                <li>Authentication credentials (securely hashed)</li>
                <li>Payment and financial information for global transactions</li>
                <li>Regional payment method details (mobile money, bank accounts, etc.)</li>
                <li>Multi-currency wallet addresses and transaction history</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Global KYC Verification Data</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Identity Documents:</strong> Passport, driver's license, national ID, regional IDs</li>
                <li><strong>African Verification:</strong> BVN (Nigeria), Ghana Card, National ID (Kenya)</li>
                <li><strong>Biometric Data:</strong> Facial recognition and liveness detection</li>
                <li><strong>Address Verification:</strong> Utility bills, bank statements</li>
                <li><strong>Enhanced Verification:</strong> Professional licenses, business registration</li>
                <li><strong>Compliance Records:</strong> AML screening results, sanctions checking</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-lg mt-2">
                <p className="text-sm text-yellow-800">
                  <strong>Regional Processing:</strong> KYC data is processed by certified providers 
                  in your region (Smile Identity for Africa, Jumio for global, Onfido for EU, etc.) 
                  and encrypted using military-grade security. Data retention periods vary by 
                  local legal requirements (typically 5-7 years).
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Real-Time Activity Data</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Watch2Earn Analytics:</strong> Video viewing time, ad completion rates</li>
                <li><strong>Trading Data:</strong> Real-time market activity, order history, P2P trades</li>
                <li><strong>WebSocket Activity:</strong> Connection logs, message delivery timestamps</li>
                <li><strong>Live Chat Data:</strong> Message content, typing indicators, presence status</li>
                <li><strong>Real-Time Notifications:</strong> Delivery confirmations, interaction tracking</li>
                <li><strong>Performance Metrics:</strong> App usage patterns, feature engagement</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Financial & Transaction Data</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Multi-regional payment processing data (Stripe, Flutterwave, Razorpay, etc.)</li>
                <li>Cross-border transaction records and compliance documentation</li>
                <li>Cryptocurrency wallet addresses and blockchain transaction data</li>
                <li>Mobile money account details and transaction history</li>
                <li>Tax reporting information and jurisdictional compliance data</li>
                <li>Fraud prevention and risk assessment data</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Communication & Location Data</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>SMS delivery records and two-factor authentication logs</li>
                <li>Voice call metadata and communication preferences</li>
                <li>Geographic location data for regional service optimization</li>
                <li>Language preferences and regional content customization</li>
                <li>Time zone and cultural preference settings</li>
                <li>Regional compliance and regulatory adaptation data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Platform Services & Real-Time Features</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Provide real-time social networking and communication features</li>
                <li>Process multi-regional payments and financial transactions</li>
                <li>Enable Watch2Earn video monetization with ad integration</li>
                <li>Facilitate real-time cryptocurrency trading and P2P exchanges</li>
                <li>Deliver live notifications and WebSocket-based updates</li>
                <li>Maintain global marketplace and freelancing services</li>
                <li>Provide region-specific payment methods and currencies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Compliance & Security</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Conduct multi-regional KYC verification and identity validation</li>
                <li>Comply with AML/CTF regulations across all operating jurisdictions</li>
                <li>Monitor for fraudulent activities and suspicious transactions</li>
                <li>Implement sanctions screening and regulatory compliance</li>
                <li>Generate tax reporting documentation as required by law</li>
                <li>Maintain audit trails for regulatory inquiries</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Personalization & Analytics</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Deliver AI-powered content recommendations and personalization</li>
                <li>Provide real-time trading insights and market analytics</li>
                <li>Optimize regional service delivery and performance</li>
                <li>Customize language and cultural preferences</li>
                <li>Generate creator economy insights and earning analytics</li>
                <li>Improve platform security and fraud detection systems</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing and International Transfers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Data Sharing & International Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <div>
              <h4 className="font-semibold mb-2">Service Providers by Region</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Global:</strong> AWS, Google Cloud for secure infrastructure and CDN</li>
                <li><strong>North America:</strong> Stripe, Twilio, Plaid for payments and communication</li>
                <li><strong>Europe:</strong> Adyen, Vonage for GDPR-compliant processing</li>
                <li><strong>Africa:</strong> Flutterwave, Africa's Talking, Smile Identity for regional services</li>
                <li><strong>Asia-Pacific:</strong> Razorpay, MSG91 for local payment and communication</li>
                <li><strong>Latin America:</strong> MercadoPago, Zenvia for regional processing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">International Transfer Safeguards</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Standard Contractual Clauses (SCCs):</strong> EU Commission approved clauses</li>
                <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection</li>
                <li><strong>Regional Data Residency:</strong> Sensitive data processed in local regions</li>
                <li><strong>Additional Safeguards:</strong> Technical and organizational measures</li>
                <li><strong>Binding Corporate Rules:</strong> Internal data protection standards</li>
                <li><strong>Cross-Border Agreements:</strong> Bilateral data sharing agreements</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Legal & Regulatory Sharing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Compliance with applicable laws and court orders</li>
                <li>Regulatory reporting requirements (AML, tax authorities)</li>
                <li>Law enforcement cooperation in criminal investigations</li>
                <li>Sanctions compliance and government screening</li>
                <li>Financial crime prevention and investigation</li>
                <li>Cross-border regulatory coordination</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Global Data Security Measures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Technical Security Controls</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Encryption & Protection</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>AES-256 encryption for data at rest</li>
                    <li>TLS 1.3 for data in transit</li>
                    <li>End-to-end encryption for sensitive communications</li>
                    <li>Hardware Security Modules (HSM) for key management</li>
                    <li>Zero-knowledge architecture for sensitive data</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Access & Authentication</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Multi-factor authentication (MFA) required</li>
                    <li>Role-based access controls (RBAC)</li>
                    <li>Just-in-time access provisioning</li>
                    <li>Biometric authentication options</li>
                    <li>Session management and timeout controls</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Operational Security Measures</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Security Operations Center (SOC):</strong> 24/7 monitoring and incident response</li>
                <li><strong>Penetration Testing:</strong> Regular security assessments by third parties</li>
                <li><strong>Vulnerability Management:</strong> Continuous scanning and patching</li>
                <li><strong>Data Loss Prevention (DLP):</strong> Automated protection against data leaks</li>
                <li><strong>Backup & Recovery:</strong> Multi-region backup with disaster recovery</li>
                <li><strong>Compliance Audits:</strong> Regular SOC 2, ISO 27001, and regional audits</li>
              </div>

            <div>
              <h4 className="font-semibold mb-2">Regional Security Compliance</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>EU: GDPR technical and organizational measures</li>
                <li>US: SOC 2 Type II and FedRAMP compliance readiness</li>
                <li>Africa: Local data protection and cybersecurity regulations</li>
                <li>Asia-Pacific: Regional cybersecurity and privacy frameworks</li>
                <li>Latin America: Local data protection and security standards</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Your Global Privacy Rights & Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Universal Data Rights</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
                <li><strong>Right to Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Right to Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to certain types of data processing</li>
                <li><strong>Right to Restrict:</strong> Limit how we process your information</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regional-Specific Rights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">GDPR Rights (EU/UK)</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Right to be forgotten</li>
                    <li>Right to data portability</li>
                    <li>Right to object to automated decision-making</li>
                    <li>Right to lodge a complaint with supervisory authority</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">CCPA Rights (California)</h5>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Right to know what personal information is collected</li>
                    <li>Right to delete personal information</li>
                    <li>Right to opt-out of the sale of personal information</li>
                    <li>Right to non-discrimination</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How to Exercise Your Rights</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Privacy Portal:</strong> Self-service privacy controls in your account settings</li>
                <li><strong>Email Requests:</strong> Contact privacy@softchat.com for specific requests</li>
                <li><strong>Regional Contacts:</strong> Dedicated privacy teams for each region</li>
                <li><strong>Identity Verification:</strong> Secure verification process to protect your data</li>
                <li><strong>Response Timeline:</strong> 30 days maximum response time (faster in most regions)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Global Data Retention Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Retention Periods by Data Type</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Profile Data:</strong> Until account deletion or as required by law</li>
                <li><strong>KYC Documents:</strong> 5-7 years post-verification (varies by jurisdiction)</li>
                <li><strong>Financial Records:</strong> 7 years for tax and regulatory compliance</li>
                <li><strong>Communication Data:</strong> 90 days to 2 years based on type and region</li>
                <li><strong>Real-Time Activity:</strong> 30-365 days for analytics and fraud prevention</li>
                <li><strong>Legal Hold Data:</strong> Until resolution of legal matters</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Automatic Data Deletion</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Inactive accounts: 3 years without login (with notice)</li>
                <li>Session data: 30 days after session expiry</li>
                <li>Analytics data: Anonymized after 2 years</li>
                <li>Marketing data: Deleted upon unsubscribe</li>
                <li>Backup data: Follows same retention as primary data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">
              SoftChat is not intended for children under 13 years of age (16 in EU). We do not 
              knowingly collect personal information from children below the minimum age. Age 
              verification is required during registration, and enhanced verification is needed 
              for financial services.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Age verification required during account creation</li>
              <li>Enhanced verification for users 13-18 accessing financial features</li>
              <li>Parental consent mechanisms where required by law</li>
              <li>Immediate deletion if underage user discovered</li>
              <li>Special protections for teen users in applicable jurisdictions</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Global Privacy Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Global Privacy Office</h4>
                <p><strong>Email:</strong> privacy@softchat.com</p>
                <p><strong>Response Time:</strong> 30 days maximum</p>
                <p><strong>Languages:</strong> 15+ languages supported</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">EU Data Protection Officer</h4>
                <p><strong>Email:</strong> dpo-eu@softchat.com</p>
                <p><strong>Response Time:</strong> 72 hours for urgent matters</p>
                <p><strong>Supervisory Authority:</strong> Available upon request</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Regional Privacy Teams</h4>
                <p><strong>Africa:</strong> privacy-africa@softchat.com</p>
                <p><strong>Americas:</strong> privacy-americas@softchat.com</p>
                <p><strong>Asia-Pacific:</strong> privacy-apac@softchat.com</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Emergency Privacy Contact</h4>
                <p><strong>Data Breaches:</strong> security@softchat.com</p>
                <p><strong>Urgent Matters:</strong> 24/7 response for verified users</p>
                <p><strong>Legal Inquiries:</strong> legal@softchat.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates & Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates & Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We may update this Privacy Policy to reflect changes in our practices, technology, 
              legal requirements, or other factors. Material changes will be communicated through:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Email notification to registered users</li>
              <li>In-app notifications and banners</li>
              <li>Regional compliance notifications where required</li>
              <li>30-day advance notice for material changes</li>
              <li>Consent re-collection where legally required</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/global-terms")}>
              Global Terms of Service
            </Button>
            <Button variant="outline" onClick={() => navigate("/cookies")}>
              Cookie Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/data-processing")}>
              Data Processing Details
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

export default GlobalPrivacyPolicy;