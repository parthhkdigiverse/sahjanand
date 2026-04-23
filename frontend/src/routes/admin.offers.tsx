import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Plus, 
  Camera
} from "lucide-react";
import { 
  fetchSettings, 
  API_BASE,
  getImageUrl
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/services/auth";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

function AdminOffers() {
  const queryClient = useQueryClient();
  
  // Settings State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settingsData, setSettingsData] = useState({
    offer_heading: "",
    offer_subheading: "",
    offer_description: "",
    offer_image: "",
    popup_eyebrow: "",
    popup_heading: "",
    popup_description: "",
    popup_button_text: "",
    offer_button_text: "",
    offer_footer_text: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      setSettingsData({
        offer_heading: settings.offer_heading || "",
        offer_subheading: settings.offer_subheading || "",
        offer_description: settings.offer_description || "",
        offer_image: settings.offer_image || "",
        popup_eyebrow: settings.popup_eyebrow || "",
        popup_heading: settings.popup_heading || "",
        popup_description: settings.popup_description || "",
        popup_button_text: settings.popup_button_text || "",
        offer_button_text: settings.offer_button_text || "",
        offer_footer_text: settings.offer_footer_text || "",
      });
      setImagePreview(settings.offer_image || null);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (updated: any) => {
      const fullSettings = { ...settings, ...updated };
      const res = await authenticatedFetch(`${API_BASE}/settings/`, {
        method: "PUT",
        body: JSON.stringify(fullSettings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Offer settings updated");
    },
    onError: () => toast.error("Error updating settings"),
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const fileData = new FormData();
    fileData.append("files", file);
    try {
      const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
        method: "POST",
        body: fileData,
      });
      if (res.ok) {
        const result = await res.json();
        const imageUrl = result.urls[0];
        setSettingsData(prev => ({ ...prev, offer_image: imageUrl }));
        setImagePreview(imageUrl);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx">Offer & Lead Settings</h1>
          <p className="text-muted-foreground text-sm">Configure your homepage offer and lead capture popup</p>
        </div>
      </header>

      <Card className="border-gold/20 shadow-luxe">
        <CardHeader className="border-b border-gold/10 bg-ivory/20">
          <CardTitle className="font-serif text-lg">Lead Capture & Popup Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Homepage Banner</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Eyebrow (Small text)</Label>
                  <Input value={settingsData.offer_subheading} onChange={e => setSettingsData({...settingsData, offer_subheading: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Main Heading</Label>
                  <Input value={settingsData.offer_heading} onChange={e => setSettingsData({...settingsData, offer_heading: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Short Description</Label>
                  <Textarea value={settingsData.offer_description} onChange={e => setSettingsData({...settingsData, offer_description: e.target.value})} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Button Text</Label>
                  <Input value={settingsData.offer_button_text} onChange={e => setSettingsData({...settingsData, offer_button_text: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Footer Text (e.g. Limited time)</Label>
                  <Input value={settingsData.offer_footer_text} onChange={e => setSettingsData({...settingsData, offer_footer_text: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Section Image</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-64 w-full overflow-hidden rounded-xl border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all bg-ivory/5 shadow-inner"
              >
                {imagePreview ? (
                  <>
                    <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-onyx/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <Camera className="h-8 w-8 text-gold mb-3 animate-in zoom-in duration-300" />
                      <span className="text-ivory text-[10px] uppercase tracking-[0.3em] font-medium">Change Atelier Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-onyx/10 gap-3">
                    <Plus className="h-12 w-12" />
                    <span className="text-xs uppercase tracking-widest">Upload Banner</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                    <Loader2 className="animate-spin h-8 w-8 text-gold" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} 
              />
            </div>
          </div>

          <div className="pt-10 border-t border-gold/10">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gold mb-8">Lead Form Popup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Eyebrow</Label>
                  <Input value={settingsData.popup_eyebrow} onChange={e => setSettingsData({...settingsData, popup_eyebrow: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Main Heading</Label>
                  <Input value={settingsData.popup_heading} onChange={e => setSettingsData({...settingsData, popup_heading: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Description</Label>
                  <Textarea value={settingsData.popup_description} onChange={e => setSettingsData({...settingsData, popup_description: e.target.value})} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Button Text</Label>
                  <Input value={settingsData.popup_button_text} onChange={e => setSettingsData({...settingsData, popup_button_text: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={() => updateSettingsMutation.mutate(settingsData)} 
              disabled={updateSettingsMutation.isPending || isUploading}
              className="bg-onyx text-white hover:bg-gold hover:text-onyx min-w-[250px] h-12 text-xs uppercase tracking-widest"
            >
              {updateSettingsMutation.isPending ? "Syncing..." : "Save atelier settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
