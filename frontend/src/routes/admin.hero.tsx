import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Loader2, ArrowUp, ArrowDown, Camera } from "lucide-react";
import { fetchHeroSlides, HeroSlide, API_BASE, getImageUrl, cleanImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/services/auth";

export const Route = createFileRoute("/admin/hero")({
  component: AdminHero,
});

function AdminHero() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    image: "",
    link_text: "Shop Now",
    link_url: "/shop",
    order: 0,
  });

  const { data: slides, isLoading } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: fetchHeroSlides,
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        image: cleanImageUrl(data.image)
      };
      if (editingSlide) {
        const res = await authenticatedFetch(`${API_BASE}/hero/${editingSlide._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update slide");
        return res.json();
      } else {
        const res = await authenticatedFetch(`${API_BASE}/hero/`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create slide");
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast.success(editingSlide ? "Slide updated" : "Slide created");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Error saving slide"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/hero/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete slide");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast.success("Slide deleted");
    },
    onError: () => toast.error("Error deleting slide"),
  });

  const resetForm = () => {
    setFormData({
      eyebrow: "",
      title: "",
      subtitle: "",
      image: "",
      link_text: "Shop Now",
      link_url: "/shop",
      order: slides?.length || 0,
    });
    setEditingSlide(null);
    setImagePreview(null);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      eyebrow: slide.eyebrow,
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
      link_text: slide.link_text,
      link_url: slide.link_url,
      order: slide.order,
    });
    setImagePreview(getImageUrl(slide.image));
    setIsDialogOpen(true);
  };

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
        setImagePreview(getImageUrl(imageUrl));
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-onyx">Hero Slides</h1>
          <p className="text-muted-foreground mt-1">Manage the homepage carousel slides</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gold hover:bg-gold/90 text-onyx">
          <Plus className="mr-2 h-4 w-4" /> Add Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-gold" /></div>
        ) : slides?.map((slide) => (
          <Card key={slide._id} className="overflow-hidden border-l-4 border-l-gold">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-48 h-48 md:h-auto relative">
                <img src={getImageUrl(slide.image)} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gold uppercase tracking-widest">— {slide.eyebrow}</p>
                    <h3 className="text-2xl font-serif mt-1">{slide.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm">{slide.subtitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(slide)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { if(confirm("Delete slide?")) deleteMutation.mutate(slide._id); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingSlide ? "Edit Slide" : "Add Slide"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Eyebrow Text</Label>
                <Input value={formData.eyebrow} onChange={e => setFormData({...formData, eyebrow: e.target.value})} placeholder="e.g. New Collection" />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Main Heading" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} placeholder="Short description" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Slide Image (Click to upload)</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-32 w-full overflow-hidden rounded-lg border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all bg-ivory/5"
                >
                  {imagePreview ? (
                    <>
                      <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-onyx/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                        <Camera className="h-6 w-6 text-gold" />
                      </div>
                    </>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20 gap-1">
                      <Plus className="h-6 w-6" />
                      <span className="text-[10px] uppercase tracking-widest">Add Photo</span>
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
                <Label>Button Text</Label>
                <Input value={formData.link_text} onChange={e => setFormData({...formData, link_text: e.target.value})} placeholder="e.g. Shop Now" />
              </div>
              <div className="space-y-2">
                <Label>Button Link (URL)</Label>
                <Input value={formData.link_url} onChange={e => setFormData({...formData, link_url: e.target.value})} placeholder="e.g. /shop or https://..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => upsertMutation.mutate(formData)} disabled={upsertMutation.isPending || isUploading}>
              {upsertMutation.isPending || isUploading ? "Saving..." : "Save Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
