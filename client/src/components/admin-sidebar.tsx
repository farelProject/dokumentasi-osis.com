import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Upload, 
  Calendar, 
  FolderOpen, 
  LogOut, 
  X 
} from "lucide-react";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user || !location.startsWith("/admin") || location === "/admin/login") {
    return null;
  }

  const sidebarItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/upload", label: "Upload Media", icon: Upload },
    { path: "/admin/programs", label: "Kelola Proker", icon: Calendar },
    { path: "/admin/media", label: "Kelola Media", icon: FolderOpen },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out mt-16">
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-primary">Admin Panel</h2>
      </div>
      
      <nav className="mt-5 px-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start space-x-3 h-10 ${
                  isActive(item.path)
                    ? "bg-blue-50 text-primary"
                    : "text-gray-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
        
        <div className="pt-4 border-t border-slate-200 mt-4">
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 h-10 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
