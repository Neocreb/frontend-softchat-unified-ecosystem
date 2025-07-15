import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Timer,
  Bell,
  Zap,
} from "lucide-react";
import { Project } from "@/types/freelance";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, addDays, differenceInHours } from "date-fns";

interface EscrowContract {
  id: string;
  projectId: string;
  amount: number;
  cryptoType: "USDT" | "BTC" | "ETH";
  status: "pending" | "locked" | "released" | "auto_released" | "disputed";
  autoReleaseDate?: Date;
  autoReleaseHours: number;
  platformFee: number;
  createdAt: Date;
  lockedAt?: Date;
  releasedAt?: Date;
}

interface EnhancedEscrowSystemProps {
  project: Project;
  userRole: "client" | "freelancer";
  currentUserId: string;
}

export const EnhancedEscrowSystem: React.FC<EnhancedEscrowSystemProps> = ({
  project,
  userRole,
  currentUserId,
}) => {
  const [escrows, setEscrows] = useState<EscrowContract[]>([]);
  const [showCreateEscrow, setShowCreateEscrow] = useState(false);
  const [autoReleaseWarnings, setAutoReleaseWarnings] = useState<
    EscrowContract[]
  >([]);
  const [escrowForm, setEscrowForm] = useState({
    amount: 0,
    cryptoType: "USDT" as const,
    autoReleaseHours: 72,
  });
  const [activeTab, setActiveTab] = useState("active");

  const { toast } = useToast();

  // Mock escrow data
  useEffect(() => {
    const mockEscrows: EscrowContract[] = [
      {
        id: "escrow_1",
        projectId: project.id,
        amount: 2500,
        cryptoType: "USDT",
        status: "locked",
        autoReleaseDate: new Date("2024-01-18T10:00:00Z"),
        autoReleaseHours: 72,
        platformFee: 125,
        lockedAt: new Date("2024-01-15T10:00:00Z"),
        createdAt: new Date("2024-01-15T09:30:00Z"),
      },
      {
        id: "escrow_2",
        projectId: project.id,
        amount: 1500,
        cryptoType: "USDT",
        status: "pending",
        autoReleaseHours: 72,
        platformFee: 75,
        createdAt: new Date("2024-01-16T14:00:00Z"),
      },
    ];

    setEscrows(mockEscrows);

    // Check for auto-release warnings
    const warnings = mockEscrows.filter((escrow) => {
      if (!escrow.autoReleaseDate || escrow.status !== "locked") return false;
      const hoursUntilRelease = differenceInHours(
        escrow.autoReleaseDate,
        new Date(),
      );
      return hoursUntilRelease <= 24 && hoursUntilRelease > 0;
    });
    setAutoReleaseWarnings(warnings);
  }, [project.id]);

  // Auto-release timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setEscrows((prevEscrows) =>
        prevEscrows.map((escrow) => {
          if (
            escrow.status === "locked" &&
            escrow.autoReleaseDate &&
            new Date() >= escrow.autoReleaseDate
          ) {
            toast({
              title: "Auto-Release Executed",
              description: `Escrow ${escrow.id} has been automatically released`,
            });

            return {
              ...escrow,
              status: "auto_released" as const,
              releasedAt: new Date(),
            };
          }
          return escrow;
        }),
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [toast]);

  const getStatusColor = (status: EscrowContract["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "locked":
        return "bg-blue-100 text-blue-800";
      case "released":
        return "bg-green-100 text-green-800";
      case "auto_released":
        return "bg-emerald-100 text-emerald-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: EscrowContract["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "locked":
        return <Lock className="w-4 h-4" />;
      case "released":
        return <CheckCircle2 className="w-4 h-4" />;
      case "auto_released":
        return <Zap className="w-4 h-4" />;
      case "disputed":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const handleCreateEscrow = async () => {
    try {
      const newEscrow: EscrowContract = {
        id: `escrow_${Date.now()}`,
        projectId: project.id,
        amount: escrowForm.amount,
        cryptoType: escrowForm.cryptoType,
        status: "pending",
        autoReleaseHours: escrowForm.autoReleaseHours,
        platformFee: escrowForm.amount * 0.05,
        createdAt: new Date(),
      };

      setEscrows((prev) => [...prev, newEscrow]);
      setShowCreateEscrow(false);
      setEscrowForm({
        amount: 0,
        cryptoType: "USDT",
        autoReleaseHours: 72,
      });

      toast({
        title: "Escrow Created",
        description: "Escrow contract has been created successfully",
      });

      // Simulate locking after 3 seconds
      setTimeout(() => {
        setEscrows((prev) =>
          prev.map((escrow) =>
            escrow.id === newEscrow.id
              ? {
                  ...escrow,
                  status: "locked",
                  lockedAt: new Date(),
                  autoReleaseDate: addDays(
                    new Date(),
                    escrowForm.autoReleaseHours / 24,
                  ),
                }
              : escrow,
          ),
        );
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create escrow contract",
        variant: "destructive",
      });
    }
  };

  const handleReleaseFunds = async (escrowId: string) => {
    try {
      setEscrows((prev) =>
        prev.map((escrow) =>
          escrow.id === escrowId
            ? {
                ...escrow,
                status: "released",
                releasedAt: new Date(),
              }
            : escrow,
        ),
      );

      toast({
        title: "Funds Released",
        description: "Funds have been released to the freelancer",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to release funds",
        variant: "destructive",
      });
    }
  };

  const EscrowCard: React.FC<{ escrow: EscrowContract }> = ({ escrow }) => {
    const timeUntilAutoRelease = escrow.autoReleaseDate
      ? differenceInHours(escrow.autoReleaseDate, new Date())
      : null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getStatusIcon(escrow.status)}
                </div>
                <div>
                  <h3 className="font-semibold">
                    Escrow #{escrow.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-muted-foreground">Full Project</p>
                </div>
              </div>
              <Badge className={getStatusColor(escrow.status)}>
                {escrow.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Amount and Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-600 font-semibold text-sm">
                  Amount
                </div>
                <div className="text-lg font-bold">${escrow.amount}</div>
                <div className="text-xs text-green-600">
                  {escrow.cryptoType}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 font-semibold text-sm">
                  Net Amount
                </div>
                <div className="text-lg font-bold">
                  ${(escrow.amount - escrow.platformFee).toFixed(2)}
                </div>
                <div className="text-xs text-blue-600">After fees</div>
              </div>
            </div>

            {/* Auto-release warning */}
            {escrow.status === "locked" &&
              timeUntilAutoRelease !== null &&
              timeUntilAutoRelease <= 24 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Auto-release in {timeUntilAutoRelease}h
                    </span>
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    Funds will be automatically released if no action is taken
                  </div>
                </div>
              )}

            {/* Status specific info */}
            {escrow.status === "locked" && escrow.lockedAt && (
              <div className="text-sm text-muted-foreground">
                Locked{" "}
                {formatDistanceToNow(escrow.lockedAt, { addSuffix: true })}
              </div>
            )}

            {escrow.status === "released" && escrow.releasedAt && (
              <div className="text-sm text-green-600">
                Released{" "}
                {formatDistanceToNow(escrow.releasedAt, { addSuffix: true })}
              </div>
            )}

            {escrow.status === "auto_released" && escrow.releasedAt && (
              <div className="text-sm text-emerald-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Auto-released{" "}
                {formatDistanceToNow(escrow.releasedAt, { addSuffix: true })}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              {userRole === "client" && escrow.status === "locked" && (
                <Button size="sm" onClick={() => handleReleaseFunds(escrow.id)}>
                  <Unlock className="w-4 h-4 mr-2" />
                  Release Funds
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const activeEscrows = escrows.filter((e) =>
    ["pending", "locked"].includes(e.status),
  );
  const completedEscrows = escrows.filter((e) =>
    ["released", "auto_released"].includes(e.status),
  );

  return (
    <div className="space-y-6">
      {/* Auto-release warnings */}
      {autoReleaseWarnings.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Bell className="w-5 h-5" />
              Auto-Release Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {autoReleaseWarnings.map((escrow) => {
                const hoursLeft = differenceInHours(
                  escrow.autoReleaseDate!,
                  new Date(),
                );
                return (
                  <div
                    key={escrow.id}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div>
                      <span className="font-medium">
                        Escrow #{escrow.id.slice(-6)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ${escrow.amount} • Auto-release in {hoursLeft}h
                      </span>
                    </div>
                    {userRole === "client" && (
                      <Button
                        size="sm"
                        onClick={() => handleReleaseFunds(escrow.id)}
                      >
                        Release Now
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Escrow Management</h2>
          <p className="text-muted-foreground">
            Secure payment system with automatic release
          </p>
        </div>
        {userRole === "client" && (
          <Button onClick={() => setShowCreateEscrow(true)}>
            <Shield className="w-4 h-4 mr-2" />
            Create Escrow
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{activeEscrows.length}</div>
              <div className="text-sm text-muted-foreground">
                Active Escrows
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                ${activeEscrows.reduce((sum, e) => sum + e.amount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Locked Amount</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold">
                {completedEscrows.length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Timer className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">72h</div>
              <div className="text-sm text-muted-foreground">Auto-Release</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeEscrows.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedEscrows.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({escrows.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeEscrows.length > 0 ? (
            activeEscrows.map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))
          ) : (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Active Escrows</h3>
              <p className="text-muted-foreground">
                Create an escrow to secure project payments
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedEscrows.length > 0 ? (
            completedEscrows.map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Completed Escrows</h3>
              <p className="text-muted-foreground">
                Completed escrows will appear here
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {escrows.length > 0 ? (
            escrows.map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))
          ) : (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Escrows</h3>
              <p className="text-muted-foreground">
                Start by creating your first escrow contract
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Escrow Dialog */}
      <Dialog open={showCreateEscrow} onOpenChange={setShowCreateEscrow}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Escrow Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={escrowForm.amount}
                  onChange={(e) =>
                    setEscrowForm((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="crypto-type">Currency</Label>
                <Select
                  value={escrowForm.cryptoType}
                  onValueChange={(value) =>
                    setEscrowForm((prev) => ({
                      ...prev,
                      cryptoType: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="auto-release">Auto-Release Hours</Label>
              <Input
                id="auto-release"
                type="number"
                value={escrowForm.autoReleaseHours}
                onChange={(e) =>
                  setEscrowForm((prev) => ({
                    ...prev,
                    autoReleaseHours: parseInt(e.target.value) || 72,
                  }))
                }
                placeholder="72"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Funds will be automatically released after this period if no
                action is taken
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Fee Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Escrow Amount:</span>
                  <span>${escrowForm.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (5%):</span>
                  <span>${(escrowForm.amount * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span>${(escrowForm.amount * 1.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Freelancer Receives:</span>
                  <span>${(escrowForm.amount * 0.95).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateEscrow(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEscrow}>Create Escrow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedEscrowSystem;
