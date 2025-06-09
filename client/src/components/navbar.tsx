import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, Images, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { path: "/", label: "Beranda", icon: Home },
    { path: "/collection", label: "Koleksi", icon: Images },
    { path: "/admin/login", label: "Admin", icon: Shield },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-xl font-bold text-primary cursor-pointer">
                  OSIS SMKN 5 Bulukumba
                </h1>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-2 ${
                        isActive(item.path) 
                          ? "text-primary bg-blue-50" 
                          : "text-gray-700 hover:text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
              
              {user && (
                <Link href="/admin/dashboard">
                  <Button
                    variant="ghost"
                    className={`${
                      location.startsWith("/admin") && location !== "/admin/login"
                        ? "text-primary bg-blue-50" 
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start space-x-2 ${
                      isActive(item.path) 
                        ? "text-primary bg-blue-50" 
                        : "text-gray-700 hover:text-primary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            {user && (
              <Link href="/admin/dashboard">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    location.startsWith("/admin") && location !== "/admin/login"
                      ? "text-primary bg-blue-50" 
                      : "text-gray-700 hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
