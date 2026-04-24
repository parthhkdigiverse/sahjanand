import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, Quote, Play, Plus, Edit2, Camera, Settings } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { fetchSettings, API_BASE, getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonials,
});

type Testimonial = {
  _id: string;
  image: string;
  name: string;
  quote: string;
  video_url?: string;
};

const EMPTY_FORM = {
  image: "",
  name: "",
  quote: "",
  video_url: "",
};

function AdminTestimonials() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settingsData, setSettingsData] = useState({
    testimonials_heading: "",
    testimonials_subheading: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      setSettingsData({
        testimonials_heading: (settings as any).testimonials_heading || "",
        testimonials_subheading: (settings as any).testimonials_subheading || "",
      });
    }
  }, [settings]);

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => fetch(`${API_BASE}/testimonials/`).then(res => res.json())
  });

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
      toast.success("Section settings updated");
    },
    onError: () => toast.error("Error updating settings"),
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof EMPTY_FORM) => {
      const payload = { ...data, video_url: data.video_url || undefined };
      const res = await authenticatedFetch(`${API_BASE}/testimonials/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create testimonial");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial created");
      closeDialog();
    },
    onError: () => toast.error("Error creating testimonial"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof EMPTY_FORM }) => {
      const payload = { ...data, video_url: data.video_url || undefined };
      const res = await authenticatedFetch(`${API_BASE}/testimonials/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update testimonial");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial updated");
      closeDialog();
    },
    onError: () => toast.error("Error updating testimonial"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete testimonial");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial removed");
    },
    onError: () => toast.error("Error deleting testimonial"),
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
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const openCreate = () => {
    setEditingTestimonial(null);
    setFormData(EMPTY_FORM);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({
      image: t.image,
      name: t.name,
      quote: t.quote,
      video_url: t.video_url || "",
    });
    setImagePreview(t.image || null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    setFormData(EMPTY_FORM);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.name || !formData.quote) {
      toast.error("Image, name and quote are required");
      return;
    }
    
    const payload = {
      ...formData,
      image: cleanImageUrl(formData.image)
    };

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial._id, data: payload as any });
    } else {
      createMutation.mutate(payload as any);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-onyx">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client testimonials shown on the homepage</p>
        </div>
        <Button onClick={openCreate} className="bg-gold hover:bg-gold/90 text-onyx">
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Section Header Settings */}
      <Card className="border-onyx/5 shadow-card rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-[#FAF9F6] border-b border-onyx/5 p-8">
          <CardTitle className="font-serif text-xl text-onyx flex items-center gap-2">
            <Settings className="h-4 w-4 text-gold" /> Section Header Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Section Heading</Label>
              <Input
                value={settingsData.testimonials_heading}
                onChange={(e) => setSettingsData({ ...settingsData, testimonials_heading: e.target.value })}
                placeholder="What Our Clients Say"
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Section Subheading</Label>
              <Input
                value={settingsData.testimonials_subheading}
                onChange={(e) => setSettingsData({ ...settingsData, testimonials_subheading: e.target.value })}
                placeholder="Real stories from real patrons"
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => updateSettingsMutation.mutate(settingsData)}
              disabled={updateSettingsMutation.isPending}
              className="admin-btn-gold h-12 px-10 text-[10px] shadow-xl"
            >
              {updateSettingsMutation.isPending ? "Syncing..." : "Update Header Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Photo (Click to upload)</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-40 w-full overflow-hidden rounded-lg border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all bg-ivory/5"
              >
                {imagePreview ? (
                  <>
                    <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="preview" />
                    <div className="absolute inset-0 bg-onyx/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                      <Camera className="h-6 w-6 text-gold" />
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-onyx/30 gap-2">
                    <Camera className="h-8 w-8" />
                    <span className="text-xs uppercase tracking-widest">Upload Photo</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                    <Loader2 className="animate-spin h-5 w-5 text-gold" />
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

            <div className="space-y-2">
              <Label htmlFor="t_name">Client Name</Label>
              <Input
                id="t_name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="t_quote">Quote / Testimonial</Label>
              <Textarea
                id="t_quote"
                value={formData.quote}
                onChange={e => setFormData({ ...formData, quote: e.target.value })}
                placeholder="What did they say about us?"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="t_video">Video URL (optional)</Label>
              <Input
                id="t_video"
                value={formData.video_url}
                onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={isSaving || isUploading} className="bg-gold hover:bg-gold/90 text-onyx">
                {isSaving ? "Saving..." : editingTestimonial ? "Update Testimonial" : "Create Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-gold" />
          </div>
        ) : !testimonials || testimonials.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-16 text-center text-muted-foreground">
              <Quote className="h-10 w-10 mx-auto mb-4 text-gold/30" />
              <p>No testimonials yet. Add your first one!</p>
            </CardContent>
          </Card>
        ) : testimonials.map((testimonial) => (
          <Card key={testimonial._id} className="overflow-hidden flex flex-col border-gold/10 hover:border-gold/30 transition-colors">
            <div className="relative h-48 bg-gray-100">
                <img
                src={getImageUrl(testimonial.image)}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
              {testimonial.video_url && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="text-white h-12 w-12 opacity-80" />
                </div>
              )}
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-serif">{testimonial.name}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => openEdit(testimonial)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 -mr-2"
                  onClick={() => {
                    if (confirm("Permanently delete this testimonial?")) {
                      deleteMutation.mutate(testimonial._id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex gap-2 items-start text-muted-foreground italic bg-gray-50 p-4 rounded-md h-full">
                <Quote className="h-4 w-4 text-gold shrink-0 mt-1" />
                <p className="text-sm">"{testimonial.quote}"</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
