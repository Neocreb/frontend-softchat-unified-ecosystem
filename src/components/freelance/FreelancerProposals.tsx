import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Clock,
  DollarSign,
  Eye,
  Edit3,
  MessageCircle,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Calendar,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Proposal {
  id: string;
  jobTitle: string;
  client: {
    name: string;
    avatar?: string;
    rating: number;
  };
  budgetProposed: number;
  budgetRange: {
    min: number;
    max: number;
  };
  timeline: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "withdrawn";
  submittedAt: Date;
  coverLetter: string;
  attachments?: string[];
  responseTime?: string;
}

const mockProposals: Proposal[] = [
  {
    id: "1",
    jobTitle: "E-commerce Website Development",
    client: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      rating: 4.9,
    },
    budgetProposed: 3500,
    budgetRange: { min: 3000, max: 5000 },
    timeline: "6 weeks",
    status: "pending",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    coverLetter: "I'm excited to help you build your e-commerce platform...",
    responseTime: "Response within 24 hours",
  },
  {
    id: "2",
    jobTitle: "Mobile App UI/UX Design",
    client: {
      name: "Marcus Chen",
      avatar: "/api/placeholder/40/40",
      rating: 4.7,
    },
    budgetProposed: 2200,
    budgetRange: { min: 2000, max: 3000 },
    timeline: "4 weeks",
    status: "reviewed",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    coverLetter: "With over 5 years of experience in mobile UI/UX design...",
    responseTime: "Response within 12 hours",
  },
  {
    id: "3",
    jobTitle: "WordPress Website Redesign",
    client: {
      name: "Emily Davis",
      avatar: "/api/placeholder/40/40",
      rating: 4.8,
    },
    budgetProposed: 1800,
    budgetRange: { min: 1500, max: 2500 },
    timeline: "3 weeks",
    status: "accepted",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    coverLetter: "I specialize in WordPress development and would love to help...",
  },
  {
    id: "4",
    jobTitle: "Logo Design for Tech Startup",
    client: {
      name: "David Wilson",
      avatar: "/api/placeholder/40/40",
      rating: 4.6,
    },
    budgetProposed: 800,
    budgetRange: { min: 500, max: 1000 },
    timeline: "2 weeks",
    status: "rejected",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    coverLetter: "I'm a professional graphic designer with expertise in...",
  },
];

export const FreelancerProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const getStatusColor = (status: Proposal["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "withdrawn":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: Proposal["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reviewed":
        return <Eye className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "withdrawn":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {proposal.jobTitle}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={proposal.client.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {proposal.client.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">
                  {proposal.client.name}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500">{proposal.client.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusColor(proposal.status)} font-medium flex items-center gap-1`}>
              {getStatusIcon(proposal.status)}
              {proposal.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedProposal(proposal)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Proposal
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Your Bid</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                ${proposal.budgetProposed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Timeline</p>
              <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                {proposal.timeline}
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Cover Letter Preview</p>
            <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
              {proposal.coverLetter}
            </p>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Submitted {formatDate(proposal.submittedAt)}
            </div>
            {proposal.responseTime && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                {proposal.responseTime}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const statsData = {
    totalProposals: proposals.length,
    pending: proposals.filter(p => p.status === "pending").length,
    accepted: proposals.filter(p => p.status === "accepted").length,
    responseRate: Math.round((proposals.filter(p => p.status !== "pending").length / proposals.length) * 100),
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.totalProposals}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{statsData.pending}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{statsData.accepted}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{statsData.responseRate}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Proposals</h2>
          <p className="text-gray-600 dark:text-gray-400">Track all your submitted proposals</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== "all" ? "No proposals found" : "No proposals yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Start applying to jobs to see your proposals here"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button>
                Browse Jobs
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Proposal Details Modal would go here */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedProposal.jobTitle}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProposal(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedProposal.client.avatar} />
                    <AvatarFallback>{selectedProposal.client.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedProposal.client.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedProposal.client.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your Bid</p>
                    <p className="text-xl font-bold">${selectedProposal.budgetProposed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Timeline</p>
                    <p className="text-xl font-bold">{selectedProposal.timeline}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cover Letter</p>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {selectedProposal.coverLetter}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Edit Proposal</Button>
                  <Button>Message Client</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FreelancerProposals;
