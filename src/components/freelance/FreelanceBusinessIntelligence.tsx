import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  Calculator,
  Users,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Lightbulb,
  Zap,
  Brain,
  Shield,
  Activity,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RateNegotiationData {
  suggestedRate: number;
  marketAverage: number;
  yourCurrentRate: number;
  skillPremium: number;
  experiencePremium: number;
  locationAdjustment: number;
  demandFactor: number;
  negotiationTips: string[];
}

interface ProjectTimelineEstimate {
  projectType: string;
  complexity: "simple" | "medium" | "complex";
  estimatedDays: number;
  confidenceLevel: number;
  factorsConsidered: string[];
  milestoneBreakdown: Array<{
    phase: string;
    days: number;
    description: string;
  }>;
  riskFactors: Array<{
    factor: string;
    impact: number;
    mitigation: string;
  }>;
}

interface RiskAssessment {
  overallRisk: "low" | "medium" | "high";
  successProbability: number;
  riskFactors: Array<{
    category: string;
    level: "low" | "medium" | "high";
    impact: number;
    description: string;
    mitigation: string[];
  }>;
  recommendations: string[];
}

interface ROICalculation {
  projectCost: number;
  estimatedValue: number;
  roi: number;
  breakEvenTime: number;
  valueFactors: Array<{
    factor: string;
    value: number;
    description: string;
  }>;
  alternativeOptions: Array<{
    option: string;
    cost: number;
    roi: number;
    pros: string[];
    cons: string[];
  }>;
}

interface CapacityPlanning {
  freelancerId: string;
  currentUtilization: number;
  availableHours: number;
  upcomingCommitments: Array<{
    projectName: string;
    hoursCommitted: number;
    deadline: string;
    priority: "low" | "medium" | "high";
  }>;
  recommendations: string[];
  optimalProjectSize: number;
}

const mockMarketData = [
  { skill: "React", avgRate: 85, demand: 95 },
  { skill: "Node.js", avgRate: 80, demand: 90 },
  { skill: "Python", avgRate: 75, demand: 85 },
  { skill: "AWS", avgRate: 95, demand: 88 },
  { skill: "TypeScript", avgRate: 90, demand: 82 },
];

const rateHistoryData = [
  { month: "Jan", rate: 75, market: 78 },
  { month: "Feb", rate: 78, market: 80 },
  { month: "Mar", rate: 80, market: 82 },
  { month: "Apr", rate: 85, market: 85 },
  { month: "May", rate: 85, market: 88 },
  { month: "Jun", rate: 90, market: 90 },
];

const projectComplexityData = [
  { complexity: "Simple", avgDays: 15, projects: 45 },
  { complexity: "Medium", avgDays: 35, projects: 32 },
  { complexity: "Complex", avgDays: 65, projects: 23 },
];

export const FreelanceBusinessIntelligence: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState("React");
  const [projectBudget, setProjectBudget] = useState(15000);
  const [projectComplexity, setProjectComplexity] = useState("medium");
  const [rateNegotiation, setRateNegotiation] =
    useState<RateNegotiationData | null>(null);
  const [timelineEstimate, setTimelineEstimate] =
    useState<ProjectTimelineEstimate | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(
    null,
  );
  const [roiCalculation, setROICalculation] = useState<ROICalculation | null>(
    null,
  );
  const [capacityPlanning, setCapacityPlanning] =
    useState<CapacityPlanning | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadBusinessIntelligenceData();
  }, [selectedSkill, projectBudget, projectComplexity]);

  const loadBusinessIntelligenceData = async () => {
    // Simulate API calls - replace with actual service calls
    const mockRateNegotiation: RateNegotiationData = {
      suggestedRate: 92,
      marketAverage: 85,
      yourCurrentRate: 80,
      skillPremium: 8,
      experiencePremium: 12,
      locationAdjustment: -3,
      demandFactor: 15,
      negotiationTips: [
        "Highlight your expertise in modern React patterns",
        "Mention your track record of on-time delivery",
        "Emphasize your communication skills and availability",
        "Reference similar projects you've completed successfully",
      ],
    };

    const mockTimelineEstimate: ProjectTimelineEstimate = {
      projectType: "E-commerce Platform",
      complexity: projectComplexity as any,
      estimatedDays:
        projectComplexity === "simple"
          ? 25
          : projectComplexity === "medium"
            ? 45
            : 75,
      confidenceLevel: 87,
      factorsConsidered: [
        "Similar project history",
        "Technology stack complexity",
        "Team size and experience",
        "Client requirements clarity",
      ],
      milestoneBreakdown: [
        {
          phase: "Planning & Setup",
          days: 5,
          description: "Project setup, requirements analysis",
        },
        {
          phase: "Core Development",
          days: 25,
          description: "Main feature implementation",
        },
        {
          phase: "Integration & Testing",
          days: 10,
          description: "API integration, testing",
        },
        {
          phase: "Polish & Delivery",
          days: 5,
          description: "Bug fixes, final touches",
        },
      ],
      riskFactors: [
        {
          factor: "Scope creep",
          impact: 15,
          mitigation: "Clear requirements documentation",
        },
        {
          factor: "Third-party delays",
          impact: 10,
          mitigation: "Buffer time in schedule",
        },
      ],
    };

    const mockRiskAssessment: RiskAssessment = {
      overallRisk: "medium",
      successProbability: 82,
      riskFactors: [
        {
          category: "Technical",
          level: "medium",
          impact: 25,
          description: "Complex integrations required",
          mitigation: [
            "Prototype early",
            "Use proven libraries",
            "Plan for testing",
          ],
        },
        {
          category: "Timeline",
          level: "medium",
          impact: 20,
          description: "Tight deadline constraints",
          mitigation: [
            "Add buffer time",
            "Prioritize core features",
            "Parallel development",
          ],
        },
        {
          category: "Communication",
          level: "low",
          impact: 10,
          description: "Remote team coordination",
          mitigation: [
            "Daily standups",
            "Clear documentation",
            "Communication tools",
          ],
        },
      ],
      recommendations: [
        "Start with a detailed technical discovery phase",
        "Set up automated testing from day one",
        "Schedule regular client check-ins",
        "Keep a project risk register updated",
      ],
    };

    const mockROICalculation: ROICalculation = {
      projectCost: projectBudget,
      estimatedValue: projectBudget * 2.5,
      roi: 150,
      breakEvenTime: 8,
      valueFactors: [
        {
          factor: "Revenue Generation",
          value: projectBudget * 1.5,
          description: "Direct sales increase",
        },
        {
          factor: "Cost Savings",
          value: projectBudget * 0.8,
          description: "Process automation",
        },
        {
          factor: "Brand Value",
          value: projectBudget * 0.2,
          description: "Improved user experience",
        },
      ],
      alternativeOptions: [
        {
          option: "In-house Development",
          cost: projectBudget * 1.5,
          roi: 80,
          pros: ["Full control", "Internal knowledge"],
          cons: ["Higher cost", "Longer timeline", "Requires hiring"],
        },
        {
          option: "Template Solution",
          cost: projectBudget * 0.3,
          roi: 50,
          pros: ["Lower cost", "Quick setup"],
          cons: ["Limited customization", "Generic features"],
        },
      ],
    };

    const mockCapacityPlanning: CapacityPlanning = {
      freelancerId: "current-user",
      currentUtilization: 75,
      availableHours: 20,
      upcomingCommitments: [
        {
          projectName: "E-commerce Platform",
          hoursCommitted: 120,
          deadline: "2024-02-15",
          priority: "high",
        },
        {
          projectName: "Mobile App UI",
          hoursCommitted: 80,
          deadline: "2024-02-28",
          priority: "medium",
        },
        {
          projectName: "Website Redesign",
          hoursCommitted: 40,
          deadline: "2024-03-10",
          priority: "low",
        },
      ],
      recommendations: [
        "You have capacity for 1 small project (20-30 hours)",
        "Consider declining large projects until March",
        "Schedule time for business development activities",
      ],
      optimalProjectSize: 25,
    };

    setRateNegotiation(mockRateNegotiation);
    setTimelineEstimate(mockTimelineEstimate);
    setRiskAssessment(mockRiskAssessment);
    setROICalculation(mockROICalculation);
    setCapacityPlanning(mockCapacityPlanning);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Business Intelligence Dashboard
          </h2>
          <p className="text-muted-foreground">
            Data-driven insights for better decision making
          </p>
        </div>
      </div>

      <Tabs defaultValue="rates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rates">Rate Negotiation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Estimator</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Rate Negotiation Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skill-select">Select Skill</Label>
                  <select
                    id="skill-select"
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    {mockMarketData.map((skill) => (
                      <option key={skill.skill} value={skill.skill}>
                        {skill.skill}
                      </option>
                    ))}
                  </select>
                </div>

                {rateNegotiation && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${rateNegotiation.suggestedRate}
                        </div>
                        <div className="text-sm text-blue-700">
                          Suggested Rate
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">
                          ${rateNegotiation.marketAverage}
                        </div>
                        <div className="text-sm text-gray-700">
                          Market Average
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          +
                          {rateNegotiation.suggestedRate -
                            rateNegotiation.yourCurrentRate}
                        </div>
                        <div className="text-sm text-green-700">
                          Potential Increase
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Rate Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Base Rate</span>
                          <span>${rateNegotiation.yourCurrentRate}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Skill Premium</span>
                          <span>+${rateNegotiation.skillPremium}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Experience Premium</span>
                          <span>+${rateNegotiation.experiencePremium}</span>
                        </div>
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>Demand Factor</span>
                          <span>+${rateNegotiation.demandFactor}</span>
                        </div>
                        {rateNegotiation.locationAdjustment !== 0 && (
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Location Adjustment</span>
                            <span>{rateNegotiation.locationAdjustment}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Negotiation Tips</h4>
                      <ul className="space-y-1">
                        {rateNegotiation.negotiationTips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rateHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#8884d8"
                      name="Your Rate"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="market"
                      stroke="#82ca9d"
                      name="Market Average"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Project Timeline Estimator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="complexity">Project Complexity</Label>
                  <select
                    id="complexity"
                    className="w-full mt-1 p-2 border rounded-md"
                    value={projectComplexity}
                    onChange={(e) => setProjectComplexity(e.target.value)}
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </select>
                </div>

                {timelineEstimate && (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {timelineEstimate.estimatedDays} days
                      </div>
                      <div className="text-sm text-blue-700">
                        Estimated Timeline ({timelineEstimate.confidenceLevel}%
                        confidence)
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Milestone Breakdown</h4>
                      <div className="space-y-2">
                        {timelineEstimate.milestoneBreakdown.map(
                          (milestone, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center p-2 border rounded"
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {milestone.phase}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {milestone.description}
                                </div>
                              </div>
                              <Badge variant="outline">
                                {milestone.days} days
                              </Badge>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Risk Factors</h4>
                      {timelineEstimate.riskFactors.map((risk, i) => (
                        <div key={i} className="p-2 border rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{risk.factor}</span>
                            <Badge variant="outline">
                              +{risk.impact}% risk
                            </Badge>
                          </div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {risk.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Complexity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectComplexityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="complexity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgDays" fill="#8884d8" name="Avg Days" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {riskAssessment && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Risk Assessment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getRiskColor(riskAssessment.overallRisk)}`}
                    >
                      {riskAssessment.overallRisk.toUpperCase()} RISK
                    </div>
                    <div className="mt-2 text-2xl font-bold text-green-600">
                      {riskAssessment.successProbability}% Success Rate
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Risk Factors</h4>
                    {riskAssessment.riskFactors.map((risk, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{risk.category}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getRiskColor(risk.level)}>
                              {risk.level}
                            </Badge>
                            <span className="text-sm">
                              {risk.impact}% impact
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {risk.description}
                        </p>
                        <div className="text-xs">
                          <strong>Mitigation:</strong>
                          <ul className="mt-1 space-y-1">
                            {risk.mitigation.map((m, j) => (
                              <li key={j} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Mitigation Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Recommended Actions</h4>
                    {riskAssessment.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Risk Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={riskAssessment.riskFactors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, impact }) =>
                            `${category}: ${impact}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="impact"
                        >
                          {riskAssessment.riskFactors.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget">Project Budget ($)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[projectBudget]}
                      onValueChange={(value) => setProjectBudget(value[0])}
                      max={50000}
                      min={1000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>$1,000</span>
                      <span className="font-medium">
                        ${projectBudget.toLocaleString()}
                      </span>
                      <span>$50,000</span>
                    </div>
                  </div>
                </div>

                {roiCalculation && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {roiCalculation.roi}%
                        </div>
                        <div className="text-sm text-green-700">ROI</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {roiCalculation.breakEvenTime}
                        </div>
                        <div className="text-sm text-blue-700">
                          Months to Break Even
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Value Breakdown</h4>
                      {roiCalculation.valueFactors.map((factor, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-2 border rounded mb-2"
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {factor.factor}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {factor.description}
                            </div>
                          </div>
                          <span className="font-bold">
                            ${factor.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternative Options</CardTitle>
              </CardHeader>
              <CardContent>
                {roiCalculation && (
                  <div className="space-y-4">
                    {roiCalculation.alternativeOptions.map((option, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{option.option}</h4>
                          <div className="text-right">
                            <div className="font-bold">
                              ${option.cost.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {option.roi}% ROI
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="font-medium text-green-700 mb-1">
                              Pros:
                            </div>
                            {option.pros.map((pro, j) => (
                              <div key={j} className="flex items-start gap-1">
                                <span className="text-green-600">•</span>
                                <span>{pro}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="font-medium text-red-700 mb-1">
                              Cons:
                            </div>
                            {option.cons.map((con, j) => (
                              <div key={j} className="flex items-start gap-1">
                                <span className="text-red-600">•</span>
                                <span>{con}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          {capacityPlanning && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Capacity Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {capacityPlanning.currentUtilization}%
                    </div>
                    <div className="text-sm text-purple-700">
                      Current Utilization
                    </div>
                    <Progress
                      value={capacityPlanning.currentUtilization}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {capacityPlanning.availableHours}h
                      </div>
                      <div className="text-sm text-green-700">
                        Available This Week
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {capacityPlanning.optimalProjectSize}h
                      </div>
                      <div className="text-sm text-blue-700">
                        Optimal Project Size
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    {capacityPlanning.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Commitments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {capacityPlanning.upcomingCommitments.map(
                      (commitment, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-sm">
                              {commitment.projectName}
                            </h4>
                            <Badge
                              variant={
                                commitment.priority === "high"
                                  ? "destructive"
                                  : commitment.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {commitment.priority}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{commitment.hoursCommitted}h committed</span>
                            <span>
                              Due:{" "}
                              {new Date(
                                commitment.deadline,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
