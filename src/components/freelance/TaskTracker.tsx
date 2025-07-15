import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  MoreVertical,
  Calendar,
  DollarSign,
  FileText,
  Target,
  TrendingUp,
  MessageCircle,
  Upload,
  Edit,
  Trash2,
  Play,
  Pause,
  Archive,
  Award,
  Timer,
  CheckSquare,
  Flag,
} from "lucide-react";
import { Project, Milestone } from "@/types/freelance";
import { useFreelanceProject } from "@/hooks/use-freelance";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface TaskTrackerProps {
  projectId: string;
  userRole: "client" | "freelancer";
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "blocked" | "review";
  assignedTo: "client" | "freelancer" | "both";
  dueDate?: string;
  completedAt?: string;
  milestoneId?: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  tags?: string[];
  files?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  comments?: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
  }[];
  checklist?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

interface EnhancedMilestone extends Milestone {
  tasks: TaskItem[];
  progress: number;
  estimatedHours: number;
  actualHours: number;
  paymentStatus: "pending" | "escrowed" | "released";
  autoReleaseDate?: string;
  deliverables: {
    id: string;
    title: string;
    description: string;
    fileUrl?: string;
    status: "pending" | "submitted" | "approved" | "rejected";
    feedback?: string;
  }[];
}

export const TaskTracker: React.FC<TaskTrackerProps> = ({
  projectId,
  userRole,
}) => {
  const [milestones, setMilestones] = useState<EnhancedMilestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    null,
  );
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [activeTab, setActiveTab] = useState("milestones");
  const [timeTracking, setTimeTracking] = useState<{
    [taskId: string]: { start: Date; duration: number; active: boolean };
  }>({});
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "freelancer" as TaskItem["assignedTo"],
    dueDate: "",
    priority: "medium" as TaskItem["priority"],
    estimatedHours: 0,
    milestoneId: "",
    tags: [] as string[],
  });
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    amount: 0,
    dueDate: "",
    deliverables: [
      {
        title: "",
        description: "",
      },
    ],
  });

  const { project, loading, updateProjectStatus } =
    useFreelanceProject(projectId);
  const { toast } = useToast();

  // Time tracking functions
  const startTimeTracking = (taskId: string) => {
    setTimeTracking((prev) => ({
      ...prev,
      [taskId]: {
        start: new Date(),
        duration: prev[taskId]?.duration || 0,
        active: true,
      },
    }));
  };

  const stopTimeTracking = (taskId: string) => {
    setTimeTracking((prev) => {
      const current = prev[taskId];
      if (!current?.active) return prev;

      const sessionDuration = Date.now() - current.start.getTime();
      return {
        ...prev,
        [taskId]: {
          ...current,
          duration: current.duration + sessionDuration,
          active: false,
        },
      };
    });
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Task management functions
  const updateTaskStatus = (taskId: string, status: TaskItem["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedAt:
                status === "completed" ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    );

    if (status === "completed") {
      stopTimeTracking(taskId);
      toast({
        title: "Task Completed",
        description: "Great job! Task marked as completed.",
      });
    }
  };

  const addTaskToChecklist = (taskId: string, checklistItem: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              checklist: [
                ...(task.checklist || []),
                {
                  id: `check_${Date.now()}`,
                  title: checklistItem,
                  completed: false,
                },
              ],
            }
          : task,
      ),
    );
  };

  const toggleChecklistItem = (
    taskId: string,
    checklistId: string,
    completed: boolean,
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              checklist: task.checklist?.map((item) =>
                item.id === checklistId ? { ...item, completed } : item,
              ),
            }
          : task,
      ),
    );
  };

  const submitMilestone = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, status: "submitted" }
          : milestone,
      ),
    );

    toast({
      title: "Milestone Submitted",
      description:
        "Milestone has been submitted for client review. You'll be notified when it's approved.",
    });
  };

  const approveMilestone = (milestoneId: string) => {
    if (userRole !== "client") return;

    setMilestones((prev) =>
      prev.map((milestone) =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              status: "approved",
              paymentStatus: "released",
            }
          : milestone,
      ),
    );

    toast({
      title: "Milestone Approved",
      description: "Payment has been released to the freelancer.",
    });
  };

  // Mock milestones and tasks - in real app, these would come from the project data
  useEffect(() => {
    if (project) {
      const mockMilestones: EnhancedMilestone[] = [
        {
          id: "milestone_1",
          title: "Project Setup & Planning",
          description:
            "Initial project setup, requirements review, and planning",
          amount: 500,
          dueDate: "2024-01-18",
          status: "approved",
          progress: 100,
          estimatedHours: 20,
          actualHours: 18,
          paymentStatus: "released",
          deliverables: [
            {
              id: "del_1",
              title: "Requirements Document Review",
              description: "Detailed analysis of project requirements",
              status: "approved",
            },
            {
              id: "del_2",
              title: "Project Timeline",
              description: "Detailed project timeline with milestones",
              status: "approved",
            },
          ],
          tasks: [],
        },
        {
          id: "milestone_2",
          title: "Design & Wireframes",
          description: "Create wireframes and design mockups",
          amount: 1200,
          dueDate: "2024-01-25",
          status: "in-progress",
          progress: 65,
          estimatedHours: 40,
          actualHours: 26,
          paymentStatus: "escrowed",
          autoReleaseDate: "2024-01-27",
          deliverables: [
            {
              id: "del_3",
              title: "Wireframes",
              description: "Complete wireframes for all pages",
              status: "submitted",
            },
            {
              id: "del_4",
              title: "Design Mockups",
              description: "High-fidelity design mockups",
              status: "pending",
            },
          ],
          tasks: [],
        },
        {
          id: "milestone_3",
          title: "Frontend Development",
          description: "Build responsive frontend components",
          amount: 2000,
          dueDate: "2024-02-10",
          status: "pending",
          progress: 0,
          estimatedHours: 80,
          actualHours: 0,
          paymentStatus: "pending",
          deliverables: [
            {
              id: "del_5",
              title: "React Components",
              description: "Reusable React components",
              status: "pending",
            },
            {
              id: "del_6",
              title: "Responsive Design",
              description: "Mobile-responsive implementation",
              status: "pending",
            },
          ],
          tasks: [],
        },
      ];

      const mockTasks: TaskItem[] = [
        {
          id: "task_1",
          title: "Review project requirements",
          description:
            "Go through the detailed requirements document and ask any clarifying questions",
          status: "completed",
          assignedTo: "freelancer",
          dueDate: "2024-01-16",
          completedAt: "2024-01-15T14:30:00Z",
          milestoneId: "milestone_1",
          priority: "high",
          estimatedHours: 4,
          actualHours: 3.5,
          tags: ["planning", "requirements"],
          checklist: [
            { id: "check_1", title: "Read requirements doc", completed: true },
            {
              id: "check_2",
              title: "Prepare clarification questions",
              completed: true,
            },
            { id: "check_3", title: "Schedule kickoff call", completed: true },
          ],
        },
        {
          id: "task_2",
          title: "Provide project assets",
          description:
            "Share brand guidelines, logos, and other necessary assets",
          status: "completed",
          assignedTo: "client",
          dueDate: "2024-01-17",
          completedAt: "2024-01-16T10:00:00Z",
          milestoneId: "milestone_1",
          priority: "medium",
          estimatedHours: 2,
          actualHours: 1,
          tags: ["assets", "branding"],
          files: [
            {
              id: "file_1",
              name: "brand-guidelines.pdf",
              url: "/files/brand-guidelines.pdf",
              uploadedAt: "2024-01-16T10:00:00Z",
            },
          ],
        },
        {
          id: "task_3",
          title: "Create initial wireframes",
          description: "Design wireframes for main pages and user flows",
          status: "in-progress",
          assignedTo: "freelancer",
          dueDate: "2024-01-20",
          milestoneId: "milestone_2",
          priority: "high",
          estimatedHours: 16,
          actualHours: 12,
          tags: ["design", "wireframes"],
          checklist: [
            { id: "check_4", title: "Homepage wireframe", completed: true },
            { id: "check_5", title: "Product page wireframe", completed: true },
            {
              id: "check_6",
              title: "User dashboard wireframe",
              completed: false,
            },
            { id: "check_7", title: "Mobile wireframes", completed: false },
          ],
        },
        {
          id: "task_4",
          title: "Review and approve wireframes",
          description: "Review wireframes and provide feedback or approval",
          status: "pending",
          assignedTo: "client",
          dueDate: "2024-01-22",
          milestoneId: "milestone_2",
          priority: "medium",
          estimatedHours: 4,
          tags: ["review", "approval"],
          dependencies: ["task_3"],
        },
        {
          id: "task_5",
          title: "Develop frontend components",
          description: "Build React components based on approved designs",
          status: "pending",
          assignedTo: "freelancer",
          dueDate: "2024-01-28",
          milestoneId: "milestone_3",
          priority: "high",
          estimatedHours: 40,
          tags: ["development", "react"],
          dependencies: ["task_4"],
        },
      ];

      setMilestones(mockMilestones);
      setTasks(mockTasks);
      if (mockMilestones.length > 0) {
        setSelectedMilestone(mockMilestones[0].id);
      }
    }
  }, [project]);

  const getTaskStatusColor = (status: TaskItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskPriorityIcon = (dueDate?: string) => {
    if (!dueDate) return null;

    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff < 0) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else if (daysDiff <= 2) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return null;
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getTasksByStatus = (status: TaskItem["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const canUserCompleteTask = (task: TaskItem) => {
    return task.assignedTo === userRole || task.assignedTo === "both";
  };

  const handleTaskStatusChange = (
    taskId: string,
    newStatus: TaskItem["status"],
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedAt:
                newStatus === "completed"
                  ? new Date().toISOString()
                  : undefined,
            }
          : task,
      ),
    );

    toast({
      title: "Task updated",
      description: `Task marked as ${newStatus}`,
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate || undefined,
    };

    setTasks((prev) => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "freelancer",
      dueDate: "",
    });
    setShowAddTask(false);

    toast({
      title: "Task added",
      description: "New task has been added to the project",
    });
  };

  const TaskCard: React.FC<{ task: TaskItem }> = ({ task }) => (
    <Card className="relative">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium line-clamp-1">{task.title}</h4>
              {getTaskPriorityIcon(task.dueDate)}
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Badge className={getTaskStatusColor(task.status)}>
                {task.status}
              </Badge>
              <span>Assigned to: {task.assignedTo}</span>
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== "completed" && canUserCompleteTask(task) && (
                <>
                  {task.status === "pending" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleTaskStatusChange(task.id, "in-progress")
                      }
                    >
                      Start Task
                    </DropdownMenuItem>
                  )}
                  {task.status === "in-progress" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleTaskStatusChange(task.id, "completed")
                      }
                    >
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.completedAt && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            Completed on {new Date(task.completedAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Project not found</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Project Progress
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {calculateProgress()}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={calculateProgress()} className="h-3" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {getTasksByStatus("pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {getTasksByStatus("in-progress").length}
                </div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {getTasksByStatus("completed").length}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {tasks.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tasks & Milestones</CardTitle>
          <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Task Title *</Label>
                  <Input
                    id="taskTitle"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    placeholder="Describe the task"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          assignedTo: e.target.value as TaskItem["assignedTo"],
                        }))
                      }
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="client">Client</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskDueDate">Due Date</Label>
                    <Input
                      id="taskDueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No tasks yet</h3>
              <p className="text-muted-foreground">
                Add tasks to track project progress
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones Overview */}
      {project.milestones && project.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Project Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                      <span>${milestone.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Badge className={getTaskStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Send Message
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Meeting
            </Button>
            {userRole === "client" && (
              <Button className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Release Payment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskTracker;
