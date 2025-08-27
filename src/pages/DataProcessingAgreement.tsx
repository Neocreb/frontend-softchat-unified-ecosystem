import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Building2, Shield, FileText, Globe } from 'lucide-react';

export default function DataProcessingAgreement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-slate-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
              Data Processing Agreement
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive data processing terms for business partners, creators, and enterprise clients
            of Eloity's global platform services.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-slate-50">GDPR Article 28 Compliant</Badge>
            <Badge variant="outline" className="bg-blue-50">Global Coverage</Badge>
            <Badge variant="outline" className="bg-green-50">Enterprise Ready</Badge>
          </div>
        </div>

        <ScrollArea className="h-[80vh]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  1. Agreement Scope and Definitions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This Data Processing Agreement ("DPA") forms part of the service agreement between
                  Eloity ("Processor") and the subscribing entity ("Controller") for the provision
                  of platform services involving personal data processing.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Definitions</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Personal Data:</strong> Any information relating to identified or identifiable natural persons</li>
                      <li>• <strong>Processing:</strong> Any operation performed on personal data</li>
                      <li>• <strong>Controller:</strong> Entity determining purposes and means of processing</li>
                      <li>• <strong>Processor:</strong> Eloity as entity processing on behalf of Controller</li>
                      <li>• <strong>Sub-processor:</strong> Third parties engaged to assist in processing</li>
                      <li>• <strong>Data Subject:</strong> Identified or identifiable natural person</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Processing Categories</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Social media platform services</li>
                      <li>• Creator economy and monetization tools</li>
                      <li>• Real-time communication and messaging</li>
                      <li>• Video streaming and content delivery</li>
                      <li>• Financial services and cryptocurrency trading</li>
                      <li>• AI assistance and content recommendation</li>
                      <li>• Freelance marketplace operations</li>
                      <li>• Analytics and performance monitoring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  2. Processing Instructions and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Processing Authority</h4>
                  <p className="text-sm text-blue-700">
                    Eloity shall process personal data only on documented instructions from the Controller,
                    including with regard to transfers of personal data to third countries or international
                    organizations, unless required to do so by applicable law.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Permitted Processing Activities</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Platform service provision as contracted</li>
                      <li>• User account management and authentication</li>
                      <li>• Content hosting and delivery services</li>
                      <li>• Payment processing and financial transactions</li>
                      <li>• Customer support and technical assistance</li>
                      <li>• Security monitoring and incident response</li>
                      <li>• Analytics for service improvement</li>
                      <li>• Legal compliance and regulatory reporting</li>
                    </ul>

                    <h4 className="font-semibold">Processing Restrictions</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• No processing beyond documented instructions</li>
                      <li>• No unauthorized access to personal data</li>
                      <li>• No sharing with unauthorized third parties</li>
                      <li>• No processing for Eloity's independent purposes</li>
                      <li>• No retention beyond agreed periods</li>
                      <li>• No modification of data subject rights procedures</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Data Categories</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Identity data (names, usernames, photos)</li>
                      <li>• Contact information (email, phone, address)</li>
                      <li>• Content data (posts, videos, messages)</li>
                      <li>• Financial data (payment methods, transactions)</li>
                      <li>• Technical data (IP addresses, device info)</li>
                      <li>• Usage data (activity patterns, preferences)</li>
                      <li>• Location data (when explicitly provided)</li>
                      <li>• Communication metadata</li>
                    </ul>

                    <h4 className="font-semibold">Data Subject Categories</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Platform users and account holders</li>
                      <li>• Content creators and influencers</li>
                      <li>• Business customers and enterprise users</li>
                      <li>• Freelancers and service providers</li>
                      <li>• Financial service users</li>
                      <li>• Customer support contacts</li>
                      <li>• Marketing and newsletter subscribers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  3. International Transfers and Safeguards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Transfer Mechanisms</h4>
                    <div className="bg-green-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Standard Contractual Clauses (EU Commission)</li>
                        <li>• Adequacy decisions where available</li>
                        <li>• Binding Corporate Rules (BCRs)</li>
                        <li>• Certification schemes and codes of conduct</li>
                        <li>• Additional contractual safeguards</li>
                        <li>• Data localization where required</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Approved Transfer Destinations</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• European Economic Area (EEA)</li>
                      <li>• United Kingdom (Adequacy Decision)</li>
                      <li>• United States (EU-US Data Privacy Framework)</li>
                      <li>• Canada (Adequacy Decision - Commercial)</li>
                      <li>• Other countries with appropriate safeguards</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Transfer Safeguards</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Technical and organizational measures</li>
                      <li>• Encryption in transit and at rest</li>
                      <li>• Access controls and authentication</li>
                      <li>• Regular security assessments</li>
                      <li>• Incident response procedures</li>
                      <li>• Data minimization practices</li>
                      <li>• Purpose limitation enforcement</li>
                    </ul>

                    <h4 className="font-semibold">Transfer Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Controller will be notified of any new international transfers or 
                      changes to existing transfer arrangements, with opportunity to 
                      object or request additional safeguards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Sub-processor Engagement and Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Sub-processor Authorization</h4>
                  <p className="text-sm text-yellow-700">
                    Controller provides general authorization for Eloity to engage sub-processors,
                    subject to the conditions and safeguards specified in this agreement.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Current Sub-processors</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Cloud Infrastructure Providers (AWS, Google Cloud, Azure)</li>
                      <li>• Content Delivery Networks (CloudFlare, Amazon CloudFront)</li>
                      <li>• Payment Processors (Stripe, Flutterwave, Paystack)</li>
                      <li>• KYC/AML Providers (Smile Identity, Jumio, Onfido)</li>
                      <li>• Communication Services (Twilio, Africa's Talking)</li>
                      <li>• Analytics Providers (Mixpanel, Amplitude)</li>
                      <li>• Security Services (Sentry, DataDog)</li>
                      <li>• Email Services (SendGrid, Mailgun)</li>
                    </ul>

                    <h4 className="font-semibold">Sub-processor Requirements</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Equivalent data protection obligations</li>
                      <li>• Written data processing agreements</li>
                      <li>• Regular compliance audits and assessments</li>
                      <li>• Incident notification procedures</li>
                      <li>• Data subject rights facilitation</li>
                      <li>• Deletion and return obligations</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Change Management Process</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <ol className="text-sm space-y-1 text-blue-700 list-decimal list-inside">
                        <li>30-day advance notice of new sub-processors</li>
                        <li>Detailed information about processing activities</li>
                        <li>Controller opportunity to object within 30 days</li>
                        <li>Alternative solutions if Controller objects</li>
                        <li>Documentation of all sub-processor changes</li>
                        <li>Updated sub-processor list maintenance</li>
                      </ol>
                    </div>

                    <h4 className="font-semibold">Sub-processor Liability</h4>
                    <p className="text-sm text-gray-600">
                      Eloity remains fully liable to Controller for performance of
                      all sub-processor obligations. Sub-processors are bound by the
                      same data protection requirements as Eloity under this DPA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Security Measures and Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Technical Measures</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• AES-256 encryption for data at rest</li>
                      <li>• TLS 1.3 for data in transit</li>
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Hardware security modules (HSMs)</li>
                      <li>• Regular penetration testing</li>
                      <li>• Vulnerability management programs</li>
                      <li>• Secure development lifecycle (SDLC)</li>
                      <li>• Zero-trust network architecture</li>
                    </ul>

                    <h4 className="font-semibold">Organizational Measures</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Role-based access controls (RBAC)</li>
                      <li>• Background checks for personnel</li>
                      <li>• Security awareness training</li>
                      <li>• Incident response procedures</li>
                      <li>• Data classification and handling</li>
                      <li>• Regular security audits</li>
                      <li>• Business continuity planning</li>
                      <li>• Vendor risk management</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Compliance Certifications</h4>
                    <div className="bg-green-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• SOC 2 Type II certification</li>
                        <li>• ISO 27001 compliance</li>
                        <li>• PCI DSS for payment processing</li>
                        <li>• Regional data protection certifications</li>
                        <li>• Cloud security alliance (CSA) membership</li>
                        <li>• GDPR compliance validation</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Security Documentation</h4>
                    <p className="text-sm text-gray-600">
                      Detailed security documentation, including policies, procedures, 
                      and technical specifications, is available upon request and 
                      subject to appropriate confidentiality agreements.
                    </p>

                    <h4 className="font-semibold">Security Monitoring</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 24/7 security operations center (SOC)</li>
                      <li>• Real-time threat detection</li>
                      <li>• Automated incident response</li>
                      <li>• Continuous compliance monitoring</li>
                      <li>• Regular security assessments</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Data Subject Rights and Controller Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Rights Facilitation</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Access to personal data and processing information</li>
                      <li>• Rectification of inaccurate or incomplete data</li>
                      <li>• Erasure ("right to be forgotten")</li>
                      <li>• Restriction of processing</li>
                      <li>• Data portability in structured formats</li>
                      <li>• Objection to processing</li>
                      <li>• Withdrawal of consent</li>
                      <li>• Complaint submission assistance</li>
                    </ul>

                    <h4 className="font-semibold">Response Procedures</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Response within 30 days (1 month)</li>
                        <li>• Extension notification if complex requests</li>
                        <li>• Identity verification requirements</li>
                        <li>• Clear explanation of actions taken</li>
                        <li>• Information about appeal processes</li>
                        <li>• Documentation of all requests</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Controller Support Services</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Data mapping and inventory assistance</li>
                      <li>• Privacy impact assessment support</li>
                      <li>• Regulatory inquiry response assistance</li>
                      <li>• Audit support and documentation</li>
                      <li>• Training and education resources</li>
                      <li>• Best practices guidance</li>
                      <li>• Compliance monitoring reports</li>
                    </ul>

                    <h4 className="font-semibold">Technical Assistance</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• API access for data management</li>
                      <li>• Automated reporting capabilities</li>
                      <li>• Integration support for rights management</li>
                      <li>• Custom data export formats</li>
                      <li>• Real-time compliance dashboards</li>
                    </ul>

                    <h4 className="font-semibold">Limitations and Exceptions</h4>
                    <p className="text-sm text-gray-600">
                      Rights may be limited by applicable law, ongoing legal proceedings, 
                      legitimate interests, or technical constraints. All limitations 
                      will be clearly communicated with legal basis provided.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Incident Management and Breach Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Breach Notification Timeline</h4>
                  <p className="text-sm text-red-700">
                    Eloity will notify Controller without undue delay and, where feasible,
                    within 72 hours of becoming aware of a personal data breach.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Incident Response Process</h4>
                    <ol className="text-sm space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Immediate incident identification and containment</li>
                      <li>Initial assessment of scope and impact</li>
                      <li>Controller notification within 72 hours</li>
                      <li>Detailed investigation and forensic analysis</li>
                      <li>Remediation and recovery actions</li>
                      <li>Final incident report and lessons learned</li>
                      <li>Process improvements implementation</li>
                    </ol>

                    <h4 className="font-semibold">Notification Content</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Nature and category of breach</li>
                      <li>• Number and categories of affected data subjects</li>
                      <li>• Types of personal data involved</li>
                      <li>• Likely consequences of the breach</li>
                      <li>• Measures taken to address the breach</li>
                      <li>• Recommendations for Controller actions</li>
                      <li>• Contact information for further details</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Breach Categories</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Confidentiality breaches (unauthorized access)</li>
                      <li>• Integrity breaches (unauthorized alteration)</li>
                      <li>• Availability breaches (service disruption)</li>
                      <li>• System security incidents</li>
                      <li>• Data loss or corruption events</li>
                      <li>• Third-party or sub-processor incidents</li>
                    </ul>

                    <h4 className="font-semibold">Post-Incident Activities</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Comprehensive incident documentation</li>
                      <li>• Root cause analysis and corrective actions</li>
                      <li>• Security control enhancements</li>
                      <li>• Staff retraining where applicable</li>
                      <li>• Process and procedure updates</li>
                      <li>• Regular incident review meetings</li>
                    </ul>

                    <h4 className="font-semibold">Controller Obligations</h4>
                    <p className="text-sm text-gray-600">
                      Controller remains responsible for assessing whether to notify 
                      supervisory authorities and data subjects, and for determining 
                      any additional remedial actions required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Data Retention and Deletion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Retention Periods</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Active user data: Duration of service agreement</li>
                      <li>• Financial records: 7 years (regulatory requirement)</li>
                      <li>• Security logs: 2 years</li>
                      <li>• Communication data: 1 year post-deletion</li>
                      <li>• Analytics data: 3 years (aggregated/anonymized)</li>
                      <li>• Backup data: 90 days maximum</li>
                      <li>• Audit logs: 5 years</li>
                    </ul>

                    <h4 className="font-semibold">Deletion Procedures</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Secure deletion from all systems</li>
                      <li>• Backup and archive removal</li>
                      <li>• Sub-processor deletion coordination</li>
                      <li>• Verification of complete removal</li>
                      <li>• Deletion certification upon request</li>
                      <li>• Exception documentation for legal holds</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">End of Agreement Procedures</h4>
                    <div className="bg-purple-50 p-3 rounded">
                      <ol className="text-sm space-y-1 text-purple-700 list-decimal list-inside">
                        <li>Controller instruction for data handling</li>
                        <li>Data export in agreed formats</li>
                        <li>Transition period for service continuity</li>
                        <li>Secure deletion of remaining data</li>
                        <li>Sub-processor coordination for deletion</li>
                        <li>Final confirmation of data removal</li>
                      </ol>
                    </div>

                    <h4 className="font-semibold">Legal Retention Exceptions</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Financial regulatory requirements</li>
                      <li>• Ongoing legal proceedings</li>
                      <li>• Tax and accounting obligations</li>
                      <li>• Anti-money laundering records</li>
                      <li>• Dispute resolution requirements</li>
                      <li>• Law enforcement requests</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Audits and Compliance Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Audit Rights and Procedures</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Annual compliance audits by qualified auditors</li>
                      <li>• Controller right to audit (reasonable notice)</li>
                      <li>• Third-party audit reports sharing</li>
                      <li>• On-site inspections (by appointment)</li>
                      <li>• Documentation and evidence review</li>
                      <li>• Remediation plan development</li>
                      <li>• Follow-up audit procedures</li>
                    </ul>

                    <h4 className="font-semibold">Compliance Documentation</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Data processing records (Article 30)</li>
                      <li>• Security policies and procedures</li>
                      <li>• Staff training records</li>
                      <li>• Incident response documentation</li>
                      <li>• Sub-processor agreements</li>
                      <li>• Transfer mechanism documentation</li>
                      <li>• Data subject rights handling records</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Audit Scope and Limitations</h4>
                    <div className="bg-yellow-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-yellow-700">
                        <li>• Reasonable advance notice required</li>
                        <li>• Business hours and operational considerations</li>
                        <li>• Confidentiality and non-disclosure requirements</li>
                        <li>• Security clearance for sensitive areas</li>
                        <li>• Cost allocation for extensive audits</li>
                        <li>• Alternative evidence acceptance</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Certification and Attestations</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Annual compliance certifications</li>
                      <li>• SOC 2 Type II reports</li>
                      <li>• ISO 27001 certificates</li>
                      <li>• Regional compliance attestations</li>
                      <li>• Industry-specific certifications</li>
                      <li>• Continuous monitoring reports</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Agreement Terms and Modifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Agreement Duration</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Effective from service agreement execution</li>
                      <li>• Continues for duration of service provision</li>
                      <li>• Survives termination for data handling obligations</li>
                      <li>• Annual review and update processes</li>
                      <li>• Automatic renewal with service agreements</li>
                    </ul>

                    <h4 className="font-semibold">Modification Procedures</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Written agreement for all modifications</li>
                      <li>• 30-day notice for regulatory changes</li>
                      <li>• Controller approval for material changes</li>
                      <li>• Version control and change documentation</li>
                      <li>• Legal review for compliance impacts</li>
                    </ul>

                    <h4 className="font-semibold">Governing Law and Jurisdiction</h4>
                    <p className="text-sm text-gray-600">
                      This DPA is governed by the same law as the main service agreement, 
                      with specific provisions for data protection law compliance in 
                      each applicable jurisdiction.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Liability and Limitations</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Data protection liability as per service agreement</li>
                      <li>• Joint liability for GDPR violations</li>
                      <li>• Indemnification for compliance breaches</li>
                      <li>• Insurance coverage requirements</li>
                      <li>• Limitation periods and notice requirements</li>
                    </ul>

                    <h4 className="font-semibold">Contact Information</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• <strong>DPA Queries:</strong> dpa@eloity.com</li>
                        <li>• <strong>Legal Team:</strong> legal@eloity.com</li>
                        <li>• <strong>DPO Contact:</strong> dpo@eloity.com</li>
                        <li>• <strong>Security Issues:</strong> security@eloity.com</li>
                        <li>• <strong>Compliance:</strong> compliance@eloity.com</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold">Effective Date and Version</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• <strong>Version:</strong> 2.0</li>
                        <li>• <strong>Effective:</strong> {new Date().toLocaleDateString()}</li>
                        <li>• <strong>Last Updated:</strong> {new Date().toLocaleDateString()}</li>
                        <li>• <strong>Next Review:</strong> {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</li>
                      </ul>
                    </div>
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
