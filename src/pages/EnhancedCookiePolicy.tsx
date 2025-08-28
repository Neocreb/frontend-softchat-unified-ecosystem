import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Cookie, Settings, Shield, BarChart3, Target, Globe } from 'lucide-react';

export default function EnhancedCookiePolicy() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    advertising: false,
    social: false
  });

  const handlePreferenceChange = (category: string, value: boolean) => {
    if (category === 'necessary') return; // Always required
    setPreferences(prev => ({ ...prev, [category]: value }));
  };

  const savePreferences = () => {
    // Save preferences to localStorage or API
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Cookie Policy & Preferences
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Learn about how Eloity uses cookies and similar technologies, and manage your preferences 
            for data collection across our global platform.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-orange-50">GDPR Compliant</Badge>
            <Badge variant="outline" className="bg-blue-50">Global Coverage</Badge>
            <Badge variant="outline" className="bg-green-50">Real-time Controls</Badge>
          </div>
        </div>

        <Tabs defaultValue="policy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="policy">Cookie Policy</TabsTrigger>
            <TabsTrigger value="preferences">Your Preferences</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="legal">Legal Basis</TabsTrigger>
          </TabsList>

          <TabsContent value="policy">
            <ScrollArea className="h-[70vh]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cookie className="w-5 h-5" />
                      What Are Cookies and Similar Technologies?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Cookies are small text files stored on your device when you visit websites. 
                      Eloity uses cookies and similar technologies to enhance your experience, 
                      provide personalized content, and analyze platform usage.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Types of Technologies We Use</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• <strong>HTTP Cookies:</strong> Traditional browser cookies</li>
                          <li>• <strong>Local Storage:</strong> Browser storage for app data</li>
                          <li>• <strong>Session Storage:</strong> Temporary session data</li>
                          <li>• <strong>IndexedDB:</strong> Client-side database storage</li>
                          <li>• <strong>Web Beacons:</strong> Tracking pixels for analytics</li>
                          <li>• <strong>SDK Technologies:</strong> Mobile app tracking</li>
                          <li>• <strong>Fingerprinting:</strong> Device identification techniques</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Cookie Duration Types</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• <strong>Session Cookies:</strong> Deleted when browser closes</li>
                          <li>• <strong>Persistent Cookies:</strong> Remain until expiration</li>
                          <li>• <strong>First-Party Cookies:</strong> Set by Eloity directly</li>
                          <li>• <strong>Third-Party Cookies:</strong> Set by external services</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Cookie Categories and Purposes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-6">
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-green-700">Strictly Necessary Cookies</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Always Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Essential for basic website functionality and security. Cannot be disabled.
                        </p>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Authentication:</strong> Login sessions and user verification</div>
                          <div>• <strong>Security:</strong> CSRF protection and secure transactions</div>
                          <div>• <strong>Load Balancing:</strong> Traffic distribution and server selection</div>
                          <div>• <strong>Preferences:</strong> Language, currency, and accessibility settings</div>
                          <div>• <strong>Shopping Cart:</strong> Marketplace and transaction state</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-blue-700">Functional Cookies</h4>
                          <Badge variant="outline" className="bg-blue-50">Optional</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Enhance functionality and provide personalized features.
                        </p>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Personalization:</strong> Content recommendations and feed customization</div>
                          <div>• <strong>Video Preferences:</strong> Quality settings and playback options</div>
                          <div>• <strong>Chat Features:</strong> Message history and conversation state</div>
                          <div>• <strong>Creator Tools:</strong> Dashboard preferences and tool settings</div>
                          <div>• <strong>Accessibility:</strong> Screen reader and mobility assistance</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-purple-700">Analytics Cookies</h4>
                          <Badge variant="outline" className="bg-purple-50">Optional</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Help us understand how you use our platform to improve services.
                        </p>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Usage Analytics:</strong> Page views, feature usage, and user journeys</div>
                          <div>• <strong>Performance Monitoring:</strong> Load times and error tracking</div>
                          <div>• <strong>A/B Testing:</strong> Feature testing and optimization</div>
                          <div>• <strong>Crash Reporting:</strong> Bug detection and resolution</div>
                          <div>• <strong>Heat Mapping:</strong> User interaction patterns</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-orange-700">Advertising Cookies</h4>
                          <Badge variant="outline" className="bg-orange-50">Optional</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Used to deliver relevant advertisements and measure campaign effectiveness.
                        </p>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Ad Targeting:</strong> Relevant advertisement selection</div>
                          <div>• <strong>Frequency Capping:</strong> Limit ad repetition</div>
                          <div>• <strong>Campaign Measurement:</strong> Ad performance and attribution</div>
                          <div>• <strong>Retargeting:</strong> Show ads based on previous visits</div>
                          <div>• <strong>Cross-Device Tracking:</strong> Consistent experience across devices</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-indigo-700">Social Media Cookies</h4>
                          <Badge variant="outline" className="bg-indigo-50">Optional</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Enable social sharing features and integration with external platforms.
                        </p>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Social Login:</strong> Authentication via social platforms</div>
                          <div>• <strong>Content Sharing:</strong> Share posts to external networks</div>
                          <div>• <strong>Social Widgets:</strong> Embedded social media content</div>
                          <div>• <strong>Cross-Platform Analytics:</strong> Social engagement tracking</div>
                          <div>• <strong>Friend Finding:</strong> Discover connections from other platforms</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Third-Party Services and Partners
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Analytics and Performance</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• <strong>Google Analytics:</strong> Website and app analytics</li>
                          <li>• <strong>Mixpanel:</strong> Product analytics and user behavior</li>
                          <li>• <strong>Amplitude:</strong> User journey and conversion tracking</li>
                          <li>• <strong>Sentry:</strong> Error monitoring and performance</li>
                          <li>• <strong>DataDog:</strong> Infrastructure and application monitoring</li>
                          <li>• <strong>New Relic:</strong> Application performance monitoring</li>
                        </ul>

                        <h4 className="font-semibold">Social and Communication</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• <strong>Facebook Pixel:</strong> Social advertising and analytics</li>
                          <li>• <strong>Twitter/X Analytics:</strong> Social engagement tracking</li>
                          <li>• <strong>LinkedIn Insight:</strong> Professional network analytics</li>
                          <li>• <strong>YouTube API:</strong> Video content integration</li>
                          <li>• <strong>TikTok Pixel:</strong> Short-form video advertising</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Advertising and Marketing</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• <strong>Google Ads:</strong> Search and display advertising</li>
                          <li>• <strong>Facebook Ads:</strong> Social media advertising</li>
                          <li>• <strong>Microsoft Advertising:</strong> Bing and partner networks</li>
                          <li>• <strong>Amazon DSP:</strong> Programmatic advertising</li>
                          <li>• <strong>Criteo:</strong> Retargeting and personalization</li>
                          <li>• <strong>Branch:</strong> Mobile attribution and deep linking</li>
                        </ul>

                        <h4 className="font-semibold">Payment and Security</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• <strong>Stripe:</strong> Payment processing and fraud detection</li>
                          <li>• <strong>PayPal:</strong> Alternative payment methods</li>
                          <li>• <strong>Flutterwave:</strong> African payment processing</li>
                          <li>• <strong>reCAPTCHA:</strong> Bot detection and security</li>
                          <li>• <strong>Cloudflare:</strong> Security and performance optimization</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Manage Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    You can control which types of cookies we use by adjusting the settings below. 
                    Note that disabling certain cookies may affect platform functionality.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">Strictly Necessary</h4>
                      <p className="text-sm text-green-600 mt-1">
                        Required for basic functionality and security. Cannot be disabled.
                      </p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">Functional</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Enhance functionality with personalized features and improved user experience.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.functional}
                      onCheckedChange={(value) => handlePreferenceChange('functional', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">Analytics</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Help us understand platform usage to improve services and fix issues.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.analytics}
                      onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">Advertising</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Show relevant advertisements and measure campaign effectiveness.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.advertising}
                      onCheckedChange={(value) => handlePreferenceChange('advertising', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">Social Media</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Enable social sharing and integration with external platforms.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.social}
                      onCheckedChange={(value) => handlePreferenceChange('social', value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={savePreferences} className="flex-1">
                    Save Preferences
                  </Button>
                  <Button variant="outline" onClick={() => setPreferences({
                    necessary: true,
                    functional: false,
                    analytics: false,
                    advertising: false,
                    social: false
                  })}>
                    Reset to Defaults
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Additional Options</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• <strong>Browser Controls:</strong> Most browsers allow you to block or delete cookies</div>
                    <div>• <strong>Do Not Track:</strong> We respect browser Do Not Track signals</div>
                    <div>• <strong>Mobile Settings:</strong> Adjust advertising preferences in device settings</div>
                    <div>• <strong>Opt-out Links:</strong> Use industry opt-out tools like NAI and DAA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <ScrollArea className="h-[70vh]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Implementation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Cookie Storage Mechanisms</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <ul className="space-y-1 text-gray-600">
                            <li>• <strong>HTTP-only:</strong> Server-side access only</li>
                            <li>• <strong>Secure:</strong> HTTPS transmission only</li>
                            <li>• <strong>SameSite:</strong> CSRF protection settings</li>
                            <li>• <strong>Domain:</strong> Scope and subdomain access</li>
                            <li>• <strong>Path:</strong> URL path restrictions</li>
                            <li>• <strong>Expires/Max-Age:</strong> Lifetime controls</li>
                          </ul>
                        </div>

                        <h4 className="font-semibold">Data Collection Methods</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• JavaScript tags and pixels</li>
                          <li>• Server-side analytics integration</li>
                          <li>• Mobile SDK implementations</li>
                          <li>• API endpoint tracking</li>
                          <li>• WebSocket connection monitoring</li>
                          <li>• Progressive Web App (PWA) storage</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Data Processing Locations</h4>
                        <div className="bg-blue-50 p-3 rounded text-sm">
                          <ul className="space-y-1 text-blue-700">
                            <li>• <strong>Primary:</strong> European Union (GDPR)</li>
                            <li>• <strong>Secondary:</strong> United States (Privacy Framework)</li>
                            <li>• <strong>Regional:</strong> Africa, Asia-Pacific</li>
                            <li>• <strong>CDN:</strong> Global edge locations</li>
                            <li>• <strong>Analytics:</strong> Aggregated processing centers</li>
                          </ul>
                        </div>

                        <h4 className="font-semibold">Security Measures</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• End-to-end encryption for sensitive data</li>
                          <li>• Token-based authentication systems</li>
                          <li>• Regular security audits and penetration testing</li>
                          <li>• Automated threat detection and response</li>
                          <li>• Data anonymization and pseudonymization</li>
                          <li>• Secure backup and disaster recovery</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cookie Lifecycle Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Session Cookies</h4>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Duration:</strong> Browser session only</div>
                          <div>• <strong>Purpose:</strong> Authentication, cart state</div>
                          <div>• <strong>Deletion:</strong> Browser close or logout</div>
                          <div>• <strong>Security:</strong> HTTP-only, Secure flags</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Persistent Cookies</h4>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Duration:</strong> 30 days to 2 years</div>
                          <div>• <strong>Purpose:</strong> Preferences, analytics</div>
                          <div>• <strong>Renewal:</strong> Activity-based extension</div>
                          <div>• <strong>Cleanup:</strong> Automatic expiration</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Third-Party Cookies</h4>
                        <div className="text-sm space-y-1 text-gray-600">
                          <div>• <strong>Control:</strong> External service policies</div>
                          <div>• <strong>Purpose:</strong> Ads, social widgets</div>
                          <div>��� <strong>Blocking:</strong> Browser or extension controls</div>
                          <div>• <strong>Privacy:</strong> ITP and similar protections</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Retention and Deletion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Automated Deletion</h4>
                      <p className="text-sm text-red-700">
                        We automatically delete or anonymize cookie data according to retention 
                        policies and user preferences. Users can request immediate deletion at any time.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Retention Periods</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Authentication: Session duration</li>
                          <li>• Preferences: 2 years or user deletion</li>
                          <li>• Analytics: 26 months (Google Analytics)</li>
                          <li>• Advertising: 13 months maximum</li>
                          <li>• Social: Per third-party policies</li>
                          <li>• Security logs: 2 years</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">User Control Options</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Real-time preference updates</li>
                          <li>• Immediate cookie deletion</li>
                          <li>• Data portability requests</li>
                          <li>• Account deletion cascade</li>
                          <li>• Browser-based controls</li>
                          <li>• Opt-out tool integration</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="legal">
            <ScrollArea className="h-[70vh]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Legal Basis for Cookie Use
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">GDPR Legal Bases (EU/EEA)</h4>
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded">
                            <h5 className="font-medium text-green-800">Strictly Necessary</h5>
                            <p className="text-sm text-green-700 mt-1">
                              <strong>Legal Basis:</strong> Legitimate interest and contractual necessity 
                              for service provision and security.
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded">
                            <h5 className="font-medium text-blue-800">Functional & Analytics</h5>
                            <p className="text-sm text-blue-700 mt-1">
                              <strong>Legal Basis:</strong> Consent and legitimate interest for 
                              service improvement and user experience enhancement.
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-3 rounded">
                            <h5 className="font-medium text-purple-800">Advertising & Social</h5>
                            <p className="text-sm text-purple-700 mt-1">
                              <strong>Legal Basis:</strong> Explicit consent for marketing 
                              communications and personalized advertising.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Regional Compliance</h4>
                        <ul className="text-sm space-y-2 text-gray-600">
                          <li>• <strong>ePrivacy Directive (EU):</strong> Cookie consent requirements</li>
                          <li>• <strong>CCPA (California):</strong> Right to opt-out of sale</li>
                          <li>• <strong>LGPD (Brazil):</strong> Consent and legitimate interest</li>
                          <li>• <strong>NDPR (Nigeria):</strong> Data processing consent</li>
                          <li>• <strong>POPIA (South Africa):</strong> Purpose specification</li>
                          <li>• <strong>PDPA (Singapore):</strong> Consent and notification</li>
                          <li>• <strong>Privacy Act (Australia):</strong> Collection notice</li>
                          <li>• <strong>PIPEDA (Canada):</strong> Meaningful consent</li>
                        </ul>

                        <h4 className="font-semibold">Consent Management</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Granular consent options</li>
                          <li>• Clear and specific information</li>
                          <li>• Easy withdrawal mechanisms</li>
                          <li>• Consent record maintenance</li>
                          <li>• Regular consent renewal</li>
                          <li>• Age-appropriate consent (minors)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Rights and Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Universal Rights</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Access information about cookie use</li>
                          <li>• Control cookie preferences</li>
                          <li>• Withdraw consent at any time</li>
                          <li>• Request deletion of cookie data</li>
                          <li>• Opt-out of targeted advertising</li>
                          <li>• Export cookie preference data</li>
                          <li>• Lodge complaints with authorities</li>
                        </ul>

                        <h4 className="font-semibold">GDPR-Specific Rights</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Right to be informed about processing</li>
                          <li>• Right of access to personal data</li>
                          <li>• Right to rectification of inaccurate data</li>
                          <li>• Right to erasure ("right to be forgotten")</li>
                          <li>• Right to restrict processing</li>
                          <li>• Right to data portability</li>
                          <li>• Right to object to processing</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">How to Exercise Rights</h4>
                        <div className="bg-blue-50 p-3 rounded">
                          <ul className="text-sm space-y-1 text-blue-700">
                            <li>• <strong>Email:</strong> privacy@eloity.com</li>
                            <li>• <strong>Support Portal:</strong> Help center requests</li>
                            <li>• <strong>In-App:</strong> Privacy settings and controls</li>
                            <li>• <strong>Phone:</strong> Customer service hotline</li>
                            <li>• <strong>Mail:</strong> Physical address requests</li>
                          </ul>
                        </div>

                        <h4 className="font-semibold">Response Timeframes</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Immediate: Cookie preference updates</li>
                          <li>• 72 hours: Consent withdrawal processing</li>
                          <li>• 30 days: Formal rights requests (GDPR)</li>
                          <li>• Extended: Complex requests (up to 3 months)</li>
                          <li>• Emergency: Security-related requests</li>
                        </ul>

                        <h4 className="font-semibold">Complaint Authorities</h4>
                        <p className="text-sm text-gray-600">
                          You can lodge complaints with your local data protection authority. 
                          Contact information is available in our help center and support documentation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Updates and Changes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Policy Updates</h4>
                      <p className="text-sm text-yellow-700">
                        We may update this Cookie Policy to reflect changes in technology, 
                        legal requirements, or business practices. Material changes will be 
                        communicated through prominent notices and consent re-collection.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Notification Methods</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• In-app notifications and banners</li>
                          <li>• Email notifications to registered users</li>
                          <li>• Website announcement banners</li>
                          <li>• Social media updates</li>
                          <li>• Push notifications for mobile apps</li>
                          <li>• Newsletter updates</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Version Information</h4>
                        <div className="bg-gray-50 p-3 rounded">
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• <strong>Current Version:</strong> 3.0</li>
                            <li>• <strong>Effective Date:</strong> {new Date().toLocaleDateString()}</li>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
