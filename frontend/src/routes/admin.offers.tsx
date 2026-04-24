import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Plus, 
  Camera,
  Trash2,
  Mail,
  Phone,
  CheckCircle2,
  Circle,
  Inbox,
  Search,
  Filter,
  X,
  PlusCircle,
  Settings2
} from "lucide-react";
import { 
  fetchSettings, 
  API_BASE,
  getImageUrl,
  fetchOfferLeads,
  toggleOfferLeadRead,
  deleteOfferLead,
  FormField,
  OfferLead
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch, authService } from "@/services/auth";
import { motion, AnimatePresence } from "framer-motion";

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
    form_fields: [] as FormField[],
  });

  // Leads State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread">("all");

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<OfferLead[]>({
    queryKey: ["offer-leads"],
    queryFn: () => fetchOfferLeads(token),
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
        form_fields: settings.form_fields || [],
      });
      setImagePreview(settings.offer_image || null);
    }
  }, [settings]);

  // Mutations
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

  const toggleReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => toggleOfferLeadRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead status updated");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteOfferLead(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead removed");
    },
  });

  // Handlers
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
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      required: false,
      is_constant: false
    };
    setSettingsData(prev => ({
      ...prev,
      form_fields: [...prev.form_fields, newField]
    }));
  };

  const removeField = (id: string) => {
    setSettingsData(prev => ({
      ...prev,
      form_fields: prev.form_fields.filter(f => f.id !== id || f.is_constant)
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setSettingsData(prev => ({
      ...prev,
      form_fields: prev.form_fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const filteredLeads = leads?.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === "unread") return matchesSearch && !l.is_read;
    return matchesSearch;
  });

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx font-bold">Promotions & Leads</h1>
          <p className="text-muted-foreground text-sm">Design your offer experience and manage your customer leads</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            onClick={() => updateSettingsMutation.mutate(settingsData)} 
            disabled={updateSettingsMutation.isPending || isUploading}
            className="bg-onyx text-white hover:bg-gold hover:text-onyx flex-1 md:flex-none h-12 text-[10px] uppercase tracking-widest font-bold"
          >
            {updateSettingsMutation.isPending ? "Syncing..." : "Save All Changes"}
          </Button>
        </div>
      </header>

      {/* CONFIGURATION SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Banner & Popup Config */}
        <Card className="border-onyx/5 shadow-luxe overflow-hidden bg-white/50 backdrop-blur-sm h-full">
          <CardHeader className="border-b border-onyx/5 bg-ivory/20">
            <CardTitle className="font-serif text-sm flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-gold" />
              Banner & Popup Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Homepage Banner</h4>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Banner Eyebrow</Label>
                  <Input value={settingsData.offer_subheading} onChange={e => setSettingsData({...settingsData, offer_subheading: e.target.value})} className="h-10 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Banner Heading</Label>
                  <Input value={settingsData.offer_heading} onChange={e => setSettingsData({...settingsData, offer_heading: e.target.value})} className="h-10 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Banner Description</Label>
                  <Textarea value={settingsData.offer_description} onChange={e => setSettingsData({...settingsData, offer_description: e.target.value})} rows={2} className="text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Button Text</Label>
                    <Input value={settingsData.offer_button_text} onChange={e => setSettingsData({...settingsData, offer_button_text: e.target.value})} className="h-10 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Footer Text</Label>
                    <Input value={settingsData.offer_footer_text} onChange={e => setSettingsData({...settingsData, offer_footer_text: e.target.value})} className="h-10 text-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-onyx/5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Lead Popup</h4>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Eyebrow</Label>
                  <Input value={settingsData.popup_eyebrow} onChange={e => setSettingsData({...settingsData, popup_eyebrow: e.target.value})} className="h-10 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Heading</Label>
                  <Input value={settingsData.popup_heading} onChange={e => setSettingsData({...settingsData, popup_heading: e.target.value})} className="h-10 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Description</Label>
                  <Textarea value={settingsData.popup_description} onChange={e => setSettingsData({...settingsData, popup_description: e.target.value})} rows={2} className="text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Popup Button</Label>
                  <Input value={settingsData.popup_button_text} onChange={e => setSettingsData({...settingsData, popup_button_text: e.target.value})} className="h-10 text-xs" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FORM FIELD CRUD */}
        <Card className="border-onyx/5 shadow-luxe overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-onyx/5 bg-ivory/20 flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-sm flex items-center gap-2">
              <Inbox className="h-4 w-4 text-gold" />
              Dynamic Form Fields
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={addField} className="h-7 text-[9px] uppercase tracking-widest text-gold hover:text-onyx hover:bg-gold">
              <PlusCircle className="h-3 w-3 mr-1" /> Add Field
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-onyx/5">
              {settingsData.form_fields.map((field) => (
                <div key={field.id} className="p-4 space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${field.is_constant ? "text-gold" : "text-onyx/40"}`}>
                      {field.is_constant ? "System Constant" : "Dynamic Field"}
                    </span>
                    {!field.is_constant && (
                      <Button variant="ghost" size="sm" onClick={() => removeField(field.id)} className="h-6 w-6 p-0 text-red-500/30 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[8px] uppercase tracking-tighter text-onyx/30">Label</Label>
                      <Input 
                        value={field.label} 
                        onChange={e => updateField(field.id, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })} 
                        placeholder="e.g. Email Address"
                        className="h-8 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] uppercase tracking-tighter text-onyx/30">Type</Label>
                      <Select 
                        disabled={field.is_constant} 
                        value={field.type} 
                        onValueChange={v => updateField(field.id, { type: v })}
                      >
                        <SelectTrigger className="h-8 text-[10px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {!field.is_constant && (
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id={`req-${field.id}`} 
                        checked={field.required} 
                        onCheckedChange={v => updateField(field.id, { required: !!v })} 
                      />
                      <Label htmlFor={`req-${field.id}`} className="text-[9px] uppercase tracking-widest text-onyx/50 cursor-pointer">Required Field</Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
