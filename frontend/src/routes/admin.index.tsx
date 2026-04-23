import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Package, FileText, MessageSquare, TrendingUp, Sparkles, ArrowUpRight, Activity, Clock, Settings as SettingsIcon } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function AdminDashboard() {
  const navigate = useNavigate({ from: "/admin/" });

  const { data: goldPrices } = useQuery({
    queryKey: ["gold-prices"],
    queryFn: () => fetch(`${API_BASE}/gold-prices/`).then(res => res.json())
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch(`${API_BASE}/products/`).then(res => res.json())
  });

  const { data: galleryItems } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetch(`${API_BASE}/gallery/`).then(res => res.json())
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => fetch(`${API_BASE}/blogs/`).then(res => res.json())
  });

  const stats = [
    { title: "Total Products", value: products?.length || 0, icon: Package, trend: "Inventory" },
    { title: "Gallery Items", value: galleryItems?.length || 0, icon: Sparkles, trend: "Visuals" },
    { title: "Total Blogs", value: blogs?.length || 0, icon: FileText, trend: "Editorial" },
    { title: "Gold Rate (22K)", value: goldPrices ? `₹${goldPrices.price_22k.toLocaleString('en-IN')}` : "Fetching...", icon: TrendingUp, trend: "Real-time" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-onyx tracking-tight">Welcome to Dashboard</h1>
          <p className="text-onyx/40 text-sm font-light uppercase tracking-[0.3em]">Management Console • Sahajanand Jewellers</p>
        </div>
        <div className="flex items-center gap-4 bg-onyx/5 px-6 py-3 rounded-2xl border border-onyx/5">
          <div className="flex flex-col text-right">
            <span className="text-xs font-medium text-onyx/40 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="h-10 w-[1px] bg-onyx/10" />
          <Clock className="text-gold" size={20} />
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden group bg-white/50 backdrop-blur-sm border border-white/20">
              <CardContent className="p-8 relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-onyx/5 rounded-2xl group-hover:bg-gold/10 transition-colors">
                    <stat.icon className="h-5 w-5 text-gold group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-medium text-onyx/30 group-hover:text-gold/60 transition-colors uppercase tracking-widest">{stat.trend}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] font-semibold text-onyx/40 uppercase tracking-[0.2em]">{stat.title}</h3>
                  <p className="text-4xl font-serif text-onyx tracking-tight">{stat.value}</p>
                </div>
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-gold" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-none shadow-sm rounded-3xl h-full overflow-hidden bg-white/50 backdrop-blur-sm border border-white/20">
            <CardHeader className="p-8 border-b border-onyx/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-gold" />
                <CardTitle className="font-serif text-2xl text-onyx">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {[
                  { action: "New product added", item: "Diamond Ring", time: "2 hours ago", status: "Active" },
                  { action: "Newsletter sent", item: "Spring Collection", time: "5 hours ago", status: "Sent" },
                  { action: "Price updated", item: "24K Gold", time: "Yesterday", status: "Updated" },
                ].map((log, i) => (
                  <div key={i} className="flex gap-6 items-center group">
                    <div className="h-12 w-12 rounded-2xl bg-onyx/5 flex items-center justify-center text-onyx/40 group-hover:bg-gold group-hover:text-onyx transition-all duration-500">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-onyx font-medium">{log.action}: <span className="text-gold">"{log.item}"</span></p>
                        <p className="text-[10px] text-onyx/30 uppercase tracking-widest">{log.time}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-sage/10 text-sage text-[8px] uppercase tracking-widest font-bold">{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-none shadow-2xl bg-onyx text-ivory rounded-3xl h-full overflow-hidden relative">
            {/* Cinematic Overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-[80px]" />
            
            <CardHeader className="p-8 border-b border-white/5 relative z-10">
              <CardTitle className="font-serif text-2xl tracking-wide flex items-center gap-3">
                <Sparkles size={20} className="text-gold" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4 relative z-10">
              {[
                { label: "Add Product", sub: "Inventory", icon: Package, href: "/admin/products" },
                { label: "Write Blog", sub: "Editorial", icon: FileText, href: "/admin/blogs" },
                { label: "Add Gallery", sub: "Visuals", icon: TrendingUp, href: "/admin/gallery" },
                { label: "Settings", sub: "Config", icon: SettingsIcon, href: "/admin/settings" },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => navigate({ to: action.href as any })}
                  className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/50 hover:bg-white/10 transition-all text-left group flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-serif text-lg text-ivory group-hover:text-gold transition-colors">{action.label}</div>
                    <div className="text-[8px] text-ivory/30 uppercase tracking-[0.2em]">{action.sub}</div>
                  </div>
                  <action.icon className="h-5 w-5 text-gold/30 group-hover:text-gold group-hover:scale-110 transition-all" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
