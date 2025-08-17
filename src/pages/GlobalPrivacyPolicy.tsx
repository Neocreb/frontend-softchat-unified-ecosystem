import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Globe, Shield, Database, Users, MapPin, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function GlobalPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Global Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive privacy protection across all jurisdictions where SoftChat operates, 
            ensuring compliance with GDPR, NDPR, CCPA, LGPD, and other regional privacy laws.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-blue-50">Last Updated: {new Date().toLocaleDateString()}</Badge>
            <Badge variant="outline" className="bg-green-50">Global Compliance</Badge>
            <Badge variant="outline" className="bg-purple-50">Real-time Platform</Badge>
          </div>
        </div>

        <ScrollArea className="h-[80vh]">
          <div className="space-y-6">
            {/* Introduction and Scope */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  1. Introduction and Global Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  SoftChat ("we," "our," or "us") operates a global unified social media, creator economy, 
                  and financial services platform. This Privacy Policy applies to all users worldwide and 
                  complies with applicable privacy laws in each jurisdiction where we operate.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Regional Compliance Coverage:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>• GDPR (EU/EEA)</div>
                    <div>• NDPR (Nigeria)</div>
                    <div>• CCPA/CPRA (California)</div>
                    <div>• LGPD (Brazil)</div>
                    <div>• POPIA (South Africa)</div>
                    <div>• PDPA (Singapore)</div>
                    <div>• Privacy Act (Australia)</div>
                    <div>• PIPEDA (Canada)</div>
                  </div>
                </div>

                <p>
                  <strong>Platform Services Covered:</strong> Social media features, creator economy tools, 
                  real-time communication, cryptocurrency trading, freelance marketplace, video streaming, 
                  AI assistance, content creation, and financial services.
                </p>
              </CardContent>
            </Card>

            {/* Data We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  2. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Account and Profile Information</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Name, username, email address, phone number</li>
                      <li>• Profile photo, bio, location (if provided)</li>
                      <li>• Age/date of birth (for age verification)</li>
                      <li>• Creator verification status and credentials</li>
                      <li>• Professional profile information (freelancers)</li>
                    </ul>

                    <h4 className="font-semibold">Content and Communication</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Posts, videos, photos, stories, comments</li>
                      <li>• Direct messages and group communications</li>
                      <li>• Live stream content and recordings</li>
                      <li>• AI-generated content and interactions</li>
                      <li>• User-generated memes, GIFs, and stickers</li>
                    </ul>

                    <h4 className="font-semibold">Financial and Transaction Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Wallet addresses and cryptocurrency holdings</li>
                      <li>• Transaction history and payment methods</li>
                      <li>• Bank account details (encrypted)</li>
                      <li>• KYC/AML verification documents</li>
                      <li>• Earnings from creator economy activities</li>
                      <li>• Freelance payment and escrow data</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Technical and Usage Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Device information and identifiers</li>
                      <li>• IP address and location data</li>
                      <li>• Browser type and operating system</li>
                      <li>• App usage patterns and feature interactions</li>
                      <li>• Real-time activity and session data</li>
                      <li>• Performance and crash analytics</li>
                    </ul>

                    <h4 className="font-semibold">Social and Behavioral Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Connections, followers, and social graph</li>
                      <li>• Content preferences and recommendations</li>
                      <li>• Engagement patterns and interaction history</li>
                      <li>• Watch time and content consumption data</li>
                      <li>• Search queries and discovery activity</li>
                    </ul>

                    <h4 className="font-semibold">Third-Party and Integrated Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Social media account connections</li>
                      <li>• External wallet and DeFi platform data</li>
                      <li>• Partner platform integrations</li>
                      <li>• Advertising and analytics partner data</li>
                      <li>• Regional payment provider information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  3. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Platform Operation and Features</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Providing core social media functionality</li>
                      <li>• Real-time communication and messaging</li>
                      <li>• Content recommendation and discovery</li>
                      <li>• Creator economy tools and monetization</li>
                      <li>• Video streaming and live broadcasting</li>
                      <li>• AI assistant and personalization features</li>
                    </ul>

                    <h4 className="font-semibold">Financial Services</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Cryptocurrency trading and wallet services</li>
                      <li>• Cross-border payment processing</li>
                      <li>• Freelance escrow and payment facilitation</li>
                      <li>• KYC/AML compliance and verification</li>
                      <li>• Fraud prevention and security monitoring</li>
                      <li>• Regional payment method integration</li>
                    </ul>

                    <h4 className="font-semibold">Safety and Security</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Account security and authentication</li>
                      <li>• Content moderation and policy enforcement</li>
                      <li>• Spam and abuse prevention</li>
                      <li>• Compliance with legal obligations</li>
                      <li>• Dispute resolution and support</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Analytics and Improvement</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Platform performance optimization</li>
                      <li>• User experience research and testing</li>
                      <li>• Product development and feature enhancement</li>
                      <li>• Technical issue diagnosis and resolution</li>
                      <li>• Usage analytics and trend analysis</li>
                    </ul>

                    <h4 className="font-semibold">Communication and Marketing</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Service updates and notifications</li>
                      <li>• Security alerts and account information</li>
                      <li>• Feature announcements and education</li>
                      <li>• Promotional content (with consent)</li>
                      <li>• Customer support and assistance</li>
                    </ul>

                    <h4 className="font-semibold">Legal Basis for Processing (GDPR)</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Contractual necessity (service provision)</li>
                      <li>• Legitimate interests (safety, improvement)</li>
                      <li>• Consent (marketing, optional features)</li>
                      <li>• Legal obligation (compliance, safety)</li>
                      <li>• Vital interests (emergency situations)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  4. Information Sharing and International Transfers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">International Data Transfers</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        As a global platform, your data may be transferred to and processed in countries 
                        other than your own. We implement appropriate safeguards for all international transfers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Service Providers and Partners</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Cloud hosting and infrastructure providers</li>
                      <li>• Payment processors and financial partners</li>
                      <li>• KYC/AML verification services</li>
                      <li>• Content delivery networks (CDNs)</li>
                      <li>• Analytics and performance monitoring</li>
                      <li>• Customer support and communication tools</li>
                      <li>• Security and fraud prevention services</li>
                    </ul>

                    <h4 className="font-semibold">Regional Service Providers</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• African payment providers (Flutterwave, Paystack)</li>
                      <li>• Mobile money services (MTN MoMo, Orange Money)</li>
                      <li>• Regional KYC providers (Smile Identity, Youverify)</li>
                      <li>• Local SMS and communication services</li>
                      <li>• Regional compliance and legal partners</li>
                    </ul>

                    <h4 className="font-semibold">Legal and Regulatory Sharing</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Law enforcement and regulatory authorities</li>
                      <li>• Court orders and legal proceedings</li>
                      <li>• Tax authorities and financial regulators</li>
                      <li>• Anti-money laundering investigations</li>
                      <li>• Child safety and protection agencies</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Transfer Safeguards</h4>
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-medium text-green-800 mb-2">GDPR Compliance Mechanisms:</h5>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Standard Contractual Clauses (SCCs)</li>
                        <li>• Adequacy decisions where available</li>
                        <li>• Binding Corporate Rules (BCRs)</li>
                        <li>• Certification schemes and codes of conduct</li>
                        <li>• Additional safeguards for sensitive data</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Data Processing Regions</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Primary: European Union (GDPR compliance)</li>
                      <li>• Secondary: United States (SCCs + DPF)</li>
                      <li>• Regional: Africa, Asia-Pacific, Latin America</li>
                      <li>• Backup: Multiple geographic regions</li>
                    </ul>

                    <h4 className="font-semibold">We Never Share Without Authorization</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Private messages and personal communications</li>
                      <li>• Financial account credentials or keys</li>
                      <li>• Biometric or health information</li>
                      <li>• Data for advertising without consent</li>
                      <li>• Information to unauthorized third parties</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  5. Your Privacy Rights and Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Universal Rights (All Users)</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Access your personal information</li>
                      <li>• Correct inaccurate or incomplete data</li>
                      <li>• Delete your account and associated data</li>
                      <li>• Export your data in portable formats</li>
                      <li>• Control privacy and sharing settings</li>
                      <li>• Opt out of marketing communications</li>
                      <li>• Withdraw consent for optional processing</li>
                    </ul>

                    <h4 className="font-semibold">Enhanced Rights (GDPR, CCPA, etc.)</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Right to erasure ("right to be forgotten")</li>
                      <li>• Right to restrict processing</li>
                      <li>• Right to object to processing</li>
                      <li>• Right to data portability</li>
                      <li>• Right not to be subject to automated decisions</li>
                      <li>• Right to lodge complaints with authorities</li>
                    </ul>

                    <h4 className="font-semibold">Financial Data Rights</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Access transaction history and records</li>
                      <li>• Correct payment and wallet information</li>
                      <li>• Request data deletion (subject to legal requirements)</li>
                      <li>• Opt out of financial product marketing</li>
                      <li>• Control data sharing with payment partners</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">How to Exercise Your Rights</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• <strong>In-App:</strong> Privacy settings and account management</li>
                        <li>• <strong>Email:</strong> privacy@softchat.com</li>
                        <li>• <strong>Support:</strong> Through customer service portal</li>
                        <li>• <strong>Regional:</strong> Local data protection contacts</li>
                        <li>• <strong>Response Time:</strong> 30 days (1 month) maximum</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Identity Verification</h4>
                    <p className="text-sm text-gray-600">
                      To protect your privacy and security, we may require identity verification 
                      before fulfilling certain requests. This may include confirming account 
                      ownership or providing government-issued identification.
                    </p>

                    <h4 className="font-semibold">Limitations and Exceptions</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Legal obligations may require data retention</li>
                      <li>• Financial records subject to regulatory requirements</li>
                      <li>• Safety and security investigations</li>
                      <li>• Ongoing legal proceedings or disputes</li>
                      <li>• Technical limitations for certain requests</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  6. Data Retention and Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Account and Profile Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Active accounts: Indefinitely while active</li>
                      <li>• Deactivated accounts: 30 days</li>
                      <li>• Deleted accounts: Immediate removal</li>
                      <li>• Backup copies: Up to 90 days</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Content and Communications</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Posts and media: 3 years after deletion</li>
                      <li>• Messages: 1 year after account deletion</li>
                      <li>• Live streams: 30 days after broadcast</li>
                      <li>• Comments: 2 years after removal</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Financial and Transaction Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Transaction records: 7 years (regulatory)</li>
                      <li>• KYC documents: 5 years after verification</li>
                      <li>• Payment methods: Until account deletion</li>
                      <li>• Tax records: Per local requirements</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Security and Legal Retention</h4>
                  <p className="text-sm text-gray-600">
                    Some data may be retained longer for legitimate purposes including legal compliance, 
                    fraud prevention, safety investigations, or as required by applicable laws. We 
                    minimize retention periods while meeting our legal and regulatory obligations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Measures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  7. Security and Protection Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Technical Safeguards</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• End-to-end encryption for sensitive communications</li>
                      <li>• AES-256 encryption for data at rest</li>
                      <li>• TLS 1.3 for data in transit</li>
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Hardware security modules (HSMs)</li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Zero-trust network architecture</li>
                    </ul>

                    <h4 className="font-semibold">Access Controls</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Role-based access control (RBAC)</li>
                      <li>• Principle of least privilege</li>
                      <li>• Regular access reviews and audits</li>
                      <li>• Employee background checks</li>
                      <li>• Contractor data processing agreements</li>
                    </ul>

                    <h4 className="font-semibold">Financial Security</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• PCI DSS compliance for payment data</li>
                      <li>• Multi-signature wallet security</li>
                      <li>• Cold storage for cryptocurrency assets</li>
                      <li>• Real-time fraud monitoring</li>
                      <li>• Secure key management systems</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Monitoring and Response</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 24/7 security operations center (SOC)</li>
                      <li>• Real-time threat detection and response</li>
                      <li>• Automated security incident handling</li>
                      <li>• Regular vulnerability assessments</li>
                      <li>• Incident response and recovery procedures</li>
                      <li>• Security awareness training programs</li>
                    </ul>

                    <h4 className="font-semibold">Compliance Certifications</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• SOC 2 Type II compliance</li>
                      <li>• ISO 27001 information security management</li>
                      <li>• PCI DSS for payment processing</li>
                      <li>• Regional data protection certifications</li>
                      <li>• Regular third-party security audits</li>
                    </ul>

                    <h4 className="font-semibold">Breach Notification</h4>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm text-red-700">
                        In the unlikely event of a data breach, we will notify affected users 
                        and relevant authorities within 72 hours as required by applicable laws 
                        (GDPR, NDPR, etc.). Notifications will include the nature of the breach, 
                        potential risks, and steps being taken to address it.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  8. Children's Privacy and Age Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Age Requirements by Region</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                    <div>• EU/EEA: 16 years (or country minimum)</div>
                    <div>• United States: 13 years</div>
                    <div>• Brazil: 13 years (with parental consent)</div>
                    <div>• South Korea: 14 years</div>
                    <div>• Most countries: 13-16 years</div>
                    <div>• Financial services: 18 years</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Age Verification Measures</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Date of birth collection during registration</li>
                      <li>• Identity verification for financial features</li>
                      <li>• Parental consent mechanisms where required</li>
                      <li>• Age-appropriate content filtering</li>
                      <li>• Regular compliance audits and reviews</li>
                    </ul>

                    <h4 className="font-semibold">Special Protections for Minors</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Enhanced privacy settings by default</li>
                      <li>• Limited data collection and processing</li>
                      <li>• Restricted financial and payment features</li>
                      <li>• Additional safety and moderation measures</li>
                      <li>• Easy reporting and assistance tools</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Parental Rights and Controls</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Access their child's account information</li>
                      <li>• Modify privacy settings and controls</li>
                      <li>• Request deletion of their child's data</li>
                      <li>• Receive notifications about account activity</li>
                      <li>• Contact support for assistance</li>
                    </ul>

                    <h4 className="font-semibold">Financial Services Restrictions</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• No access to cryptocurrency trading</li>
                      <li>• Limited creator monetization features</li>
                      <li>• No independent financial accounts</li>
                      <li>• Parental approval for earnings withdrawal</li>
                      <li>• Enhanced fraud protection monitoring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Specific Provisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  9. Region-Specific Privacy Provisions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">European Union (GDPR)</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Data Protection Officer: dpo@softchat.com</li>
                        <li>• Legal basis for processing clearly defined</li>
                        <li>• Explicit consent for special categories</li>
                        <li>• Right to lodge complaints with supervisory authorities</li>
                        <li>• Data protection impact assessments (DPIAs)</li>
                        <li>• Privacy by design and by default</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Nigeria (NDPR)</h4>
                    <div className="bg-green-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• NITDA registration and compliance</li>
                        <li>• Data protection compliance officer</li>
                        <li>• Local data processing preferences</li>
                        <li>• BVN and NIN handling procedures</li>
                        <li>• Naira transaction specific protections</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">California (CCPA/CPRA)</h4>
                    <div className="bg-yellow-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-yellow-700">
                        <li>• Right to know categories of personal information</li>
                        <li>• Right to delete personal information</li>
                        <li>• Right to opt out of sale of personal information</li>
                        <li>• Right to non-discrimination for exercising rights</li>
                        <li>• Authorized agent requests accepted</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Brazil (LGPD)</h4>
                    <div className="bg-purple-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-purple-700">
                        <li>• Data Protection Officer registration with ANPD</li>
                        <li>• Explicit consent for sensitive data processing</li>
                        <li>• Real data processing in Brazilian territory</li>
                        <li>• PIX payment system specific protections</li>
                        <li>• Portuguese language support and documentation</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">South Africa (POPIA)</h4>
                    <div className="bg-orange-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-orange-700">
                        <li>• Information Officer designation</li>
                        <li>• Processing of special personal information</li>
                        <li>• Cross-border data transfer requirements</li>
                        <li>• South African Reserve Bank compliance</li>
                        <li>• Local language accessibility options</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Other Regions</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Australia: Privacy Act and Notifiable Data Breaches</li>
                        <li>• Canada: PIPEDA and provincial privacy laws</li>
                        <li>• Singapore: PDPA and data portability provisions</li>
                        <li>• India: IT Rules and Digital Personal Data Protection</li>
                        <li>• Kenya: Data Protection Act compliance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact and Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  10. Contact Information and Policy Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Global Privacy Contacts</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• <strong>General Privacy:</strong> privacy@softchat.com</li>
                        <li>• <strong>Data Protection Officer:</strong> dpo@softchat.com</li>
                        <li>• <strong>Security Issues:</strong> security@softchat.com</li>
                        <li>• <strong>Legal Requests:</strong> legal@softchat.com</li>
                        <li>• <strong>Support:</strong> support@softchat.com</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Regional Contacts</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>EU/EEA:</strong> eu-privacy@softchat.com</li>
                      <li>• <strong>Africa:</strong> africa-privacy@softchat.com</li>
                      <li>• <strong>Americas:</strong> americas-privacy@softchat.com</li>
                      <li>• <strong>Asia-Pacific:</strong> apac-privacy@softchat.com</li>
                    </ul>

                    <h4 className="font-semibold">Regulatory Authority Contacts</h4>
                    <p className="text-sm text-gray-600">
                      You have the right to lodge complaints with your local data protection 
                      authority. Contact information for relevant authorities is available 
                      on our help center and support documentation.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Policy Updates and Changes</h4>
                    <div className="bg-green-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Material changes: 30 days advance notice</li>
                        <li>• Minor updates: Immediate effect with notification</li>
                        <li>• Emergency changes: Immediate with explanation</li>
                        <li>• Version tracking and change logs maintained</li>
                        <li>• Multi-language notifications where required</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Notification Methods</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• In-app notifications and banners</li>
                      <li>• Email notifications to registered address</li>
                      <li>• SMS notifications for significant changes</li>
                      <li>• Website and blog announcements</li>
                      <li>• Social media updates and communications</li>
                    </ul>

                    <h4 className="font-semibold">Version Information</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• <strong>Current Version:</strong> 3.0</li>
                        <li>• <strong>Effective Date:</strong> {new Date().toLocaleDateString()}</li>
                        <li>• <strong>Last Updated:</strong> {new Date().toLocaleDateString()}</li>
                        <li>• <strong>Next Review:</strong> {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</li>
                        <li>• <strong>Change Log:</strong> Available on request</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    This Privacy Policy represents our commitment to protecting your personal information 
                    across all regions where SoftChat operates. We continuously update our practices to 
                    ensure the highest standards of privacy protection and regulatory compliance.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                    <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>
                    <a href="/security" className="text-blue-600 hover:underline">Security Center</a>
                    <a href="/support" className="text-blue-600 hover:underline">Help Center</a>
                    <a href="/legal" className="text-blue-600 hover:underline">Legal Hub</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
