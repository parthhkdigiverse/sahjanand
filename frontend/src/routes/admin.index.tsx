import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Package, FileText, MessageSquare, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("http://localhost:8003/api/products/").then(res => res.json())
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => fetch("http://localhost:8003/api/blogs/").then(res => res.json())
  });

  // Contacts will need auth, handle gracefully for now
  const stats = [
    { title: "Total Products", value: products?.length || 0, icon: Package, color: "text-blue-600" },
    { title: "Blog Posts", value: blogs?.length || 0, icon: FileText, color: "text-green-600" },
    { title: "New Inquiries", value: "...", icon: MessageSquare, color: "text-purple-600" },
    { title: "Avg. Gold Rate", value: "₹7,240", icon: TrendingUp, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-onyx">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back to the Maison Aurum management portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">No recent system logs to display.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:border-gold transition-colors text-left space-y-1">
              <div className="font-medium">Add Product</div>
              <div className="text-xs text-muted-foreground">List new item</div>
            </button>
            <button className="p-4 border rounded-lg hover:border-gold transition-colors text-left space-y-1">
              <div className="font-medium">New Blog</div>
              <div className="text-xs text-muted-foreground">Write article</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
