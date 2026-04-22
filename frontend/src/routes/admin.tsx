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
  X,
  Star,
  Quote
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
    { label: "Reviews", icon: Star, href: "/admin/reviews" },
    { label: "Testimonials", icon: Quote, href: "/admin/testimonials" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-onyx text-ivory flex flex-col fixed inset-y-0 z-50`}
        style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-serif text-xl tracking-luxe">Maison Admin</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/10 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-gold text-onyx" 
                    : "hover:bg-white/5 text-ivory/70 hover:text-ivory"
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full flex items-center gap-4 px-4 text-ivory/70 hover:text-red-400 hover:bg-red-400/10 justify-start"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} p-8`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
