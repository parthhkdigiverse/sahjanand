import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContactPageData, updateContactPageData, ContactPageData, getImageUrl, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authService, authenticatedFetch } from "@/services/auth";
import { Loader2, Save, MapPin, Phone, Mail, Clock, Globe, Image as ImageIcon, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/contact-page")({
  component: AdminContactPage,
});

function AdminContactPage() {
  const queryClient = useQueryClient();
  const token = authService.getToken();

  const { data: contactData, isLoading, error: fetchError } = useQuery({
    queryKey: ["contact-page"],
    queryFn: fetchContactPageData,
  });

  const [formData, setFormData] = useState<Partial<ContactPageData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData with contactData when it loads or updates
  useEffect(() => {
    if (contactData) {
      setFormData(prev => {
        // If formData is empty, populate it
        if (Object.keys(prev).length === 0) {
          return contactData;
        }
        return prev;
      });
      
      if (contactData.hero_image && !imagePreview && !imageFile) {
        setImagePreview(contactData.hero_image);
      }
    }
  }, [contactData]);

  if (fetchError) {
    toast.error("Failed to load contact data. Please check your connection.");
  }

  const mutation = useMutation({
    mutationFn: (data: ContactPageData) => updateContactPageData(data, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-page"] });
      toast.success("Contact details updated successfully");
      setImageFile(null);
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast.error(`Failed to update: ${error.message || "Unknown error"}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading CMS Data...</p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
        let finalHeroImage = formData.hero_image || "";

        if (imageFile) {
          const uploadData = new FormData();
          uploadData.append("files", imageFile);
          
          const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
            method: "POST",
            body: uploadData,
          });

          if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.detail || "Image upload failed");
          }
          
          const result = await res.json();
          finalHeroImage = result.urls[0];
        }

        // Send the complete merged data
        const payload = {
            ...formData,
            hero_image: finalHeroImage
        } as ContactPageData;

        mutation.mutate(payload);
    } catch (err: any) {
        console.error("HandleSave error:", err);
        toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Contact Page CMS</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Manage your atelier's contact information and boutique details</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            variant="outline"
            onClick={() => {
                if (contactData) {
                    setFormData(contactData);
                    setImagePreview(contactData.hero_image || null);
                    setImageFile(null);
                    toast.info("Changes reset to database version");
                }
            }}
            disabled={mutation.isPending}
            className="flex-1 md:flex-none border-onyx/10 text-onyx/60 hover:bg-onyx/5 h-12 px-6 rounded-lg font-medium tracking-widest uppercase text-[10px]"
          >
            Reset Changes
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={mutation.isPending}
            className="flex-1 md:flex-none bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
          >
            {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-3 h-4 w-4" />}
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <Card className="border-none shadow-card overflow-hidden">
          <CardHeader className="bg-onyx/[0.02] border-b border-onyx/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <ImageIcon className="h-5 w-5 text-gold" />
              </div>
              <CardTitle className="font-serif text-xl">Hero Section</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Hero Image</Label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-xl border-2 border-dashed border-onyx/10 hover:border-gold/50 transition-all cursor-pointer overflow-hidden group bg-onyx/[0.02]"
                >
                  {imagePreview ? (
                    <>
                      <img 
                        src={getImageUrl(imagePreview)} 
                        alt="Hero Preview" 
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 p-3 rounded-full shadow-luxe">
                          <Upload className="h-5 w-5 text-onyx" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-gold/5 rounded-full">
                        <Upload className="h-6 w-6 text-gold/40" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-onyx/30 font-medium">Click to upload hero image</p>
                    </div>
                  )}
                </div>

                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                
                <p className="text-[10px] text-onyx/30 italic">Recommended size: 1920x1080px. Max size: 5MB.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Hero Eyebrow</Label>
                <Input 
                  value={formData.hero_eyebrow || ""}
                  onChange={(e) => setFormData({...formData, hero_eyebrow: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Hero Heading</Label>
                <Input 
                  value={formData.hero_heading || ""}
                  onChange={(e) => setFormData({...formData, hero_heading: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Hero Description</Label>
                <Textarea 
                  value={formData.hero_description || ""}
                  onChange={(e) => setFormData({...formData, hero_description: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutique Details */}
        <Card className="border-none shadow-card overflow-hidden">
          <CardHeader className="bg-onyx/[0.02] border-b border-onyx/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <MapPin className="h-5 w-5 text-gold" />
              </div>
              <CardTitle className="font-serif text-xl">Boutique & Atelier Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Address Line 1</Label>
                  <Input 
                    value={formData.boutique_address_line1 || ""}
                    onChange={(e) => setFormData({...formData, boutique_address_line1: e.target.value})}
                    className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Address Line 2</Label>
                  <Input 
                    value={formData.boutique_address_line2 || ""}
                    onChange={(e) => setFormData({...formData, boutique_address_line2: e.target.value})}
                    className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Concierge Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-onyx/30" />
                    <Input 
                      value={formData.concierge_phone || ""}
                      onChange={(e) => setFormData({...formData, concierge_phone: e.target.value})}
                      className="pl-12 bg-white border-onyx/5 focus:border-gold/50 h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Inquiries Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-onyx/30" />
                    <Input 
                      value={formData.inquiries_email || ""}
                      onChange={(e) => setFormData({...formData, inquiries_email: e.target.value})}
                      className="pl-12 bg-white border-onyx/5 focus:border-gold/50 h-12"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-onyx/5" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold" />
                  <span className="text-xs uppercase tracking-widest font-medium">Opening Hours</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Hours Line 1</Label>
                    <Input 
                      value={formData.opening_hours_line1 || ""}
                      onChange={(e) => setFormData({...formData, opening_hours_line1: e.target.value})}
                      className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                      placeholder="Tue – Sat · 11:00 – 19:00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Hours Line 2</Label>
                    <Input 
                      value={formData.opening_hours_line2 || ""}
                      onChange={(e) => setFormData({...formData, opening_hours_line2: e.target.value})}
                      className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                      placeholder="Sun & Mon · Private Appointments Only"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-onyx/5" />

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-gold" />
                  <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Google Maps Embed URL</Label>
                </div>
                <Input 
                  value={formData.map_embed_url || ""}
                  onChange={(e) => setFormData({...formData, map_embed_url: e.target.value})}
                  className="bg-white border-onyx/5 focus:border-gold/50 h-12"
                />
                <p className="text-[10px] text-onyx/30 italic">Copy the 'src' attribute from the Google Maps iframe embed code.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
