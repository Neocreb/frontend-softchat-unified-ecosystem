
import { Link } from "react-router-dom";
import { 
  Users, Database, Settings, ShieldAlert, 
  BarChart, MessageSquare, Store, RefreshCw 
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-secondary/10 h-[calc(100vh-4rem)] p-4 hidden md:block">
      <h2 className="text-lg font-bold mb-6 px-4">Admin Panel</h2>
      
      <nav className="space-y-1">
        <Link 
          to="/admin/dashboard" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <BarChart className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/admin/users" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <Users className="h-5 w-5" />
          <span>User Management</span>
        </Link>
        
        <Link 
          to="/admin/content" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Content Moderation</span>
        </Link>
        
        <Link 
          to="/admin/marketplace" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <Store className="h-5 w-5" />
          <span>Marketplace</span>
        </Link>
        
        <Link 
          to="/admin/crypto" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Crypto Management</span>
        </Link>
        
        <Link 
          to="/admin/database" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <Database className="h-5 w-5" />
          <span>Database</span>
        </Link>
        
        <Link 
          to="/admin/roles" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <ShieldAlert className="h-5 w-5" />
          <span>Admin Roles</span>
        </Link>
        
        <Link 
          to="/admin/settings" 
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary/20 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
