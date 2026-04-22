import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated() && location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, location]);

  const handleLogout = () => {
    authService.logout();
    navigate({ to: "/admin/login" });
  };

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!authService.isAuthenticated()) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Blogs", icon: FileText, href: "/admin/blogs" },
    { label: "Inquiries", icon: MessageSquare, href: "/admin/contacts" },
  ];

  const currentPath = navItems.find(item => item.href === location.pathname)?.label || "Overview";

  return (
    <div className="flex min-h-screen bg-ivory/30">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-500 glass-dark text-ivory flex flex-col fixed inset-y-0 z-50 border-r border-white/5`}
      >
        <div className="p-8 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="animate-fade-up">
              <span className="font-serif text-2xl tracking-luxe text-gold">MAISON</span>
              <div className="h-px w-12 bg-gold/50 mt-1" />
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gold/80 hover:text-gold"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group flex items-center gap-4 px-4 py-4 rounded-lg transition-all duration-500 overflow-hidden relative ${
                  isActive 
                    ? "bg-gold text-onyx shadow-luxe scale-[1.02]" 
                    : "hover:bg-white/5 text-ivory/60 hover:text-ivory"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
                )}
                <item.icon size={20} className={`${isActive ? "text-onyx" : "text-gold/60 group-hover:text-gold"} transition-colors`} />
                {isSidebarOpen && <span className="font-medium tracking-wide">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full flex items-center gap-4 px-4 py-6 text-ivory/40 hover:text-red-400 hover:bg-red-400/5 justify-start transition-all"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen flex flex-col`}>
        {/* Top Header */}
        <header className="h-20 glass flex items-center justify-between px-10 sticky top-0 z-40 border-b border-onyx/5">
          <div className="flex items-center gap-4 animate-fade-up">
            <span className="text-onyx/40 font-serif lowercase italic">admin</span>
            <span className="text-onyx/20">/</span>
            <span className="text-onyx font-medium tracking-wide uppercase text-xs">{currentPath}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-onyx/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-onyx">Directeur</div>
                <div className="text-[10px] text-onyx/50 uppercase tracking-widest">Administrator</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-serif">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1 animate-fade-up">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
