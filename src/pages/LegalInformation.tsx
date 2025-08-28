import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Truck, Users, Globe, AlertTriangle } from "lucide-react";

const LegalInformation = () => {
  const navigate = useNavigate();

  const legalDocuments = [
    {
      title: "Terms of Service",
      description: "General terms and conditions for using the Eloity platform, including social features, marketplace, freelancing, and crypto services.",
      path: "/terms",
      icon: FileText,
      audience: "All users"
    },
    {
      title: "Privacy Policy", 
      description: "How we collect, use, and protect your personal information across all platform features.",
      path: "/privacy",
      icon: Shield,
      audience: "All users"
    },
    {
      title: "Dispatch Partner Terms",
      description: "Comprehensive terms for delivery drivers including data privacy, earnings agreement, and service requirements.",
      path: "/dispatch-partner-terms", 
      icon: Truck,
      audience: "Delivery partners"
    },
    {
      title: "Cookie Policy",
      description: "Information about cookies and tracking technologies used on our platform.",
      path: "/cookies",
      icon: Globe,
      audience: "All users"
    },
    {
      title: "Advertising Policy",
      description: "Guidelines for advertising content and sponsored posts on the platform.",
      path: "/advertising",
      icon: Users,
      audience: "Advertisers & content creators"
    },
    {
      title: "Monetization Policy",
      description: "Rules and guidelines for earning money through content creation and platform features.",
      path: "/app/monetization-policy",
      icon: Users,
      audience: "Content creators"
    }
  ];

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
              Legal Information
            </CardTitle>
            <p className="text-muted-foreground">
              Comprehensive legal documentation for the Eloity platform
            </p>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Eloity provides comprehensive legal documentation to ensure transparency
              and clarity for all users of our platform. Our legal framework covers
              general platform usage, specialized services, and specific user roles.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Key Features of Our Legal Framework:</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Role-specific terms for different user types (general users, delivery partners, content creators)</li>
                <li>Comprehensive data privacy protection across all services</li>
                <li>Clear earnings and payment terms for service providers</li>
                <li>Transparent policies for advertising and monetization</li>
                <li>Automatic reward sharing system for community growth</li>
                <li>Pioneer badge program for early active users</li>
                <li>Regular updates to reflect platform evolution and legal requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalDocuments.map((doc, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <doc.icon className="w-5 h-5 text-primary" />
                  {doc.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Target audience: {doc.audience}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{doc.description}</p>
                <Button 
                  onClick={() => navigate(doc.path)}
                  className="w-full"
                  variant="outline"
                >
                  Read Document
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dispatch Partner Specific Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Dispatch Partner Legal Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Individuals applying to become delivery partners on Eloity must review and
              agree to specialized legal documentation that governs their participation in
              our delivery network.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Required Reading for Delivery Partners:</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                    <li><strong>Dispatch Partner Terms of Use:</strong> Comprehensive service agreement including eligibility, performance standards, and termination conditions</li>
                    <li><strong>Data Privacy Policy:</strong> Specific data collection and processing terms for delivery partners</li>
                    <li><strong>Earnings Agreement:</strong> Detailed compensation structure, payment terms, and tax obligations</li>
                    <li><strong>Liability & Insurance Coverage:</strong> Insurance requirements and liability limitations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/dispatch-partner-terms")}
                className="flex-1"
              >
                View Dispatch Partner Terms
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/delivery/apply")}
                className="flex-1"
              >
                Apply to Become Partner
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reward Sharing and Community Programs */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Community Reward Sharing & Pioneer Badge Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Eloity operates community-building programs that automatically share platform
              rewards and recognize early active users through our Pioneer Badge system.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-3">Automatic Reward Sharing System</h4>
              <div className="text-sm text-purple-700 space-y-2">
                <p>
                  <strong>How it works:</strong> When users earn rewards from creator economy activities
                  (content creation, engagement, ad revenue, challenges, etc.), 0.5% of these earnings
                  are automatically shared with their verified referrals as part of our community growth initiative.
                </p>
                <p>
                  <strong>Scope:</strong> This system applies only to "Rewards Page" earnings from platform
                  activities. Personal earnings from freelance work, marketplace sales, crypto trading,
                  and direct transactions are excluded.
                </p>
                <p>
                  <strong>Legal basis:</strong> By using Eloity's platform, users consent to this automatic
                  sharing mechanism. The system is transparent, clearly disclosed, and designed to foster
                  community growth and loyalty.
                </p>
                <p>
                  <strong>User rights:</strong> Users can view their sharing history, amounts shared and
                  received through their referral dashboard. Sharing transactions are logged and auditable.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">Pioneer Badge Program</h4>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>
                  <strong>Program overview:</strong> The first 500 genuinely active users on Eloity
                  are eligible to earn a Pioneer Badge, recognizing their role in building our community.
                </p>
                <p>
                  <strong>Eligibility criteria:</strong> Users must demonstrate real engagement through
                  account age (minimum 7 days), active sessions (minimum 10), content creation (minimum 3 posts),
                  quality session time (5+ minutes average), and community participation (10+ interactions).
                </p>
                <p>
                  <strong>Anti-abuse measures:</strong> The system includes sophisticated fraud detection
                  to ensure badges are awarded only to legitimate, active community members, not bots or abusive accounts.
                </p>
                <p>
                  <strong>Badge benefits:</strong> Pioneer Badge holders receive recognition in the community
                  and may be eligible for special features or programs as the platform evolves.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Important Legal Notes</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Both programs are integral parts of Eloity's Terms of Service</li>
                <li>Participation is automatic for all users; explicit opt-out mechanisms are not provided</li>
                <li>Reward sharing percentages and pioneer badge criteria may be updated with notice</li>
                <li>All transactions are recorded and can be audited for compliance and transparency</li>
                <li>Programs are designed to comply with applicable laws in all operating jurisdictions</li>
                <li>Users retain rights to their primary earnings; only the specified small percentage is shared</li>
              </ul>
            </div>

            <Alert className="border-blue-200">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Transparency Notice:</strong> These community programs are clearly disclosed throughout
                the platform. Users can view detailed information about reward sharing in their referral dashboard
                and pioneer badge eligibility in their rewards section. Full program details are available in our
                comprehensive Terms of Service.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Support & Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              For questions about our legal documentation or specific legal concerns:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">General Legal Inquiries</h4>
                <p><strong>Email:</strong> legal@eloity.com</p>
                <p><strong>Response Time:</strong> 5 business days</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dispatch Partner Support</h4>
                <p><strong>Email:</strong> partners@eloity.com</p>
                <p><strong>Response Time:</strong> 4 hours</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Privacy & Data Protection</h4>
                <p><strong>Email:</strong> privacy@eloity.com</p>
                <p><strong>Response Time:</strong> 30 days</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Emergency Support</h4>
                <p><strong>Delivery Partners:</strong> 24/7 helpline in app</p>
                <p><strong>Users:</strong> Critical issues via support portal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>Legal documentation last reviewed: {new Date().toLocaleDateString()}</p>
            <p>All documents are regularly updated to reflect platform changes and legal requirements.</p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => navigate("/delivery/apply")}>
              Apply to Become Driver
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalInformation;
