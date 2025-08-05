import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Home,
  Users,
  UserCheck,
  Briefcase,
} from "lucide-react";

export const FreelanceDashboardRouteTest: React.FC = () => {
  const location = useLocation();

  const testRoutes = [
    {
      path: "/app/freelance",
      label: "Freelance Hub",
      description: "Main freelance marketplace",
      icon: Briefcase,
    },
    {
      path: "/app/freelance/dashboard",
      label: "Unified Dashboard",
      description: "New professional dashboard",
      icon: Home,
    },
    {
      path: "/app/freelance/dashboard/freelancer",
      label: "Freelancer View",
      description: "Freelancer-specific dashboard",
      icon: Users,
    },
    {
      path: "/app/freelance/dashboard/client",
      label: "Client View", 
      description: "Client-specific dashboard",
      icon: UserCheck,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Freelance Dashboard Route Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Current Route
              </h3>
              <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded">
                {location.pathname}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testRoutes.map((route) => (
                <Card key={route.path} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <route.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {route.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {route.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" asChild>
                            <Link to={route.path}>
                              Test Route
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                          {location.pathname === route.path && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Route Fix Applied
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Added UnifiedFreelanceDashboard to route mapping</li>
                <li>• Created additional routes for freelancer/client views</li>
                <li>• Added DashboardRouteGuard for error handling</li>
                <li>• Added legacy route redirects for compatibility</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Route Structure
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-mono space-y-1">
                <div>/app/freelance - Main freelance hub</div>
                <div>/app/freelance/dashboard - Unified dashboard (new)</div>
                <div>/app/freelance/dashboard/freelancer - Freelancer view</div>
                <div>/app/freelance/dashboard/client - Client view</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelanceDashboardRouteTest;
