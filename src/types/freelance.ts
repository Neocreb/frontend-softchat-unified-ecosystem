export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  timezone: string;
  verified: boolean;
  joinedDate: string;
}

export interface FreelancerProfile extends User {
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  rating: number;
  totalEarned: number;
  completedJobs: number;
  successRate: number;
  languages: string[];
  education: Education[];
  certifications: Certification[];
  portfolio: PortfolioItem[];
  availability: "available" | "busy" | "unavailable";
  responseTime: string; // e.g., "within 1 hour"
}

export interface ClientProfile extends User {
  companyName?: string;
  totalSpent: number;
  jobsPosted: number;
  hireRate: number;
  rating: number;
  paymentVerified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  budget: {
    type: "fixed" | "hourly";
    min?: number;
    max?: number;
    amount?: number;
  };
  deadline: string;
  duration: string; // e.g., "1-3 months"
  experienceLevel: "entry" | "intermediate" | "expert";
  skills: string[];
  client: ClientProfile;
  proposals: Proposal[];
  status: "open" | "in-progress" | "completed" | "cancelled";
  postedDate: string;
  applicationsCount: number;
  visibility: "public" | "invite-only";
  attachments?: string[];
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancer: FreelancerProfile;
  coverLetter: string;
  proposedRate: {
    type: "fixed" | "hourly";
    amount: number;
  };
  deliveryTime: string;
  milestones?: Milestone[];
  attachments?: string[];
  submittedDate: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
}

export interface Project {
  id: string;
  job: JobPosting;
  freelancer: FreelancerProfile;
  client: ClientProfile;
  status: "active" | "completed" | "cancelled" | "disputed";
  startDate: string;
  endDate?: string;
  budget: {
    agreed: number;
    paid: number;
    remaining: number;
  };
  milestones: Milestone[];
  timeline: TimelineEvent[];
  files: ProjectFile[];
  messages: Message[];
  rating?: {
    clientToFreelancer?: Rating;
    freelancerToClient?: Rating;
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "pending" | "in-progress" | "submitted" | "approved" | "paid";
  deliverables?: string[];
  submittedDate?: string;
  approvedDate?: string;
}

export interface TimelineEvent {
  id: string;
  type:
    | "milestone_created"
    | "milestone_submitted"
    | "milestone_approved"
    | "payment_released"
    | "message_sent"
    | "file_uploaded";
  description: string;
  timestamp: string;
  actor: User;
  metadata?: any;
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: User;
  uploadedDate: string;
  version: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  type: "text" | "file" | "milestone" | "payment";
}

export interface Rating {
  overall: number;
  communication: number;
  quality: number;
  timeline: number;
  comment?: string;
  date: string;
}

export interface FreelanceStats {
  totalEarnings: number;
  activeProjects: number;
  completedProjects: number;
  clientSatisfaction: number;
  onTimeDelivery: number;
  repeatClients: number;
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  budgetMin?: number;
  budgetMax?: number;
  experienceLevel?: string[];
  skills?: string[];
  location?: string;
  availability?: string;
  rating?: number;
  sortBy?: "relevance" | "newest" | "budget" | "deadline" | "proposals";
}

export interface NotificationPreferences {
  newJobs: boolean;
  proposals: boolean;
  messages: boolean;
  payments: boolean;
  milestones: boolean;
  projectUpdates: boolean;
}
