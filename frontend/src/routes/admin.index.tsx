import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Package, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

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
    { title: "Total Products", value: products?.length || 0, icon: Package, color: "text-gold" },
    { title: "Gallery Items", value: galleryItems?.length || 0, icon: TrendingUp, color: "text-gold" },
    { title: "Blog Posts", value: blogs?.length || 0, icon: FileText, color: "text-gold" },
    { title: "New Inquiries", value: "12", icon: MessageSquare, color: "text-gold" },
    { title: "Current Rate (22K)", value: goldPrices ? `₹${goldPrices.price_22k.toLocaleString('en-IN')}` : "Loading...", icon: TrendingUp, color: "text-gold" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-onyx tracking-wide">Executive Dashboard</h1>
          <p className="text-onyx/40 font-light uppercase tracking-[0.2em] text-xs">Atelier Performance & Inventory Overview</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-serif text-onyx">April 22, 2026</div>
          <div className="text-[10px] text-onyx/30 uppercase tracking-widest">System Status: Optimal</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-card hover:shadow-luxe transition-all duration-500 overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-[10px] font-medium uppercase tracking-[0.2em] text-onyx/40 group-hover:text-gold transition-colors">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-all duration-500`} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-serif text-onyx">{stat.value}</div>
              <div className="mt-4 h-1 w-full bg-onyx/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-2/3 group-hover:w-full transition-all duration-1000" />
              </div>
            </CardContent>
            {/* Decorative gradient corner */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-500" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-none shadow-card h-full">
          <CardHeader className="border-b border-onyx/5 py-6">
            <CardTitle className="font-serif text-xl text-onyx tracking-wide">System Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="py-10">
            <div className="space-y-8">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="h-2 w-2 mt-2 rounded-full bg-gold" />
                  <div className="space-y-1">
                    <p className="text-sm text-onyx/70">New product <span className="font-medium text-onyx">"Éclat d'Or Ring"</span> added to inventory.</p>
                    <p className="text-[10px] text-onyx/30 uppercase tracking-widest">2 hours ago — By Admin</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gold font-medium uppercase tracking-widest pt-4 cursor-pointer hover:underline">View all system logs →</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-card bg-onyx text-ivory overflow-hidden relative">
          {/* Subtle gold sheen background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <CardHeader className="py-6 border-b border-white/5 relative z-10">
            <CardTitle className="font-serif text-xl tracking-wide">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 py-8 relative z-10">
            <button className="p-6 glass-dark border border-white/10 rounded-xl hover:border-gold hover:scale-[1.02] transition-all text-left group">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-serif text-lg group-hover:text-gold transition-colors">New Product</div>
                  <div className="text-[10px] text-ivory/30 uppercase tracking-widest">Inventory Management</div>
                </div>
                <Package className="h-5 w-5 text-gold/40 group-hover:text-gold group-hover:rotate-12 transition-all" />
              </div>
            </button>
            <button className="p-6 glass-dark border border-white/10 rounded-xl hover:border-gold hover:scale-[1.02] transition-all text-left group">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-serif text-lg group-hover:text-gold transition-colors">Publish Article</div>
                  <div className="text-[10px] text-ivory/30 uppercase tracking-widest">Journal Editorial</div>
                </div>
                <FileText className="h-5 w-5 text-gold/40 group-hover:text-gold group-hover:rotate-12 transition-all" />
              </div>
            </button>
            <button 
              onClick={() => navigate({ to: "/admin/gallery" })}
              className="p-6 glass-dark border border-white/10 rounded-xl hover:border-gold hover:scale-[1.02] transition-all text-left group"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-serif text-lg group-hover:text-gold transition-colors">Manage Gallery</div>
                  <div className="text-[10px] text-ivory/30 uppercase tracking-widest">Visual Storytelling</div>
                </div>
                <TrendingUp className="h-5 w-5 text-gold/40 group-hover:text-gold group-hover:rotate-12 transition-all" />
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
