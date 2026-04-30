import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings, SiteSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { Loader2, Save, Coins, Share2, MessageCircle, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const queryClient = useQueryClient();
  const token = authService.getToken();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: SiteSettings) => updateSettings(data, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfully");
    },
    onError: () => toast.error("Failed to update settings"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gold" />
      </div>
    );
  }

  const handleSave = () => {
    mutation.mutate(formData as SiteSettings);
  };

  return (
    <div className="w-full px-4 md:px-8 space-y-6 animate-fade-in">
      {/* Full-Width Compact Header */}
      <div className="flex items-center justify-between p-6 bg-white border border-onyx/5 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
            <Save className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-onyx">System Settings</h1>
            <p className="text-[10px] uppercase tracking-widest text-onyx/40">Global Site Configurations</p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={mutation.isPending}
          className="bg-onyx text-white hover:bg-gold hover:text-onyx px-8 h-10 transition-all rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm"
        >
          {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
          {mutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Connectivity & Social - Column */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-onyx/5 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-gold" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">WhatsApp Concierge</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-onyx/40 uppercase ml-1">WhatsApp Number</Label>
                <Input 
                  value={formData.whatsapp_number || ""}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                  className="h-10 bg-onyx/[0.02] border-onyx/10 focus:border-gold/50 text-sm"
                  placeholder="+91..."
                />
              </div>
              <p className="text-[10px] text-onyx/40 leading-relaxed italic">Used for direct product inquiries on the public website.</p>
            </CardContent>
          </Card>

          <Card className="border-onyx/5 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gold/10 rounded flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-gold rounded-full" />
                </div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Atelier Promise</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-onyx/40 uppercase ml-1">Promise Heading</Label>
                <Input 
                  value={formData.promise_title || ""}
                  onChange={(e) => setFormData({...formData, promise_title: e.target.value})}
                  className="h-10 bg-onyx/[0.02] border-onyx/10 focus:border-gold/50 text-sm"
                  placeholder="Atelier Promise"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-onyx/40 uppercase ml-1">Promise Text</Label>
                <textarea 
                  value={formData.promise_text || ""}
                  onChange={(e) => setFormData({...formData, promise_text: e.target.value})}
                  className="w-full min-h-[100px] p-3 rounded-lg bg-onyx/[0.02] border border-onyx/10 focus:border-gold/50 text-sm outline-none transition-all resize-none"
                  placeholder="Every piece is hallmarked..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-onyx/5 shadow-sm md:row-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-gold" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Social Presence</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { key: 'instagram_url', label: 'Instagram', icon: Instagram },
                { key: 'facebook_url', label: 'Facebook', icon: Facebook },
                { key: 'twitter_url', label: 'Twitter', icon: Twitter },
                { key: 'youtube_url', label: 'YouTube', icon: Youtube }
              ].map((social) => (
                <div key={social.key} className="space-y-1.5">
                  <div className="flex items-center gap-2 ml-1">
                    <social.icon className="h-3 w-3 text-gold" />
                    <Label className="text-[10px] font-bold text-onyx/40 uppercase">{social.label}</Label>
                  </div>
                  <Input 
                    value={(formData as any)[social.key] || ""}
                    onChange={(e) => setFormData({...formData, [social.key]: e.target.value})}
                    className="h-10 bg-onyx/[0.02] border-onyx/10 focus:border-gold/50 text-xs text-onyx/60"
                    placeholder="https://..."
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
