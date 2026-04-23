import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { type GalleryItem, type GallerySettings, API_BASE, getImageUrl, fetchGallerySettings, updateGallerySettings } from "@/lib/api";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Controlled state for gallery settings
  const [headerSettings, setHeaderSettings] = useState({
    eyebrow: "",
    heading: "",
    subheading: ""
  });

  const { data: items, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: () => fetch(`${API_BASE}/gallery/`).then(res => res.json())
  });

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["gallery-settings"],
    queryFn: fetchGallerySettings
  });

  // Sync settings to state when loaded
  useEffect(() => {
    if (settings) {
      setHeaderSettings({
        eyebrow: settings.eyebrow,
        heading: settings.heading,
        subheading: settings.subheading
      });
    }
  }, [settings]);

  const settingsMutation = useMutation({
    mutationFn: (data: any) => updateGallerySettings(data, localStorage.getItem("maison_aurum_admin_token") || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-settings"] });
      toast.success("Gallery header updated");
    },
    onError: () => toast.error("Failed to update gallery header")
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const isEdit = !!editingItem;
      const url = isEdit 
        ? `${API_BASE}/gallery/${editingItem.id}` 
        : `${API_BASE}/gallery/`;
      
      const res = await authenticatedFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to save item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success(editingItem ? "Item updated" : "Item added to gallery");
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => toast.error(error.message || "An error occurred")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Item removed from gallery");
    },
    onError: () => toast.error("Error deleting item")
  });

  const handleOpenDialog = (item: GalleryItem | null = null) => {
    setEditingItem(item);
    setImagePreview(item?.image || null);
    setIsDialogOpen(true);
  };

  const filteredItems = items?.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Gallery Management</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Showcasing the artistry of Maison Aurum</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Add Gallery Item
        </Button>
      </div>

      {/* Gallery Header Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-card border border-onyx/5 space-y-6">
        <div className="flex items-center gap-3 border-b border-onyx/5 pb-4">
          <Edit className="h-5 w-5 text-gold" />
          <h2 className="text-xl font-serif text-onyx">Gallery Header Content</h2>
        </div>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            settingsMutation.mutate(headerSettings);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="eyebrow">Eyebrow Text</Label>
            <Input 
              id="eyebrow" 
              name="eyebrow" 
              value={headerSettings.eyebrow} 
              onChange={(e) => setHeaderSettings(prev => ({ ...prev, eyebrow: e.target.value }))}
              placeholder="ATELIER GALLERY" 
              disabled={isSettingsLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heading">Main Heading</Label>
            <Input 
              id="heading" 
              name="heading" 
              value={headerSettings.heading} 
              onChange={(e) => setHeaderSettings(prev => ({ ...prev, heading: e.target.value }))}
              placeholder="Moments of Brilliance" 
              disabled={isSettingsLoading}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="subheading">Subheading / Description</Label>
            <Textarea 
              id="subheading" 
              name="subheading" 
              value={headerSettings.subheading} 
              onChange={(e) => setHeaderSettings(prev => ({ ...prev, subheading: e.target.value }))}
              placeholder="A visual journey through our atelier..." 
              disabled={isSettingsLoading}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={settingsMutation.isPending || isSettingsLoading} className="bg-gold text-onyx hover:bg-gold/80 transition-all">
              {settingsMutation.isPending ? "Updating..." : "Save Header Settings"}
              {isSettingsLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/20 h-4 w-4 group-focus-within:text-gold transition-colors" />
          <Input 
            className="pl-12 h-14 bg-white border-onyx/5 rounded-xl shadow-card placeholder:text-onyx/20 focus-visible:ring-gold/30 transition-all" 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-14 px-6 bg-white border border-onyx/5 rounded-xl shadow-card flex items-center gap-2 text-onyx/40 text-xs">
          <span className="uppercase tracking-widest">Total Items:</span>
          <span className="font-medium text-onyx">{filteredItems?.length || 0}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-onyx/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="w-[120px] py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Preview</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Title</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Order</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading Gallery...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-onyx/40 italic font-serif">
                  No gallery items found.
                </TableCell>
              </TableRow>
            ) : filteredItems?.map((item) => (
              <TableRow key={item.id} className="group hover:bg-ivory/20 transition-colors border-onyx/5">
                <TableCell className="py-6 px-8">
                  <div className="relative h-16 w-16 group/img">
                    <img src={getImageUrl(item.image)} alt={item.title} className="h-full w-full object-cover rounded shadow-sm border border-onyx/5 transition-transform duration-500 group-hover/img:scale-110" />
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-lg text-onyx">{item.title}</div>
                  <div className="text-[10px] text-onyx/30 uppercase tracking-widest mt-1">ID: {item.id}</div>
                </TableCell>
                <TableCell className="py-6 px-8 text-onyx/40 font-medium">{item.order}</TableCell>
                <TableCell className="text-right py-6 px-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if(confirm("Are you sure you want to remove this item from the gallery?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-6 pt-4" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            let imageUrl = editingItem?.image || "";

            const imageFile = formData.get("image_file") as File;
            if (imageFile && imageFile.size > 0) {
              const fileData = new FormData();
              fileData.append("files", imageFile);
              const res = await fetch(`${API_BASE}/uploads/`, {
                method: "POST",
                body: fileData
              });
              if (res.ok) {
                const result = await res.json();
                imageUrl = result.urls[0];
              }
            }

            const payload = {
              ...data,
              image: imageUrl,
              order: parseInt(data.order as string) || 0,
            };
            
            delete payload.image_file;
            upsertMutation.mutate(payload);
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={editingItem?.title} 
                  required 
                  onChange={(e) => {
                    if (!editingItem) {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      const idInput = document.getElementById("id") as HTMLInputElement;
                      if (idInput) idInput.value = slug;
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id">Slug ID (unique)</Label>
                <Input id="id" name="id" defaultValue={editingItem?.id} required readOnly={!!editingItem} placeholder="Auto-generated" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" defaultValue={editingItem?.order || 0} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_file">Gallery Image {editingItem?.image && "(Leave blank to keep existing)"}</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={getImageUrl(imagePreview)} alt="Preview" className="h-24 w-24 object-cover rounded shadow-sm border border-onyx/5" />
                )}
                <div className="flex-1">
                  <Input 
                    id="image_file" 
                    name="image_file" 
                    type="file" 
                    accept="image/*" 
                    required={!editingItem?.image} 
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" name="description" defaultValue={editingItem?.description} placeholder="Brief story about this piece..." />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={upsertMutation.isPending} className="w-full md:w-auto">
                {upsertMutation.isPending ? "Saving..." : (editingItem ? 'Update Item' : 'Add to Gallery')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
