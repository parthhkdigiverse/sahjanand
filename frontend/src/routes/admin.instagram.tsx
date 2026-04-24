import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Loader2, Camera, ExternalLink } from "lucide-react";
import { fetchInstagramPosts, InstagramPost, API_BASE, getImageUrl, fetchSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/services/auth";

export const Route = createFileRoute("/admin/instagram")({
  component: AdminInstagram,
});

function AdminInstagram() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    image_url: "",
    link: "#",
    order: 0,
  });

  // Settings State
  const [headerData, setHeaderData] = useState({
    instagram_eyebrow: "",
    instagram_heading: "",
    instagram_subheading: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      setHeaderData({
        instagram_eyebrow: settings.instagram_eyebrow || "",
        instagram_heading: settings.instagram_heading || "",
        instagram_subheading: settings.instagram_subheading || "",
      });
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
      toast.success("Header settings updated");
    },
    onError: () => toast.error("Error updating settings"),
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: fetchInstagramPosts,
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingPost) {
        const res = await authenticatedFetch(`${API_BASE}/instagram/${editingPost._id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update post");
        return res.json();
      } else {
        const res = await authenticatedFetch(`${API_BASE}/instagram/`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create post");
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
      toast.success(editingPost ? "Post updated" : "Post created");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Error saving post"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/instagram/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
      toast.success("Post deleted from feed");
    },
    onError: () => toast.error("Error deleting post"),
  });

  const resetForm = () => {
    setFormData({
      image_url: "",
      link: "#",
      order: posts?.length || 0,
    });
    setEditingPost(null);
    setImagePreview(null);
  };

  const handleEdit = (post: InstagramPost) => {
    setEditingPost(post);
    setFormData({
      image_url: post.image_url,
      link: post.link,
      order: post.order,
    });
    setImagePreview(getImageUrl(post.image_url));
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
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        setImagePreview(getImageUrl(imageUrl));
        toast.success("Design uploaded");
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
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Instagram Feed</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Curating your social presence</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Add Post
        </Button>
      </div>

      <Card className="border-onyx/5 shadow-card rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#FAF9F6] border-b border-onyx/5 p-8">
          <CardTitle className="font-serif text-xl text-onyx">Header Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Eyebrow (@tag)</Label>
              <Input 
                value={headerData.instagram_eyebrow} 
                onChange={e => setHeaderData({...headerData, instagram_eyebrow: e.target.value})} 
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Main Heading</Label>
              <Input 
                value={headerData.instagram_heading} 
                onChange={e => setHeaderData({...headerData, instagram_heading: e.target.value})} 
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Subheading</Label>
              <Input 
                value={headerData.instagram_subheading} 
                onChange={e => setHeaderData({...headerData, instagram_subheading: e.target.value})} 
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => updateSettingsMutation.mutate(headerData)}
              disabled={updateSettingsMutation.isPending}
              className="admin-btn-gold h-12 px-10 text-[10px] shadow-xl"
            >
              {updateSettingsMutation.isPending ? "Saving..." : "Update Header"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl text-onyx">Post Collection</h2>
          <div className="h-px flex-1 bg-onyx/5" />
        </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin h-12 w-12 text-gold/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading Feed...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts?.map((post) => (
            <Card key={post._id} className="group relative aspect-square overflow-hidden rounded-xl border-none shadow-card hover:shadow-luxe transition-all duration-500">
              <img 
                src={getImageUrl(post.image_url)} 
                alt={`Feed ${post.order}`} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 bg-ivory/10 hover:bg-gold hover:text-onyx text-ivory rounded-full transition-all duration-500"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 bg-ivory/10 hover:bg-red-500/20 hover:text-red-500 text-ivory rounded-full transition-all duration-500"
                    onClick={() => { if(confirm("Remove this post from feeed?")) deleteMutation.mutate(post._id); }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                {post.link !== "#" && (
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.2em] text-ivory/60 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    View Original <ExternalLink size={12} />
                  </a>
                )}
                <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.3em] text-ivory/40">
                  Order: {post.order}
                </div>
              </div>
            </Card>
          ))}
          {posts?.length === 0 && (
            <div className="col-span-full py-32 text-center bg-white rounded-2xl border border-dashed border-onyx/10">
              <p className="font-serif italic text-onyx/40 text-xl">Your Instagram feed is currently quiet.</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-gold hover:text-gold/80 uppercase tracking-widest text-[10px]"
                onClick={() => setIsDialogOpen(true)}
              >
                Add the first post
              </Button>
            </div>
          )}
        </div>
      )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-ivory border-none shadow-luxe">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-onyx">
              {editingPost ? "Edit Feed Post" : "Add New Feed Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">Post Image</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-onyx/10 group cursor-pointer hover:border-gold/50 transition-all bg-white shadow-inner flex items-center justify-center"
              >
                {imagePreview ? (
                  <>
                    <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-onyx/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-gold" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-onyx/20">
                    <Camera className="h-10 w-10" />
                    <span className="text-[10px] uppercase tracking-[0.2em]">Select Image</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
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

            <div className="space-y-2">
              <Label htmlFor="link" className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">Instagram Link</Label>
              <Input 
                id="link"
                className="bg-white border-onyx/5 focus:border-gold/50"
                value={formData.link} 
                onChange={e => setFormData({...formData, link: e.target.value})} 
                placeholder="https://instagram.com/p/..." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order" className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">Display Order</Label>
              <Input 
                id="order"
                type="number"
                className="bg-white border-onyx/5 focus:border-gold/50"
                value={formData.order} 
                onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button 
              onClick={() => upsertMutation.mutate(formData)} 
              disabled={upsertMutation.isPending || isUploading || !formData.image_url}
              className="bg-onyx text-ivory hover:bg-gold hover:text-onyx uppercase tracking-widest text-[10px] px-8 shadow-luxe"
            >
              {upsertMutation.isPending || isUploading ? "Saving..." : "Save Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
