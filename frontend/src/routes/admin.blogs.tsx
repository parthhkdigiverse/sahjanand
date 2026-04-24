import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2, Camera, Eye, Download, Filter } from "lucide-react";
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
import { BlogPost, API_BASE, getImageUrl } from "@/lib/api";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

function AdminBlogs() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blogs"],
    queryFn: () => fetch(`${API_BASE}/blogs/`).then(res => res.json())
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const isEdit = !!editingBlog;
      const url = isEdit 
        ? `${API_BASE}/blogs/${editingBlog.slug}` 
        : `${API_BASE}/blogs/`;
      
      const res = await authenticatedFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save blog");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(editingBlog ? "Blog updated" : "Blog published");
      setIsDialogOpen(false);
      setEditingBlog(null);
      setImagePreview(null);
    },
    onError: () => toast.error("An error occurred")
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await authenticatedFetch(`${API_BASE}/blogs/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog deleted");
    },
    onError: () => toast.error("Error deleting blog")
  });

  const handleOpenDialog = (blog: BlogPost | null = null) => {
    setEditingBlog(blog);
    setImagePreview(blog?.image || null);
    setIsDialogOpen(true);
  };

  const filteredBlogs = blogs?.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/20 h-4 w-4 group-focus-within:text-gold transition-colors" />
            <input 
              className="w-full h-12 pl-12 pr-4 bg-white border border-onyx/5 rounded-xl shadow-sm placeholder:text-onyx/20 outline-none focus:border-gold/30 transition-all text-sm font-medium" 
              placeholder="Search blogs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={() => handleOpenDialog()}
          className="bg-gold text-onyx hover:bg-gold-deep h-12 px-8 rounded-xl font-bold tracking-widest uppercase text-[11px] shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus size={16} />
          <span>Compose New Blog</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-onyx/5 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold w-20">Cover</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Title</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Category</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">SEO Status</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Date</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-widest text-onyx/20 font-bold">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBlogs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-24 text-onyx/30 font-serif text-xl italic">
                  No blogs found.
                </TableCell>
              </TableRow>
            ) : filteredBlogs?.map((blog) => (
              <TableRow key={blog.slug} className="hover:bg-ivory/20 transition-colors border-onyx/5 group">
                <TableCell className="py-4 px-8">
                  <div className="h-10 w-16 bg-onyx/5 rounded-md overflow-hidden border border-onyx/5 shadow-sm">
                    {blog.image ? (
                      <img src={getImageUrl(blog.image)} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Camera size={12} className="text-onyx/10" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-lg text-onyx">{blog.title}</div>
                  <div className="text-[10px] text-onyx/30 uppercase tracking-widest mt-0.5">Slug: {blog.slug}</div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/5 px-2.5 py-1 rounded-lg border border-gold/10">{blog.category}</span>
                </TableCell>
                <TableCell className="py-6 px-8">
                  {blog.meta_title || blog.meta_description ? (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-sage bg-sage/5 px-2.5 py-1 rounded-lg border border-sage/10">Configured</span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-onyx/20">Default</span>
                  )}
                </TableCell>
                <TableCell className="py-6 px-8 font-serif italic text-onyx/60">{blog.date}</TableCell>
                <TableCell className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <a 
                      href={`/blog/${blog.slug}`} 
                      target="_blank" 
                      className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-onyx hover:text-ivory transition-all text-onyx/40"
                    >
                      <Eye size={16} />
                    </a>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(blog)}
                      className="h-10 w-10 rounded-lg hover:bg-gold/10 hover:text-gold"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/5"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this blog?")) {
                          deleteMutation.mutate(blog.slug);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-onyx p-8 text-ivory space-y-0">
            <DialogTitle className="font-serif text-2xl tracking-wide">{editingBlog ? 'Edit Blog' : 'Compose New Blog'}</DialogTitle>
          </DialogHeader>
          
          <form className="p-8 space-y-6 bg-white max-h-[80vh] overflow-y-auto" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            let imageUrl = imagePreview || "";
            const imageFile = (form.querySelector('input[name="image_file"]') as HTMLInputElement)?.files?.[0];

            if (imageFile && imagePreview?.startsWith('blob:')) {
              setIsUploading(true);
              const fileData = new FormData();
              fileData.append("files", imageFile);
              try {
                const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
                  method: "POST",
                  body: fileData
                });
                if (res.ok) {
                  const result = await res.json();
                  imageUrl = result.urls[0];
                }
              } catch (error) {
                toast.error("Failed to upload image");
                return;
              } finally {
                setIsUploading(false);
              }
            }

            const payload = {
              slug: editingBlog?.slug || (data.slug as string),
              title: data.title as string,
              excerpt: data.excerpt as string,
              category: data.category as string,
              readTime: data.readTime as string,
              date: data.date as string,
              image: imageUrl,
              content: (data.content as string).split('\n\n').map(p => p.trim()).filter(p => p),
              meta_title: (data.meta_title as string) || "",
              meta_description: (data.meta_description as string) || "",
              keywords: (data.keywords as string) || "",
            };
            upsertMutation.mutate(payload);
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Title</Label>
                <Input 
                  name="title" 
                  defaultValue={editingBlog?.title} 
                  required 
                  className="h-12 rounded-xl"
                  onChange={(e) => {
                    const slug = e.target.value
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    const slugInput = document.getElementById("slug") as HTMLInputElement;
                    if (slugInput) slugInput.value = slug;
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Slug (URL identifier)</Label>
                <Input id="slug" name="slug" defaultValue={editingBlog?.slug} required disabled={!!editingBlog} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Category</Label>
                <Input name="category" defaultValue={editingBlog?.category} required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Read Time (e.g. 5 min read)</Label>
                <Input name="readTime" defaultValue={editingBlog?.readTime} required placeholder="5 min read" className="h-12 rounded-xl" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Date</Label>
                <Input name="date" defaultValue={editingBlog?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} required className="h-12 rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-onyx/5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Cover Image</Label>
              </div>
              
              <div className="h-64 w-full bg-onyx/5 rounded-2xl flex items-center justify-center overflow-hidden border border-onyx/5 relative group cursor-pointer shadow-inner">
                {imagePreview ? (
                  <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Camera size={32} className="text-onyx/10" />
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-onyx/30 font-black">No Image Selected</p>
                      <p className="text-[8px] text-onyx/20 mt-1">Click anywhere to upload a cover image</p>
                    </div>
                  </div>
                )}
                
                {/* INVISIBLE FILE INPUT COVERING ENTIRE AREA */}
                <input 
                  name="image_file" 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {/* OVERLAY BUTTON */}
                <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] z-0">
                  <div className="bg-white/90 text-onyx text-[10px] uppercase tracking-[0.2em] font-black px-8 py-3 rounded-xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </div>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-onyx/60 flex items-center justify-center z-20 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-gold h-8 w-8" />
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Excerpt</Label>
              <Textarea name="excerpt" defaultValue={editingBlog?.excerpt} required className="rounded-xl h-24" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Content (Separate paragraphs with double enter)</Label>
              <Textarea name="content" className="min-h-[250px] rounded-xl font-serif text-lg p-6" defaultValue={editingBlog?.content?.join('\n\n')} required />
            </div>

            <div className="space-y-4 p-6 bg-onyx/[0.02] rounded-2xl border border-onyx/5">
              <h3 className="text-[10px] font-black text-onyx/40 uppercase tracking-widest">SEO Fields</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-onyx/30">Meta Title</Label>
                  <Input name="meta_title" defaultValue={editingBlog?.meta_title} className="h-10 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-onyx/30">Keywords</Label>
                  <Input name="keywords" defaultValue={editingBlog?.keywords} className="h-10 rounded-lg" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-onyx/30">Meta Description</Label>
                  <Textarea name="meta_description" defaultValue={editingBlog?.meta_description} className="h-20 rounded-lg" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-onyx/5">
              <Button type="submit" disabled={upsertMutation.isPending} className="bg-gold text-onyx hover:bg-gold-deep h-12 px-10 rounded-xl font-bold uppercase text-xs tracking-widest">
                {upsertMutation.isPending ? "Saving..." : (editingBlog ? 'Update Blog' : 'Publish Blog')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
