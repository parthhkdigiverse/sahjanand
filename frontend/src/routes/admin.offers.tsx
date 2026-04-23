import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, Download, Mail, Phone, User, Calendar, Plus, Camera } from "lucide-react";
import { fetchSettings, SiteSettings, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/services/auth";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

function AdminOffers() {
  const queryClient = useQueryClient();
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
      });
      setImagePreview(settings.offer_image || null);
    }
  }, [settings]);

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["offer-leads"],
    queryFn: async () => {
      const res = await authenticatedFetch(`${API_BASE}/offer-leads/`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updated: any) => {
      // We need to provide ALL settings fields to avoid clearing others
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
      toast.success("Offer section updated");
    },
    onError: () => toast.error("Error updating settings"),
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/offer-leads/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead removed");
    },
    onError: () => toast.error("Error removing lead"),
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

  const exportLeads = () => {
    if (!leads) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Name,Email,Phone\n"
      + leads.map(l => `${new Date(l.created_at).toLocaleDateString()},${l.name},${l.email},${l.phone}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "offer_leads.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-onyx">Offers & Leads</h1>
        <p className="text-muted-foreground mt-1">Manage the welcome offer and popup text</p>
      </div>

      <Card className="border-gold/20 shadow-luxe">
        <CardHeader>
          <CardTitle className="font-serif">Offer Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subheading (Eyebrow)</Label>
                <Input value={settingsData.offer_subheading} onChange={e => setSettingsData({...settingsData, offer_subheading: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Main Heading</Label>
                <Input value={settingsData.offer_heading} onChange={e => setSettingsData({...settingsData, offer_heading: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={settingsData.offer_description} onChange={e => setSettingsData({...settingsData, offer_description: e.target.value})} rows={4} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Offer Image (Click image to update)</Label>
                <div className="flex flex-col gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all bg-ivory/5"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-onyx/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <Camera className="h-6 w-6 text-gold mb-2" />
                          <span className="text-ivory text-[10px] uppercase tracking-[0.2em] font-medium">Change Photo</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20 gap-2">
                        <Plus className="h-8 w-8" />
                        <span className="text-[10px] uppercase tracking-widest">Upload Banner</span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                        <Loader2 className="animate-spin h-6 w-6 text-gold" />
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
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-gold/10">
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-gold">Lead Popup Customization</h3>
              <div className="space-y-2">
                <Label>Popup Eyebrow (e.g. Claim Offer)</Label>
                <Input value={settingsData.popup_eyebrow} onChange={e => setSettingsData({...settingsData, popup_eyebrow: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Popup Main Heading</Label>
                <Input value={settingsData.popup_heading} onChange={e => setSettingsData({...settingsData, popup_heading: e.target.value})} />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="space-y-2">
                <Label>Popup Description</Label>
                <Textarea value={settingsData.popup_description} onChange={e => setSettingsData({...settingsData, popup_description: e.target.value})} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Popup Button Text</Label>
                <Input value={settingsData.popup_button_text} onChange={e => setSettingsData({...settingsData, popup_button_text: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => updateSettingsMutation.mutate(settingsData)} 
              disabled={updateSettingsMutation.isPending || isUploading}
              className="bg-onyx text-white hover:bg-gold hover:text-onyx min-w-[200px]"
            >
              {updateSettingsMutation.isPending ? "Updating..." : "Save Offer Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-gold/20 shadow-luxe">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif">Collected Leads</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={exportLeads}
            className="gap-2 border-gold/30 hover:border-gold"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {leadsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-gold" /></div>
          ) : !leads || leads.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No leads collected yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Offer Code</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-gold" />
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gold" />
                        {lead.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gold" />
                        {lead.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-gold/10 text-gold text-xs font-medium px-2 py-1 rounded">{lead.offer_code}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm("Delete this lead?")) deleteLeadMutation.mutate(lead._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
