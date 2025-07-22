import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone, Target, Shield, Eye, DollarSign, Users, BarChart } from "lucide-react";

const AdvertisingPolicy = () => {
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
              <Megaphone className="w-8 h-8 text-primary" />
              Advertising Policy
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Our Approach to Advertising</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              SoftChat is committed to providing a high-quality advertising experience that 
              respects user privacy while enabling businesses to reach their target audiences 
              effectively. This Advertising Policy outlines how we display, target, and 
              manage advertisements across our AI-powered social media and marketplace platform.
            </p>
            <p>
              We believe in transparent, relevant, and respectful advertising that enhances 
              rather than detracts from the user experience on SoftChat's social networking, 
              marketplace, freelancing, and cryptocurrency features.
            </p>
          </CardContent>
        </Card>

        {/* Types of Advertising */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Types of Advertising on SoftChat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Social Feed Advertising
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Sponsored posts that appear in your social feed</li>
                <li>AI-powered content recommendations based on interests</li>
                <li>Story advertisements and interactive content</li>
                <li>Video advertisements and promotional content</li>
                <li>Community event and group promotions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Marketplace Advertising
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Sponsored product listings and featured items</li>
                <li>Category-specific promotional banners</li>
                <li>Search result advertisements and boosted listings</li>
                <li>Seller profile promotions and business showcases</li>
                <li>Cross-sell and upsell recommendations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Freelance Platform Advertising
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Promoted freelancer profiles and skills</li>
                <li>Featured job postings and project opportunities</li>
                <li>Service provider advertisements and portfolios</li>
                <li>Skills training and certification promotions</li>
                <li>Industry-specific tool and resource ads</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Cryptocurrency Advertising
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Trading platform and exchange promotions</li>
                <li>DeFi protocol and yield farming opportunities</li>
                <li>Cryptocurrency education and analysis content</li>
                <li>Wallet and security service advertisements</li>
                <li>ICO, token launches, and investment opportunities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Display and Banner Advertising</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Banner advertisements in non-intrusive locations</li>
                <li>Sidebar and footer promotional content</li>
                <li>Mobile-optimized advertising formats</li>
                <li>Video and interactive advertisement units</li>
                <li>Contextual advertisements based on page content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Ad Targeting and Personalization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Advertisement Targeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use various methods to show you relevant advertisements while respecting 
              your privacy preferences:
            </p>

            <div>
              <h4 className="font-semibold mb-2">Demographic Targeting</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Age, gender, and location-based targeting (with consent)</li>
                <li>Language and cultural preference targeting</li>
                <li>Device and platform-specific advertisements</li>
                <li>Time zone and local event targeting</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Interest-Based Targeting</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Content interaction and engagement patterns</li>
                <li>Marketplace browsing and purchase history</li>
                <li>Freelance skills and job application patterns</li>
                <li>Cryptocurrency trading and portfolio interests</li>
                <li>Social connections and community memberships</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Behavioral Targeting</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Platform usage patterns and feature preferences</li>
                <li>Search queries and content consumption habits</li>
                <li>Time spent on different platform sections</li>
                <li>Response rates to previous advertisements</li>
                <li>Device and browser usage patterns</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">AI-Powered Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Machine learning algorithms for ad relevance</li>
                <li>Predictive modeling for user preferences</li>
                <li>Real-time optimization based on user response</li>
                <li>Cross-platform behavior analysis</li>
                <li>Lookalike audience targeting</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy and Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Data Collection Principles</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We only collect data necessary for relevant ad targeting</li>
                <li>All data collection follows our Privacy Policy guidelines</li>
                <li>Sensitive information is never used for advertising purposes</li>
                <li>Users can opt-out of personalized advertising anytime</li>
                <li>Data retention periods are clearly defined and enforced</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">User Consent and Control</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Explicit consent for marketing cookies and tracking</li>
                <li>Granular controls for different ad categories</li>
                <li>Easy access to advertising preference settings</li>
                <li>Transparent disclosure of data usage in ads</li>
                <li>Regular consent renewal and confirmation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Security</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Encrypted storage and transmission of advertising data</li>
                <li>Access controls and audit trails for ad systems</li>
                <li>Regular security audits of advertising infrastructure</li>
                <li>Compliance with data protection regulations</li>
                <li>Anonymous and pseudonymous data processing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Advertiser Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Advertiser Standards and Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Prohibited Content</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Illegal products, services, or activities</li>
                <li>Misleading, deceptive, or false advertising claims</li>
                <li>Adult content, gambling, or restricted substances</li>
                <li>Hate speech, discrimination, or offensive material</li>
                <li>Scams, phishing attempts, or fraudulent schemes</li>
                <li>Malware, viruses, or harmful software</li>
                <li>Unregulated financial products or investment schemes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Quality Standards</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Clear and accurate product/service descriptions</li>
                <li>High-quality images and professional presentation</li>
                <li>Transparent pricing and terms of service</li>
                <li>Responsive and legitimate business practices</li>
                <li>Customer service and support accessibility</li>
                <li>Compliance with industry regulations and standards</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Disclosure Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Clear labeling of sponsored content and advertisements</li>
                <li>Disclosure of affiliate relationships and partnerships</li>
                <li>Transparent pricing and fee structures</li>
                <li>Accurate representation of product availability</li>
                <li>Compliance with local advertising regulations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Your Advertising Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Ad Preferences</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Customize ad categories and interests</li>
                <li>Opt-out of personalized advertising</li>
                <li>Block specific advertisers or ad types</li>
                <li>Control ad frequency and timing</li>
                <li>Set preferences for different platform areas</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Reporting and Feedback</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Report inappropriate or misleading advertisements</li>
                <li>Provide feedback on ad relevance and quality</li>
                <li>Report technical issues with advertisements</li>
                <li>Request removal of specific advertisement types</li>
                <li>Appeal advertising decisions and policies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Access and Control</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>View your advertising profile and interests</li>
                <li>Download your advertising data</li>
                <li>Delete advertising history and preferences</li>
                <li>Modify data sharing permissions</li>
                <li>Request deletion of advertising identifiers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Advertising */}
        <Card>
          <CardHeader>
            <CardTitle>Third-Party Advertising Partners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              SoftChat works with reputable third-party advertising networks and partners 
              to deliver relevant advertisements:
            </p>

            <div>
              <h4 className="font-semibold mb-2">Advertising Networks</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Google Ads and Google AdSense</li>
                <li>Facebook Audience Network</li>
                <li>Amazon Advertising Platform</li>
                <li>Microsoft Advertising (Bing Ads)</li>
                <li>Twitter Ads Platform</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Analytics and Measurement</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Google Analytics for advertising insights</li>
                <li>Facebook Pixel for conversion tracking</li>
                <li>Custom analytics for SoftChat-specific metrics</li>
                <li>Third-party verification services</li>
                <li>Brand safety and fraud detection tools</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Sharing</h4>
              <p className="text-sm">
                We only share aggregated, anonymized data with advertising partners. 
                Personal information is never shared without explicit consent, and all 
                partnerships comply with our Privacy Policy and applicable regulations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Crypto Advertising Special Considerations */}
        <Card>
          <CardHeader>
            <CardTitle>Cryptocurrency Advertising Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Enhanced Verification</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Cryptocurrency advertisers undergo additional KYC verification</li>
                <li>Compliance with local cryptocurrency regulations</li>
                <li>Regular monitoring of advertised services and products</li>
                <li>Risk assessments for new cryptocurrency advertisers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Risk Disclosures</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Mandatory risk warnings for high-risk investments</li>
                <li>Clear disclosure of potential losses</li>
                <li>Education about cryptocurrency volatility</li>
                <li>Links to regulatory guidance and resources</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Prohibited Crypto Ads</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Unregistered securities or investment schemes</li>
                <li>Guaranteed returns or risk-free investments</li>
                <li>Ponzi schemes or pyramid structures</li>
                <li>Unregulated lending or borrowing platforms</li>
                <li>Anonymous or privacy-focused illegal services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Enforcement and Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Enforcement and Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Monitoring and Review</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Automated systems for policy compliance checking</li>
                <li>Manual review of high-risk or reported advertisements</li>
                <li>Regular audits of advertising content and practices</li>
                <li>Continuous monitoring of advertiser behavior</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Violation Consequences</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Advertisement removal and disapproval</li>
                <li>Account suspension or termination</li>
                <li>Restriction from future advertising opportunities</li>
                <li>Legal action for severe violations</li>
                <li>Reporting to relevant authorities when required</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Appeals Process</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Formal appeals process for policy decisions</li>
                <li>Independent review of disputed cases</li>
                <li>Transparent communication of decisions</li>
                <li>Opportunity to correct and resubmit content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Updates and Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This Advertising Policy may be updated periodically to reflect changes in 
              our practices, technology, or regulatory requirements. Material changes 
              will be communicated to users and advertisers through platform notifications 
              and updated policy documentation.
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
              For questions about our Advertising Policy or to report advertising issues:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> advertising@softchat.com</p>
              <p><strong>Ad Review Team:</strong> adreview@softchat.com</p>
              <p><strong>Policy Questions:</strong> policy@softchat.com</p>
              <p><strong>Response Time:</strong> We aim to respond within 2-5 business days</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/app/ad-choices")}>
              Ad Choices
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/privacy")}>
              Privacy Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/app/terms")}>
              Terms of Service
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

export default AdvertisingPolicy;
