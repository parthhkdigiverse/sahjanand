import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Plus, 
  Camera,
  Trash2,
  Edit2,
  Search,
  Ticket,
  Users,
  Settings2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  fetchSettings, 
  API_BASE,
  getImageUrl,
  fetchOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  Offer
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch, authService } from "@/services/auth";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

function AdminOffers() {
  const queryClient = useQueryClient();
  const token = authService.getToken() || "";
  
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

  const { data: offers, isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: fetchOffers,
  });

  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const { data: leads, isLoading: leadsLoading } = useQuery<any[]>({
    queryKey: ["offer-leads"],
    queryFn: async () => {
      const res = await authenticatedFetch(`${API_BASE}/offer-leads/`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  // Offer Modal State
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerFormData, setOfferFormData] = useState({
    title: "",
    description: "",
    code: "",
    is_active: true,
    expiry_date: ""
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

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: async (updated: any) => {
      const res = await authenticatedFetch(`${API_BASE}/settings/`, {
        method: "PUT",
        body: JSON.stringify({ ...settings, ...updated }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["settings"] }); toast.success("Synced"); },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: (id: string) => deleteOffer(id, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["offers"] }),
  });

  const createOfferMutation = useMutation({
    mutationFn: (data: Partial<Offer>) => createOffer(data, token),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["offers"] }); setIsOfferDialogOpen(false); },
  });

  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Offer> }) => updateOffer(id, data, token),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["offers"] }); setIsOfferDialogOpen(false); },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => authenticatedFetch(`${API_BASE}/offer-leads/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["offer-leads"] }),
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const fd = new FormData(); fd.append("files", file);
    try {
      const res = await authenticatedFetch(`${API_BASE}/uploads/`, { method: "POST", body: fd });
      if (res.ok) {
        const result = await res.json();
        setSettingsData(p => ({ ...p, offer_image: result.urls[0] }));
        setImagePreview(result.urls[0]);
      }
    } finally { setIsUploading(false); }
  };

  const filteredLeads = leads?.filter(l => 
    l.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    l.offer_code.toLowerCase().includes(leadSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-serif text-onyx flex items-center gap-2">
          <Ticket className="h-5 w-5 text-gold" />
          Offers & Patron Leads
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => updateSettingsMutation.mutate(settingsData)} 
            disabled={updateSettingsMutation.isPending}
            className="h-8 bg-onyx text-[10px] uppercase tracking-widest px-4"
          >
            {updateSettingsMutation.isPending ? <Loader2 className="animate-spin h-3 w-3" /> : "Save All Settings"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT: SETTINGS (Compact) */}
        <div className="xl:col-span-4 space-y-4">
          <Card className="border-gold/10 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="py-3 px-4 border-b border-gold/5 bg-gold/5">
              <CardTitle className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Settings2 className="h-3 w-3 text-gold" />
                Banner & Popup
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-32 w-full overflow-hidden rounded-lg border border-dashed border-gold/30 cursor-pointer bg-ivory/20 group"
              >
                {imagePreview ? (
                  <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20 text-[10px] uppercase tracking-widest">
                    <Camera className="h-5 w-5 mb-1" />
                    Upload Banner
                  </div>
                )}
                {isUploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin h-4 w-4 text-gold" /></div>}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase tracking-widest opacity-50">Eyebrow</Label>
                  <Input className="h-8 text-xs" value={settingsData.offer_subheading} onChange={e => setSettingsData({...settingsData, offer_subheading: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase tracking-widest opacity-50">Heading</Label>
                  <Input className="h-8 text-xs" value={settingsData.offer_heading} onChange={e => setSettingsData({...settingsData, offer_heading: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[9px] uppercase tracking-widest opacity-50">Description</Label>
                <Textarea className="text-xs min-h-[60px]" value={settingsData.offer_description} onChange={e => setSettingsData({...settingsData, offer_description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-gold/5 pt-3">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase tracking-widest opacity-50 text-gold">Popup Head</Label>
                  <Input className="h-8 text-xs" value={settingsData.popup_heading} onChange={e => setSettingsData({...settingsData, popup_heading: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase tracking-widest opacity-50 text-gold">Popup Text</Label>
                  <Input className="h-8 text-xs" value={settingsData.popup_description} onChange={e => setSettingsData({...settingsData, popup_description: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE: OFFERS LIST */}
        <div className="xl:col-span-8 space-y-4">
          <Card className="border-onyx/5 shadow-sm bg-white">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-onyx/5">
              <CardTitle className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Ticket className="h-3 w-3 text-gold" />
                Active Promotions
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => { setEditingOffer(null); setOfferFormData({ title: "", description: "", code: "", is_active: true, expiry_date: "" }); setIsOfferDialogOpen(true); }}
                className="h-6 px-3 text-[9px] uppercase tracking-widest bg-gold text-onyx hover:bg-gold/80"
              >
                <Plus className="h-3 w-3 mr-1" /> New
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory/50 border-b border-onyx/5 text-[9px] uppercase tracking-widest font-black text-onyx/30">
                    <tr>
                      <th className="p-3">Title & Code</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-onyx/5">
                    {offers?.map(offer => (
                      <tr key={offer._id} className="hover:bg-ivory/20 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-onyx">{offer.title}</div>
                          <div className="text-[9px] font-mono text-gold uppercase">{offer.code}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest ${offer.is_active ? "bg-green-50 text-green-600" : "bg-onyx/5 text-onyx/40"}`}>
                            {offer.is_active ? "Active" : "Paused"}
                          </span>
                        </td>
                        <td className="p-3 text-[10px] text-onyx/40">{offer.expiry_date || "—"}</td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingOffer(offer); setOfferFormData({ title: offer.title, description: offer.description, code: offer.code, is_active: offer.is_active, expiry_date: offer.expiry_date || "" }); setIsOfferDialogOpen(true); }}><Edit2 size={10} /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500/40 hover:text-red-500" onClick={() => confirm("Delete?") && deleteOfferMutation.mutate(offer._id)}><Trash2 size={10} /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* BOTTOM: PATRON LEADS (Wide Table) */}
          <Card className="border-onyx/5 shadow-sm bg-white">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-onyx/5">
              <CardTitle className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Users className="h-3 w-3 text-gold" />
                Patron Database
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-onyx/20" />
                <input 
                  className="h-7 w-40 pl-7 pr-3 bg-ivory/20 border border-onyx/5 rounded text-[10px] outline-none" 
                  placeholder="Search..." 
                  value={leadSearchTerm}
                  onChange={e => setLeadSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[400px] overflow-y-auto scrollbar-hide">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-ivory/50 sticky top-0 border-b border-onyx/5 text-[8px] uppercase tracking-widest font-black text-onyx/30 z-10">
                  <tr>
                    <th className="p-3">Patron Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Offer Code</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-onyx/5">
                  {filteredLeads?.map(lead => (
                    <tr key={lead._id} className="hover:bg-ivory/20 transition-colors">
                      <td className="p-3 font-bold">{lead.name}</td>
                      <td className="p-3">
                        <div className="text-gold font-medium">{lead.email}</div>
                        <div className="text-[9px] opacity-40">{lead.phone}</div>
                      </td>
                      <td className="p-3 font-mono opacity-60 uppercase">{lead.offer_code}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500/20 hover:text-red-500" onClick={() => confirm("Delete?") && deleteLeadMutation.mutate(lead._id)}><Trash2 size={10} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-sm font-serif">Promotion Details</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 gap-2">
              <Label className="text-[8px] uppercase tracking-widest">Title</Label>
              <Input className="h-8 text-xs" value={offerFormData.title} onChange={e => setOfferFormData({...offerFormData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label className="text-[8px] uppercase tracking-widest">Description</Label>
              <Textarea className="text-xs min-h-[50px]" value={offerFormData.description} onChange={e => setOfferFormData({...offerFormData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[8px] uppercase tracking-widest">Code</Label>
                <Input className="h-8 text-xs" value={offerFormData.code} onChange={e => setOfferFormData({...offerFormData, code: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] uppercase tracking-widest">Expiry</Label>
                <Input className="h-8 text-xs" type="date" value={offerFormData.expiry_date} onChange={e => setOfferFormData({...offerFormData, expiry_date: e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" checked={offerFormData.is_active} onChange={e => setOfferFormData({...offerFormData, is_active: e.target.checked})} />
              <Label className="text-[9px] uppercase tracking-widest">Active Promotion</Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button size="sm" variant="outline" className="text-[10px]" onClick={() => setIsOfferDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gold text-onyx text-[10px]" onClick={handleOfferSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
