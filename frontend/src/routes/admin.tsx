import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Star,
  Quote,
  Instagram,
  FolderTree,
  Camera,
  Phone,
  Mail,
  Settings as SettingsIcon,
  ChevronRight,
  ExternalLink,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticated() && location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, location]);

  const handleLogout = () => {
    authService.logout();
    navigate({ to: "/admin/login" });
  };

  if (!hasMounted) {
    return null;
  }

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!authService.isAuthenticated()) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Hero Slides", icon: Star, href: "/admin/hero" },
    { label: "Categories", icon: FolderTree, href: "/admin/categories" },
    { label: "Gallery", icon: Camera, href: "/admin/gallery" },
    { label: "Policies", icon: FolderTree, href: "/admin/policies" },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "About Page", icon: FileText, href: "/admin/about" },
    { label: "Contact Page", icon: Phone, href: "/admin/contact-page" },
    { label: "Blogs", icon: FileText, href: "/admin/blogs" },
    { label: "Inquiries", icon: MessageSquare, href: "/admin/contacts" },
    { label: "Offers & Leads", icon: MessageSquare, href: "/admin/offers" },
    { label: "Reviews", icon: Star, href: "/admin/reviews" },
    { label: "Testimonials", icon: Quote, href: "/admin/testimonials" },
    { label: "Instagram Feed", icon: Instagram, href: "/admin/instagram" },
    { label: "Newsletter", icon: Mail, href: "/admin/newsletter" },
    { label: "Settings", icon: SettingsIcon, href: "/admin/settings" },
  ];

  const currentPathLabel = navItems.find(item => item.href === location.pathname)?.label || "Workspace";

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] text-onyx font-sans selection:bg-gold/20">
      {/* Sidebar - Solid Luxury */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="fixed inset-y-0 left-0 z-50 bg-onyx text-ivory flex flex-col shadow-2xl transition-all duration-500 ease-in-out"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <span className="font-serif text-xl tracking-[0.2em] text-gold uppercase">MAISON</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gold/60 hover:text-gold"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? "bg-gold text-onyx" 
                    : "hover:bg-white/[0.03] text-white/50 hover:text-white"
                }`}
              >
                <item.icon size={18} className={`${isActive ? "text-onyx" : "text-gold/40 group-hover:text-gold"} transition-colors shrink-0`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="font-medium text-[13px] tracking-wide whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <Button 
            variant="ghost" 
            className={`w-full flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"} gap-3 p-3 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all group`}
            onClick={handleLogout}
          >
            <LogOut size={18} className="shrink-0" />
            {isSidebarOpen && <span className="text-[13px] font-medium">Log Out</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? "ml-[280px]" : "ml-[88px]"}`}>
        {/* Global Header */}
        <header className="h-20 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-onyx/5 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-onyx/40 mb-0.5">
                <span>Admin</span>
                <ChevronRight size={10} />
                <span className="text-gold font-bold">{currentPathLabel}</span>
              </div>
              <h2 className="font-serif text-2xl text-onyx">{currentPathLabel}</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-gold-deep border-2 border-white shadow-lg flex items-center justify-center text-onyx font-serif text-lg font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Outlet */}
        <main className="p-8 flex-1 min-h-0 bg-ivory/30">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
