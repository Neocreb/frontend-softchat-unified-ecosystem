import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFreelanceWallet } from "@/hooks/use-freelance-wallet";
import { useToast } from "@/components/ui/use-toast";
import {
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";

interface FreelanceProject {
  id: string;
  title: string;
  client: string;
  amount: number;
  status: "pending" | "in-progress" | "completed" | "paid";
  progress: number;
  dueDate: string;
}

const FreelanceWalletCard = () => {
  const {
    freelanceBalance,
    freelanceTransactions,
    freelanceStats,
    earningsThisMonth,
    activeProjectsCount,
  } = useFreelanceWallet();
  const { toast } = useToast();

  // Mock freelance projects data
  const [projects] = useState<FreelanceProject[]>([
    {
      id: "1",
      title: "E-commerce Website Design",
      client: "TechCorp Inc.",
      amount: 2500,
      status: "in-progress",
      progress: 75,
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      title: "Mobile App UI/UX",
      client: "StartupXYZ",
      amount: 1800,
      status: "pending",
      progress: 0,
      dueDate: "2024-02-20",
    },
    {
      id: "3",
      title: "Brand Identity Package",
      client: "Creative Agency",
      amount: 1200,
      status: "completed",
      progress: 100,
      dueDate: "2024-01-30",
    },
  ]);

  const pendingEarnings = projects
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeProjects = projects.filter(
    (p) => p.status === "in-progress",
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Feature",
      description: "This will open the withdrawal modal for freelance earnings",
    });
  };

  return (
    <div className="space-y-6">
      {/* Freelance Wallet Overview */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  Freelance Earnings
                </CardTitle>
                <p className="text-indigo-100 text-sm">
                  Professional services income
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${freelanceBalance.toFixed(2)}
              </div>
              <p className="text-indigo-100 text-sm">Available</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-green-50">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-green-700">
                ${pendingEarnings}
              </div>
              <div className="text-xs text-green-600">Pending Payment</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-blue-700">
                {activeProjects}
              </div>
              <div className="text-xs text-blue-600">Active Projects</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-purple-700">
                {freelanceTransactions.length}
              </div>
              <div className="text-xs text-purple-600">Transactions</div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleWithdraw}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw Earnings
          </Button>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.client}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${project.amount}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(project.status)}`}
                  >
                    {project.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900 font-medium">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                <span>
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </span>
                {project.status === "completed" && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Ready for payment
                  </div>
                )}
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active projects</p>
              <p className="text-sm text-gray-400 mt-1">
                Start taking on freelance work to see projects here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Freelance Transactions */}
      {freelanceTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {freelanceTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      +${transaction.amount.toFixed(2)}
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(transaction.status)}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FreelanceWalletCard;
