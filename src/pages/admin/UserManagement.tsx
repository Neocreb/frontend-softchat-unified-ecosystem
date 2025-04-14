
import { useState } from "react";
import { useNotification } from "@/hooks/use-notification";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, Search, Filter, UserPlus, Edit, Trash, Shield, 
  CheckCircle, XCircle, UserCog 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserStatus = "active" | "pending" | "suspended";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: UserStatus;
  verified: boolean;
  joinDate: string;
  level: "bronze" | "silver" | "gold" | "platinum";
};

const mockUsers: AdminUser[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    verified: true,
    joinDate: "2025-01-15",
    level: "bronze"
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user",
    status: "active",
    verified: true,
    joinDate: "2025-01-20",
    level: "silver"
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    verified: true,
    joinDate: "2025-01-01",
    level: "platinum"
  },
  {
    id: "mod1",
    name: "Moderator User",
    email: "mod@example.com",
    role: "moderator",
    status: "active",
    verified: true,
    joinDate: "2025-01-10",
    level: "gold"
  },
  {
    id: "user3",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "user",
    status: "pending",
    verified: false,
    joinDate: "2025-02-05",
    level: "bronze"
  },
  {
    id: "user4",
    name: "Jamie Smith",
    email: "jamie@example.com",
    role: "user",
    status: "suspended",
    verified: true,
    joinDate: "2025-01-25",
    level: "bronze"
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const notification = useNotification();

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    notification.success("User deleted successfully");
  };

  const handleVerifyUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, verified: true } : user
    ));
    notification.success("User verified successfully");
  };

  const handleSuspendUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: "suspended" as UserStatus } : user
    ));
    notification.warning("User suspended");
  };

  const handleActivateUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: "active" as UserStatus } : user
    ));
    notification.success("User activated");
  };

  const handlePromoteToModerator = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: "moderator" as AdminUser["role"] } : user
    ));
    notification.success("User promoted to moderator");
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-2">
                  {user.name}
                  {user.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "destructive" : user.role === "moderator" ? "default" : "outline"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      user.status === "active" ? "success" : 
                      user.status === "pending" ? "warning" : 
                      "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      user.level === "platinum" ? "outline" : 
                      user.level === "gold" ? "outline" : 
                      user.level === "silver" ? "outline" : 
                      "outline"
                    }
                  >
                    {user.level}
                  </Badge>
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => notification.info("Edit user profile")}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {!user.verified && (
                        <DropdownMenuItem onClick={() => handleVerifyUser(user.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify
                        </DropdownMenuItem>
                      )}
                      {user.status === "active" ? (
                        <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {user.role === "user" && (
                        <DropdownMenuItem onClick={() => handlePromoteToModerator(user.id)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Make Moderator
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => notification.info("Change user permissions")}>
                        <UserCog className="h-4 w-4 mr-2" />
                        Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
