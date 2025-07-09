import React from "react";
import { useFreelanceChat } from "@/hooks/use-chat-integration";
import { FreelanceChatButton } from "@/components/chat/ChatActionButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Briefcase, Clock, DollarSign } from "lucide-react";

interface JobChatIntegrationProps {
  jobId: string;
  jobTitle: string;
  jobBudget?: number;
  clientId: string;
  clientName: string;
  isOwner?: boolean;
  applicationStatus?:
    | "not_applied"
    | "applied"
    | "interviewing"
    | "hired"
    | "rejected";
}

export const JobChatIntegration: React.FC<JobChatIntegrationProps> = ({
  jobId,
  jobTitle,
  jobBudget,
  clientId,
  clientName,
  isOwner = false,
  applicationStatus = "not_applied",
}) => {
  const { contactFreelancer, isCreatingChat } = useFreelanceChat();

  const handleContactClient = () => {
    contactFreelancer(clientId, jobId, jobTitle);
  };

  const handleApplyAndChat = () => {
    // This would integrate with application flow and create chat
    contactFreelancer(clientId, jobId, jobTitle);
  };

  const getStatusBadge = () => {
    switch (applicationStatus) {
      case "applied":
        return <Badge variant="outline">Applied</Badge>;
      case "interviewing":
        return <Badge variant="default">Interviewing</Badge>;
      case "hired":
        return (
          <Badge variant="default" className="bg-green-600">
            Hired
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Not Selected</Badge>;
      default:
        return null;
    }
  };

  if (isOwner) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Freelancers can message you about this job
        </div>
        <Button variant="outline" disabled className="w-full">
          <Briefcase className="w-4 h-4 mr-2" />
          Your Job Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status indicator */}
      {applicationStatus !== "not_applied" && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge()}
        </div>
      )}

      {/* Primary action buttons */}
      <div className="space-y-2">
        {applicationStatus === "not_applied" ? (
          <FreelanceChatButton
            jobTitle={jobTitle}
            budget={jobBudget}
            loading={isCreatingChat}
            onClick={handleApplyAndChat}
            className="w-full"
          >
            <Briefcase className="w-4 h-4" />
            Apply & Message Client
          </FreelanceChatButton>
        ) : (
          <FreelanceChatButton
            jobTitle={jobTitle}
            budget={jobBudget}
            variant="outline"
            loading={isCreatingChat}
            onClick={handleContactClient}
            className="w-full"
          >
            <MessageCircle className="w-4 h-4" />
            Message {clientName}
          </FreelanceChatButton>
        )}

        {/* Additional actions based on status */}
        {applicationStatus === "interviewing" && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-1" />
              Schedule Call
            </Button>
            <Button variant="outline" size="sm">
              <DollarSign className="w-4 h-4 mr-1" />
              Send Proposal
            </Button>
          </div>
        )}
      </div>

      {/* Job details summary */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>💼 Discuss project requirements and timeline</div>
        {jobBudget && <div>💰 Budget: ${jobBudget.toLocaleString()}</div>}
      </div>
    </div>
  );
};

// Quick application component for job lists
interface QuickApplyProps {
  jobId: string;
  jobTitle: string;
  clientId: string;
  applied?: boolean;
  compact?: boolean;
}

export const QuickApply: React.FC<QuickApplyProps> = ({
  jobId,
  jobTitle,
  clientId,
  applied = false,
  compact = false,
}) => {
  const { contactFreelancer, isCreatingChat } = useFreelanceChat();

  const handleQuickApply = () => {
    contactFreelancer(clientId, jobId, jobTitle);
  };

  if (compact) {
    return (
      <Button
        variant={applied ? "outline" : "default"}
        size="sm"
        onClick={handleQuickApply}
        disabled={isCreatingChat}
        className="h-8"
      >
        {applied ? (
          <MessageCircle className="w-3 h-3 mr-1" />
        ) : (
          <Briefcase className="w-3 h-3 mr-1" />
        )}
        {applied ? "Message" : "Apply"}
      </Button>
    );
  }

  return (
    <Button
      variant={applied ? "outline" : "default"}
      onClick={handleQuickApply}
      disabled={isCreatingChat}
      className="flex items-center gap-2"
    >
      {applied ? (
        <>
          <MessageCircle className="w-4 h-4" />
          Contact Client
        </>
      ) : (
        <>
          <Briefcase className="w-4 h-4" />
          Apply Now
        </>
      )}
    </Button>
  );
};

// Freelancer profile contact component
interface FreelancerContactProps {
  freelancerId: string;
  freelancerName: string;
  skills: string[];
  hourlyRate?: number;
  compact?: boolean;
}

export const FreelancerContact: React.FC<FreelancerContactProps> = ({
  freelancerId,
  freelancerName,
  skills,
  hourlyRate,
  compact = false,
}) => {
  const { startFreelanceChat, isCreatingChat } = useFreelanceChat();

  const handleContact = () => {
    // Create a generic freelance chat for hiring inquiry
    const jobId = `inquiry_${Date.now()}`;
    const jobTitle = `Freelance Inquiry - ${skills.slice(0, 2).join(", ")}`;
    startFreelanceChat(jobId, freelancerId, jobTitle, hourlyRate);
  };

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleContact}
        disabled={isCreatingChat}
        className="h-8"
      >
        <MessageCircle className="w-3 h-3 mr-1" />
        Hire
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      onClick={handleContact}
      disabled={isCreatingChat}
      className="flex items-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      Contact {freelancerName}
      {hourlyRate && (
        <Badge variant="secondary" className="ml-1">
          ${hourlyRate}/hr
        </Badge>
      )}
    </Button>
  );
};
