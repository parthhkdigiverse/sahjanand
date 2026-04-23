import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSubscribers, deleteSubscriber } from "@/lib/api";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { Loader2, Trash2, Mail, Calendar, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletter,
});

function AdminNewsletter() {
  const queryClient = useQueryClient();
  const token = authService.getToken();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: () => fetchSubscribers(token || ""),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubscriber(id, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
      toast.success("Subscriber removed");
    },
    onError: () => toast.error("Failed to remove subscriber"),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading Subscribers...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-end pb-8 border-b border-onyx/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gold/40" />
            <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold">Newsletter Management</p>
          </div>
          <h1 className="text-4xl font-serif text-onyx tracking-wide">Atelier <span className="text-gold italic">Journal</span> Subscribers</h1>
          <p className="text-onyx/40 text-sm font-light">Manage your digital heritage audience and mailing lists.</p>
        </div>
        <div className="bg-onyx text-ivory px-6 py-3 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-gold/20 rounded-lg">
            <UserPlus className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold/80 font-bold">Total Audience</p>
            <p className="text-xl font-serif">{subscribers?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {!subscribers || subscribers.length === 0 ? (
        <Card className="border-dashed border-onyx/10 bg-onyx/[0.01]">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-16 w-16 bg-onyx/5 rounded-full flex items-center justify-center text-onyx/20">
              <Mail className="h-8 w-8" strokeWidth={1} />
            </div>
            <p className="text-sm text-onyx/40 font-light italic">No subscribers have joined your heritage yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscribers.map((sub: any) => (
            <Card key={sub._id} className="group border-onyx/5 hover:border-gold/20 transition-all duration-500 hover:shadow-luxe overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-10 w-10 bg-gold/5 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-onyx transition-colors duration-500">
                    <Mail className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Remove this subscriber?")) {
                        deleteMutation.mutate(sub._id);
                      }
                    }}
                    className="h-8 w-8 text-onyx/20 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-onyx/30 font-bold ml-1">Email Address</p>
                    <p className="text-sm font-medium text-onyx break-all">{sub.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-onyx/5">
                    <Calendar className="h-3 w-3 text-gold/40" />
                    <p className="text-[10px] text-onyx/30 uppercase tracking-widest">
                      Joined {new Date(sub.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
