import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Target, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Trash2,
  Edit
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

interface Milestone {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  dueDate: Date;
  payment: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ProjectPlan {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  milestones: Milestone[];
  riskFactors: string[];
  assumptions: string[];
}

interface ProjectPlannerProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (plan: ProjectPlan) => void;
}

const ProjectPlanner: React.FC<ProjectPlannerProps> = ({ 
  trigger,
  isOpen: controlledOpen,
  onClose,
  onSave
}) => {
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("basics");
  
  // Project basics
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  const [totalBudget, setTotalBudget] = useState<number>(0);
  
  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    deliverables: [""],
    dueDate: addDays(new Date(), 7),
    payment: 0,
  });
  
  // Risk and assumptions
  const [riskFactors, setRiskFactors] = useState<string[]>([""]);
  const [assumptions, setAssumptions] = useState<string[]>([""]);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };

  const addMilestone = () => {
    if (!newMilestone.title) return;
    
    const milestone: Milestone = {
      id: Date.now().toString(),
      ...newMilestone,
      deliverables: newMilestone.deliverables.filter(d => d.trim()),
      status: 'pending',
    };
    
    setMilestones([...milestones, milestone]);
    setNewMilestone({
      title: "",
      description: "",
      deliverables: [""],
      dueDate: addDays(new Date(), 7),
      payment: 0,
    });
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const addDeliverable = () => {
    setNewMilestone({
      ...newMilestone,
      deliverables: [...newMilestone.deliverables, ""]
    });
  };

  const updateDeliverable = (index: number, value: string) => {
    const updated = [...newMilestone.deliverables];
    updated[index] = value;
    setNewMilestone({ ...newMilestone, deliverables: updated });
  };

  const removeDeliverable = (index: number) => {
    setNewMilestone({
      ...newMilestone,
      deliverables: newMilestone.deliverables.filter((_, i) => i !== index)
    });
  };

  const addRiskFactor = () => {
    setRiskFactors([...riskFactors, ""]);
  };

  const updateRiskFactor = (index: number, value: string) => {
    const updated = [...riskFactors];
    updated[index] = value;
    setRiskFactors(updated);
  };

  const removeRiskFactor = (index: number) => {
    setRiskFactors(riskFactors.filter((_, i) => i !== index));
  };

  const addAssumption = () => {
    setAssumptions([...assumptions, ""]);
  };

  const updateAssumption = (index: number, value: string) => {
    const updated = [...assumptions];
    updated[index] = value;
    setAssumptions(updated);
  };

  const removeAssumption = (index: number) => {
    setAssumptions(assumptions.filter((_, i) => i !== index));
  };

  const calculateProjectStats = () => {
    const totalMilestonePayment = milestones.reduce((sum, m) => sum + m.payment, 0);
    const duration = differenceInDays(endDate, startDate);
    const averageMilestoneValue = milestones.length > 0 ? totalMilestonePayment / milestones.length : 0;
    
    return {
      duration,
      totalMilestonePayment,
      averageMilestoneValue,
      budgetCoverage: totalBudget > 0 ? (totalMilestonePayment / totalBudget) * 100 : 0,
      milestonesCount: milestones.length,
    };
  };

  const generatePlan = () => {
    const plan: ProjectPlan = {
      title,
      description,
      startDate,
      endDate,
      totalBudget,
      milestones,
      riskFactors: riskFactors.filter(r => r.trim()),
      assumptions: assumptions.filter(a => a.trim()),
    };
    
    if (onSave) {
      onSave(plan);
    }
    
    // Create downloadable plan
    const planData = JSON.stringify(plan, null, 2);
    const blob = new Blob([planData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_project_plan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = calculateProjectStats();

  const content = (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., E-commerce Website Development"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project scope, objectives, and key requirements..."
                rows={4}
              />
            </div>

            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="budget">Total Budget ($)</Label>
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                placeholder="e.g., 5000"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {/* Existing Milestones */}
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(milestone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Due:</strong> {format(milestone.dueDate, "MMM dd, yyyy")}
                    </div>
                    <div>
                      <strong>Payment:</strong> ${milestone.payment}
                    </div>
                  </div>
                  {milestone.deliverables.length > 0 && (
                    <div className="mt-2">
                      <strong className="text-xs">Deliverables:</strong>
                      <ul className="text-xs text-muted-foreground ml-2">
                        {milestone.deliverables.map((deliverable, i) => (
                          <li key={i}>• {deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Milestone */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Add New Milestone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Milestone Title</Label>
                  <Input
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="e.g., Design Phase Complete"
                  />
                </div>
                
                <div>
                  <Label>Payment Amount ($)</Label>
                  <Input
                    type="number"
                    value={newMilestone.payment}
                    onChange={(e) => setNewMilestone({ ...newMilestone, payment: Number(e.target.value) })}
                    placeholder="e.g., 1500"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Describe what will be completed in this milestone..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newMilestone.dueDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMilestone.dueDate}
                      onSelect={(date) => date && setNewMilestone({ ...newMilestone, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Deliverables</Label>
                {newMilestone.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      placeholder="e.g., Wireframes and mockups"
                    />
                    {newMilestone.deliverables.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDeliverable(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDeliverable}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deliverable
                </Button>
              </div>

              <Button onClick={addMilestone} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={risk}
                      onChange={(e) => updateRiskFactor(index, e.target.value)}
                      placeholder="e.g., Client may change requirements"
                    />
                    {riskFactors.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRiskFactor(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addRiskFactor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Risk
                </Button>
              </CardContent>
            </Card>

            {/* Assumptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assumptions.map((assumption, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={assumption}
                      onChange={(e) => updateAssumption(index, e.target.value)}
                      placeholder="e.g., Client will provide content on time"
                    />
                    {assumptions.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAssumption(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addAssumption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assumption
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.duration}</div>
                <p className="text-sm text-muted-foreground">Days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.milestonesCount}</div>
                <p className="text-sm text-muted-foreground">Milestones</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">${stats.totalMilestonePayment}</div>
                <p className="text-sm text-muted-foreground">Total Planned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.budgetCoverage.toFixed(0)}%</div>
                <p className="text-sm text-muted-foreground">Budget Coverage</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Duration:</strong> {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
                </div>
                <div>
                  <strong>Budget:</strong> ${totalBudget.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Budget Allocation</span>
                  <span className="text-sm">{stats.budgetCoverage.toFixed(1)}%</span>
                </div>
                <Progress value={stats.budgetCoverage} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button onClick={generatePlan} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Plan
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Project Planner
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <Target className="w-4 h-4 mr-2" />
            Project Planner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Project Planner
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPlanner;
