import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  client: {
    name: string;
    avatar: string;
    rating: number;
    location: string;
  };
  budget: {
    min: number;
    max: number;
    type: "fixed" | "hourly";
  };
  skills: string[];
  postedTime: string;
  proposalsCount: number;
  isUrgent?: boolean;
  isVerified?: boolean;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "React Developer for E-commerce Platform",
    client: {
      name: "TechStart Inc.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechStart",
      rating: 4.9,
      location: "USA",
    },
    budget: { min: 50, max: 80, type: "hourly" },
    skills: ["React", "TypeScript", "Node.js"],
    postedTime: "2 hours ago",
    proposalsCount: 3,
    isUrgent: true,
    isVerified: true,
  },
  {
    id: "2",
    title: "UI/UX Design for Mobile App",
    client: {
      name: "Design Studio",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Design",
      rating: 4.7,
      location: "UK",
    },
    budget: { min: 1500, max: 3000, type: "fixed" },
    skills: ["Figma", "UI Design", "Mobile"],
    postedTime: "5 hours ago",
    proposalsCount: 8,
    isVerified: true,
  },
  {
    id: "3",
    title: "Content Writer for Tech Blog",
    client: {
      name: "TechNews",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechNews",
      rating: 4.8,
      location: "Canada",
    },
    budget: { min: 30, max: 50, type: "hourly" },
    skills: ["Content Writing", "SEO", "Tech"],
    postedTime: "1 day ago",
    proposalsCount: 15,
  },
];

const FeedJobRecommendations = () => {
  const navigate = useNavigate();

  const handleJobClick = (jobId: string) => {
    navigate(`/app/freelance/job/${jobId}`);
  };

  const handleViewAllJobs = () => {
    navigate("/app/freelance");
  };

  return (
    <Card className="w-full bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended Jobs for You
              </h3>
              <p className="text-sm text-gray-600">
                Based on your skills and activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">Hot</span>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-3">
          {mockJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => handleJobClick(job.id)}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {job.title}
                    </h4>
                    {job.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={job.client.avatar} />
                        <AvatarFallback className="text-xs">
                          {job.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{job.client.name}</span>
                      {job.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{job.client.rating}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.client.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">
                        ${job.budget.min}-${job.budget.max}
                        {job.budget.type === "hourly" ? "/hr" : " fixed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.postedTime}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.proposalsCount} proposals</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-orange-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-orange-600">12 new jobs</span>{" "}
            match your profile
          </div>
          <Button
            onClick={handleViewAllJobs}
            variant="outline"
            size="sm"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            View All Jobs
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedJobRecommendations;
