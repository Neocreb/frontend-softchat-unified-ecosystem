import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  HelpCircle,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface OnboardingTourProps {
  userType: "freelancer" | "client";
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  userType,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const freelancerSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Freelance Hub!",
      content: "Let's take a quick tour to help you get started with managing your freelance business effectively.",
      target: "overview-tab",
      position: "bottom",
    },
    {
      id: "overview",
      title: "Dashboard Overview",
      content: "This is your command center. See your earnings, active projects, and performance metrics at a glance.",
      target: "overview-content",
      position: "top",
    },
    {
      id: "projects",
      title: "Manage Your Projects",
      content: "Track all your active and completed projects. Monitor progress, deadlines, and communicate with clients.",
      target: "projects-tab",
      position: "bottom",
    },
    {
      id: "proposals",
      title: "Proposals & Applications",
      content: "Keep track of all the job proposals you've submitted and their current status.",
      target: "proposals-tab",
      position: "bottom",
    },
    {
      id: "earnings",
      title: "Track Your Earnings",
      content: "Monitor your income, payment history, and financial analytics to grow your business.",
      target: "earnings-tab",
      position: "bottom",
    },
    {
      id: "campaigns",
      title: "Boost Your Profile",
      content: "Create campaigns to promote your services and attract more clients to your profile.",
      target: "campaigns-tab",
      position: "bottom",
    },
    {
      id: "customization",
      title: "Customize Your Dashboard",
      content: "Make this dashboard truly yours! Rearrange widgets, resize them, and show only what matters to you.",
      target: "customize-button",
      position: "left",
      action: {
        text: "Try Customizing",
        onClick: () => {
          // Trigger customization mode
          const customizeBtn = document.querySelector('[data-testid="customize-button"]') as HTMLButtonElement;
          customizeBtn?.click();
        },
      },
    },
    {
      id: "complete",
      title: "You're All Set!",
      content: "You're ready to start managing your freelance business. Need help anytime? Look for the help icons throughout the platform.",
      target: "overview-tab",
      position: "bottom",
    },
  ];

  const clientSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Client Dashboard!",
      content: "Let's explore how to effectively manage your projects and find the best freelancers.",
      target: "overview-tab",
      position: "bottom",
    },
    {
      id: "overview",
      title: "Dashboard Overview",
      content: "Your central hub for monitoring projects, spending, and freelancer performance.",
      target: "overview-content",
      position: "top",
    },
    {
      id: "projects",
      title: "Project Management",
      content: "Monitor all your active projects, track progress, and communicate with your freelancers.",
      target: "projects-tab",
      position: "bottom",
    },
    {
      id: "manage",
      title: "Post Jobs & Find Talent",
      content: "Create new job postings and browse our marketplace to find the perfect freelancers for your projects.",
      target: "manage-tab",
      position: "bottom",
    },
    {
      id: "proposals",
      title: "Review Proposals",
      content: "Evaluate proposals from freelancers, compare their skills, and make informed hiring decisions.",
      target: "proposals-tab",
      position: "bottom",
    },
    {
      id: "complete",
      title: "Ready to Hire!",
      content: "You're all set to start posting jobs and working with talented freelancers. Good luck with your projects!",
      target: "overview-tab",
      position: "bottom",
    },
  ];

  const steps = userType === "freelancer" ? freelancerSteps : clientSteps;
  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isOpen && currentStepData) {
      setHighlightedElement(currentStepData.target);
      
      // Scroll to highlighted element
      const element = document.querySelector(`[data-testid="${currentStepData.target}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, isOpen, currentStepData]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setHighlightedElement(null);
    onComplete();
    onClose();
  };

  const skipTour = () => {
    setHighlightedElement(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Highlight overlay */}
      {highlightedElement && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--highlight-x, 50%) var(--highlight-y, 50%), transparent 100px, rgba(0,0,0,0.5) 200px)`,
          }}
        />
      )}

      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="z-[60] max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                {currentStepData?.title}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={skipTour}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              {currentStepData?.content}
            </p>

            {currentStepData?.action && (
              <Button
                variant="outline"
                onClick={currentStepData.action.onClick}
                className="w-full"
              >
                {currentStepData.action.text}
              </Button>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button onClick={skipTour} variant="ghost" size="sm">
                Skip Tour
              </Button>

              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Contextual Help Component
interface ContextualHelpProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  content,
  children,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-300 mt-1">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Help Center Component
export const HelpCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpTopics = [
    {
      icon: Target,
      title: "Getting Started",
      description: "Learn the basics of using the platform",
      items: ["Setting up your profile", "Finding your first job", "Creating proposals"],
    },
    {
      icon: DollarSign,
      title: "Payments & Earnings",
      description: "Understanding how payments work",
      items: ["Payment methods", "Escrow system", "Tax information"],
    },
    {
      icon: Users,
      title: "Working with Clients",
      description: "Best practices for client relationships",
      items: ["Communication tips", "Managing expectations", "Handling disputes"],
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Understanding your performance data",
      items: ["Reading your dashboard", "Performance metrics", "Earnings reports"],
    },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-40"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Help Center
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <topic.icon className="w-5 h-5 text-blue-600" />
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {topic.description}
                  </p>
                  <ul className="space-y-1">
                    {topic.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-blue-600 hover:underline cursor-pointer">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Need more help? <Button variant="link" className="p-0 h-auto text-blue-600">Contact our support team</Button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Empty State with Guidance
interface EmptyStateGuidanceProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }>;
}

export const EmptyStateGuidance: React.FC<EmptyStateGuidanceProps> = ({
  icon: Icon,
  title,
  description,
  actions,
}) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-12 text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingTour;
