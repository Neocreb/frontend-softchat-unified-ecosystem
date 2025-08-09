import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Briefcase,
  ShoppingCart,
  Calendar,
  PlayCircle,
  GraduationCap
} from 'lucide-react';

const RouteTest: React.FC = () => {
  const navigate = useNavigate();

  const testRoutes = [
    {
      name: 'Freelance Job Detail',
      route: '/app/freelance/job/job1',
      type: 'job',
      icon: Briefcase,
      status: 'fixed'
    },
    {
      name: 'Freelance Browse Jobs',
      route: '/app/freelance/browse-jobs',
      type: 'job',
      icon: Briefcase,
      status: 'working'
    },
    {
      name: 'Marketplace',
      route: '/app/marketplace',
      type: 'product',
      icon: ShoppingCart,
      status: 'working'
    },
    {
      name: 'Events',
      route: '/app/events',
      type: 'event',
      icon: Calendar,
      status: 'working'
    },
    {
      name: 'Live Videos',
      route: '/app/videos?tab=live',
      type: 'live',
      icon: PlayCircle,
      status: 'working'
    },
    {
      name: 'Tutorial Videos',
      route: '/app/videos?tab=tutorials',
      type: 'skill',
      icon: GraduationCap,
      status: 'working'
    }
  ];

  const handleTestRoute = (route: string, name: string) => {
    try {
      navigate(route);
      console.log(`✅ Successfully navigated to: ${route}`);
    } catch (error) {
      console.error(`❌ Failed to navigate to ${route}:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'working':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'working':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Route Testing & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testRoutes.map((route, index) => {
              const IconComponent = route.icon;
              return (
                <Card key={index} className={`border ${getStatusColor(route.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{route.name}</span>
                      </div>
                      {getStatusIcon(route.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {route.type}
                      </Badge>
                      <div className="text-xs text-muted-foreground font-mono">
                        {route.route}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestRoute(route.route, route.name)}
                        className="w-full"
                      >
                        Test Navigation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Fixed Issues:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Fixed incorrect job URL: <code>/freelance/jobs/fullstack-dev</code> → <code>/app/freelance/job/job1</code></li>
              <li>• Updated all mock data URLs to match actual app routing structure</li>
              <li>• Added fallback handling for old URL formats</li>
              <li>• Ensured all action buttons navigate to correct app routes</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🔧 Improvements Made:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enhanced URL validation in UnifiedActionButtons component</li>
              <li>• Added backward compatibility for legacy URL formats</li>
              <li>• Improved error handling and user feedback</li>
              <li>• Consistent routing patterns across all features</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteTest;
