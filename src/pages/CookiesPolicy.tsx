import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cookie, Settings, Info, Shield, BarChart, Target } from "lucide-react";

const CookiesPolicy = () => {
  const navigate = useNavigate();
  
  // Cookie preferences state
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    personalization: true,
    social: true
  });

  const handlePreferenceChange = (type: keyof typeof cookiePreferences, value: boolean) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }));
    
    // In a real app, you would save these preferences and apply them
    console.log('Cookie preferences updated:', { ...cookiePreferences, [type]: value });
  };

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
              <Cookie className="w-8 h-8 text-primary" />
              Cookie Policy
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
              <Info className="w-5 h-5" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Cookies are small text files that are stored on your device when you visit 
              SoftChat. They help us provide you with a better experience by remembering 
              your preferences, keeping you logged in, and enabling personalized features.
            </p>
            <p>
              This Cookie Policy explains how SoftChat uses cookies and similar technologies 
              across our AI-powered social media and marketplace platform, including our 
              social networking, marketplace, freelancing, and cryptocurrency features.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Manage your cookie preferences below. Note that disabling certain cookies 
              may affect your experience on SoftChat.
            </p>
            
            <div className="space-y-4">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold">Essential Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required for the platform to function properly. These cannot be disabled.
                  </p>
                </div>
                <Switch 
                  checked={cookiePreferences.essential} 
                  disabled={true}
                  className="ml-4"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold">Analytics Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how you use SoftChat to improve our services.
                  </p>
                </div>
                <Switch 
                  checked={cookiePreferences.analytics} 
                  onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
                  className="ml-4"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold">Marketing Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Used to show you relevant advertisements and measure campaign effectiveness.
                  </p>
                </div>
                <Switch 
                  checked={cookiePreferences.marketing} 
                  onCheckedChange={(value) => handlePreferenceChange('marketing', value)}
                  className="ml-4"
                />
              </div>

              {/* Personalization Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-orange-600" />
                    <h4 className="font-semibold">Personalization Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remember your preferences and provide personalized AI recommendations.
                  </p>
                </div>
                <Switch 
                  checked={cookiePreferences.personalization} 
                  onCheckedChange={(value) => handlePreferenceChange('personalization', value)}
                  className="ml-4"
                />
              </div>

              {/* Social Media Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Cookie className="w-4 h-4 text-pink-600" />
                    <h4 className="font-semibold">Social Media Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable social features like sharing content and connecting with friends.
                  </p>
                </div>
                <Switch 
                  checked={cookiePreferences.social} 
                  onCheckedChange={(value) => handlePreferenceChange('social', value)}
                  className="ml-4"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => {
                // Save preferences logic would go here
                console.log('Saving cookie preferences:', cookiePreferences);
              }}>
                Save Preferences
              </Button>
              <Button variant="outline" onClick={() => {
                setCookiePreferences({
                  essential: true,
                  analytics: false,
                  marketing: false,
                  personalization: false,
                  social: false
                });
              }}>
                Reject All Optional
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Essential Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies are necessary for the platform to function and cannot be switched off:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Authentication:</strong> Keep you logged in securely</li>
                <li><strong>Security:</strong> Protect against CSRF attacks and fraud</li>
                <li><strong>Session Management:</strong> Maintain your session state</li>
                <li><strong>Load Balancing:</strong> Ensure optimal server performance</li>
                <li><strong>GDPR Consent:</strong> Remember your cookie preferences</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-600" />
                Analytics Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies help us understand how users interact with SoftChat:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Usage Analytics:</strong> Track page views and user journeys</li>
                <li><strong>Performance Monitoring:</strong> Identify and fix technical issues</li>
                <li><strong>Feature Usage:</strong> Understand which features are most popular</li>
                <li><strong>Error Tracking:</strong> Monitor and resolve platform errors</li>
                <li><strong>A/B Testing:</strong> Test new features and improvements</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Marketing Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies enable targeted advertising and marketing campaigns:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Ad Targeting:</strong> Show relevant advertisements</li>
                <li><strong>Campaign Tracking:</strong> Measure advertising effectiveness</li>
                <li><strong>Retargeting:</strong> Re-engage users who visited SoftChat</li>
                <li><strong>Social Media Ads:</strong> Track social media campaign performance</li>
                <li><strong>Affiliate Marketing:</strong> Attribute referrals and commissions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-600" />
                Personalization Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies enable personalized experiences and AI-powered features:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Content Recommendations:</strong> AI-powered feed personalization</li>
                <li><strong>Theme Preferences:</strong> Remember dark/light mode settings</li>
                <li><strong>Language Settings:</strong> Store your preferred language</li>
                <li><strong>Marketplace Preferences:</strong> Remember search filters and categories</li>
                <li><strong>Notification Settings:</strong> Store your notification preferences</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Cookie className="w-4 h-4 text-pink-600" />
                Social Media Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies enable social features and integrations:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Social Sharing:</strong> Enable sharing content on other platforms</li>
                <li><strong>Social Login:</strong> Allow login with social media accounts</li>
                <li><strong>Friend Connections:</strong> Find and connect with friends</li>
                <li><strong>Social Plugins:</strong> Embed social media content</li>
                <li><strong>Chat Integration:</strong> Enable social messaging features</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              SoftChat integrates with various third-party services that may set their own cookies:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Payment Processing</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Stripe:</strong> Secure payment processing</li>
                  <li><strong>PayPal:</strong> Alternative payment methods</li>
                  <li><strong>Crypto Wallets:</strong> Blockchain integrations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Analytics & Monitoring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Google Analytics:</strong> Web analytics</li>
                  <li><strong>Sentry:</strong> Error monitoring</li>
                  <li><strong>Mixpanel:</strong> User behavior analytics</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Content Delivery</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>AWS CloudFront:</strong> Content delivery network</li>
                  <li><strong>AWS S3:</strong> File storage and delivery</li>
                  <li><strong>Redis:</strong> Caching and session storage</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Communication</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>WebSocket:</strong> Real-time messaging</li>
                  <li><strong>Email Services:</strong> Transactional emails</li>
                  <li><strong>Push Notifications:</strong> Mobile notifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Our mobile applications use similar tracking technologies as cookies, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li><strong>Local Storage:</strong> Store app preferences and data</li>
              <li><strong>Device Identifiers:</strong> Unique identifiers for analytics</li>
              <li><strong>Push Tokens:</strong> Enable push notifications</li>
              <li><strong>App Analytics:</strong> Track app usage and performance</li>
              <li><strong>Crash Reporting:</strong> Monitor and fix app crashes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Managing Your Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Browser Controls</h4>
              <p className="text-sm mb-2">
                You can control cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Block all cookies (may affect site functionality)</li>
                <li>Block third-party cookies only</li>
                <li>Delete existing cookies</li>
                <li>Receive notifications when cookies are set</li>
                <li>Use private/incognito browsing mode</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Platform Controls</h4>
              <p className="text-sm mb-2">
                SoftChat provides additional privacy controls:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Cookie preference center (above)</li>
                <li>Account privacy settings</li>
                <li>Data export and deletion options</li>
                <li>Notification preferences</li>
                <li>AI recommendation controls</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Session Cookies:</strong> Deleted when you close your browser</p>
              <p><strong>Persistent Cookies:</strong> Stored for up to 2 years</p>
              <p><strong>Analytics Data:</strong> Retained for up to 26 months</p>
              <p><strong>Marketing Data:</strong> Retained for up to 13 months</p>
              <p><strong>Preference Data:</strong> Retained until you change them</p>
            </div>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We may update this Cookie Policy from time to time. We will notify you of any 
              material changes by posting the updated policy on this page and updating the 
              "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacy@softchat.com</p>
              <p><strong>Subject:</strong> Cookie Policy Inquiry</p>
              <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/app/privacy")}>
              Privacy Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/terms")}>
              Terms of Service
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/ad-choices")}>
              Ad Choices
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

export default CookiesPolicy;
