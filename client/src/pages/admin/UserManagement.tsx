
import React, { useState } from "react";
import UserTable from "@/components/admin/UserTable";
import UserFilters from "@/components/admin/UserFilters";
import DeleteUserDialog from "@/components/admin/DeleteUserDialog";
import UserManagementHeader from "@/components/admin/UserManagementHeader";
import { User } from "@/types/admin";

// Sample user data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "inactive",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "user",
    status: "pending",
  },
  {
    id: "4",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    role: "user",
    status: "suspended",
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filtered users based on search and filters
  const filteredUsers = users.filter((user) => {
    const searchMatch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter ? user.role === roleFilter : true;
    const statusMatch = statusFilter ? user.status === statusFilter : true;
    return searchMatch && roleMatch && statusMatch;
  });

  // Function to handle user deletion
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      closeDeleteDialog();
    }
  };

  // Function to handle opening the delete confirmation dialog
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle closing the delete confirmation dialog
  const closeDeleteDialog = () => {
    setSelectedUser(null);
    setIsDeleteDialogOpen(false);
  };

  // Placeholder for adding a new user
  const handleAddUser = () => {
    console.log("Add user clicked");
    // Logic for adding a new user would go here
  };

  return (
    <div className="container py-6">
      <UserManagementHeader onAddUser={handleAddUser} />
      
      <UserFilters
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <UserTable 
        users={filteredUsers} 
        onDeleteUser={openDeleteDialog} 
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        user={selectedUser}
        onCancel={closeDeleteDialog}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
