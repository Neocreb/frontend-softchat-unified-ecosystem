import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail, UserCheck } from "lucide-react";

const PrivacyPolicy = () => {
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
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At SoftChat, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our AI-powered social media 
              and marketplace platform.
            </p>
            <p>
              SoftChat is a comprehensive platform that includes social networking features, 
              marketplace functionality, freelancing services, cryptocurrency trading, and 
              AI-powered content recommendations. Your privacy is fundamental to our operations.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Name, email address, and contact information</li>
                <li>Profile information including bio, interests, and preferences</li>
                <li>Authentication credentials (securely hashed)</li>
                <li>Payment and banking information for marketplace transactions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">KYC Verification Data (Premium Users)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Government-issued photo identification documents (front and back)</li>
                <li>Real-time selfie images with liveness detection data</li>
                <li>Phone number and email verification records</li>
                <li>Identity verification status and compliance records</li>
                <li>Biometric data derived from selfie verification (securely processed and stored)</li>
              </ul>
              <p className="text-sm mt-2 text-gray-600">
                KYC data is encrypted, stored separately from general user data, and only used for
                identity verification and compliance purposes. This data is retained as required by
                applicable laws and regulations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Storage & Content Data</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Uploaded videos, images, and media files</li>
                <li>Content metadata including upload dates and file sizes</li>
                <li>Storage usage analytics and retention schedules</li>
                <li>Content expiration dates (90 days for free users, unlimited for premium)</li>
                <li>Backup and recovery data for premium users</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Platform Usage Data</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Posts, comments, messages, and shared content</li>
                <li>Marketplace listings, purchases, and transaction history</li>
                <li>Freelance job postings, applications, and project communications</li>
                <li>Cryptocurrency trading activities and wallet interactions</li>
                <li>AI assistant interactions and content preferences</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Technical Information</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Device information, IP address, and browser details</li>
                <li>Usage analytics and performance metrics</li>
                <li>Location data (when explicitly provided)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Platform Services</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Provide and maintain social networking features</li>
                <li>Process marketplace transactions and payments</li>
                <li>Facilitate freelance job matching and project management</li>
                <li>Enable cryptocurrency trading and wallet services</li>
                <li>Deliver personalized AI-powered recommendations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Communication & Support</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Send important platform updates and notifications</li>
                <li>Provide customer support and technical assistance</li>
                <li>Deliver marketing communications (with your consent)</li>
                <li>Facilitate real-time messaging and video calls</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Security & Compliance</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Verify identity for KYC and anti-fraud purposes</li>
                <li>Monitor for suspicious activities and security threats</li>
                <li>Comply with legal obligations and regulatory requirements</li>
                <li>Protect against unauthorized access and data breaches</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Data Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <div>
              <h4 className="font-semibold mb-2">Service Providers</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>AWS S3 for secure file storage and CDN services</li>
                <li>Stripe for payment processing and financial transactions</li>
                <li>Email service providers for communication delivery</li>
                <li>Analytics providers for platform improvement (anonymized data)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Legal Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>To comply with applicable laws and regulations</li>
                <li>In response to valid legal requests from authorities</li>
                <li>To protect our rights, property, or safety</li>
                <li>To prevent fraud or illegal activities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Business Transfers</h4>
              <p className="text-sm">
                In the event of a merger, acquisition, or sale of assets, your information 
                may be transferred as part of that transaction, subject to equivalent 
                privacy protections.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We implement comprehensive security measures to protect your information:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>AES-256 encryption for data at rest</li>
                  <li>TLS 1.3 encryption for data in transit</li>
                  <li>Secure password hashing with bcrypt</li>
                  <li>JWT-based authentication with expiration</li>
                  <li>Regular security audits and updates</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Operational Security</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Role-based access controls (RBAC)</li>
                  <li>Rate limiting and DDoS protection</li>
                  <li>Input validation and sanitization</li>
                  <li>Secure development practices</li>
                  <li>Employee training and background checks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Data Rights</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Privacy Controls</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Profile visibility settings (public, friends, private)</li>
                <li>Marketing communication preferences</li>
                <li>Data sharing and analytics opt-out</li>
                <li>Cookie and tracking preferences</li>
                <li>AI recommendation personalization controls</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
              <li>Adequacy decisions where applicable</li>
              <li>Additional security measures for sensitive data</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              SoftChat is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we become aware that we 
              have collected such information, we will take steps to delete it promptly.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, 
              please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacy@softchat.com</p>
              <p><strong>Address:</strong> SoftChat Privacy Team, Data Protection Office</p>
              <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/app/terms")}>
              Terms of Service
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/cookies")}>
              Cookie Policy
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

export default PrivacyPolicy;
