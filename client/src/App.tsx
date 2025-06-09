import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import AdminSidebar from "@/components/admin-sidebar";
import Home from "@/pages/home";
import Collection from "@/pages/collection";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUpload from "@/pages/admin/upload";
import AdminPrograms from "@/pages/admin/programs";
import AdminMediaManagement from "@/pages/admin/media-management";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collection" component={Collection} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/upload" component={AdminUpload} />
      <Route path="/admin/programs" component={AdminPrograms} />
      <Route path="/admin/media" component={AdminMediaManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <AdminSidebar />
            <div className="transition-all duration-300">
              <Router />
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
