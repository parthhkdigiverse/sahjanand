import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings, SiteSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { Loader2, Save, Coins, Edit3, MapPin } from "lucide-react";

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
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Global configurations</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Manage your atelier's digital presence</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={mutation.isPending}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-3 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gold Price Configuration */}
        <Card className="border-none shadow-card overflow-hidden">
          <CardHeader className="bg-onyx/[0.02] border-b border-onyx/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Coins className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="font-serif text-xl">Daily Gold Rates</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Manual Price Management (Per Gram)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">24K Rate</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/30">₹</span>
                  <Input 
                    type="number"
                    value={formData.manual_price_24k}
                    onChange={(e) => setFormData({...formData, manual_price_24k: parseFloat(e.target.value)})}
                    className="pl-8 bg-white border-onyx/5 focus:border-gold/50 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">22K Rate</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/30">₹</span>
                  <Input 
                    type="number"
                    value={formData.manual_price_22k}
                    onChange={(e) => setFormData({...formData, manual_price_22k: parseFloat(e.target.value)})}
                    className="pl-8 bg-white border-onyx/5 focus:border-gold/50 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">18K Rate</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/30">₹</span>
                  <Input 
                    type="number"
                    value={formData.manual_price_18k}
                    onChange={(e) => setFormData({...formData, manual_price_18k: parseFloat(e.target.value)})}
                    className="pl-8 bg-white border-onyx/5 focus:border-gold/50 h-12"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
              <p className="text-[10px] text-gold uppercase tracking-widest font-medium">Notice</p>
              <p className="text-[11px] text-onyx/60 font-serif italic mt-1">These rates are globally updated across the home page and executive dashboard instantly upon saving.</p>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section Configuration */}
        <Card className="border-none shadow-card overflow-hidden">
          <CardHeader className="bg-onyx/[0.02] border-b border-onyx/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Edit3 className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="font-serif text-xl">Review & Offer Copy</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Headlines & Subheadings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Reviews Heading</Label>
                <Input 
                  value={formData.reviews_heading || ""}
                  onChange={(e) => setFormData({...formData, reviews_heading: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Reviews Subheading</Label>
                <Input 
                  value={formData.reviews_subheading || ""}
                  onChange={(e) => setFormData({...formData, reviews_subheading: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
            </div>
            <hr className="border-onyx/5" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Offer Heading</Label>
                <Input 
                  value={formData.offer_heading || ""}
                  onChange={(e) => setFormData({...formData, offer_heading: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Offer Subheading</Label>
                <Input 
                  value={formData.offer_subheading || ""}
                  onChange={(e) => setFormData({...formData, offer_subheading: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Footer Information */}
        <Card className="border-none shadow-card overflow-hidden md:col-span-2">
          <CardHeader className="bg-onyx/[0.02] border-b border-onyx/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <MapPin className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="font-serif text-xl">Contact & Footer Information</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Global Contact Details & Social Links</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-3 space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Physical Address</Label>
                <Input 
                  value={formData.contact_address || ""}
                  onChange={(e) => setFormData({...formData, contact_address: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Phone Number</Label>
                <Input 
                  value={formData.contact_phone || ""}
                  onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Email Address</Label>
                <Input 
                  value={formData.contact_email || ""}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
            </div>
            
            <hr className="border-onyx/5" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Instagram URL</Label>
                <Input 
                  value={formData.instagram_url || ""}
                  onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Facebook URL</Label>
                <Input 
                  value={formData.facebook_url || ""}
                  onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Twitter URL</Label>
                <Input 
                  value={formData.twitter_url || ""}
                  onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">YouTube URL</Label>
                <Input 
                  value={formData.youtube_url || ""}
                  onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
