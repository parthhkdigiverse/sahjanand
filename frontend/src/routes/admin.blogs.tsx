import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2, Camera, Eye } from "lucide-react";
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
import { BlogPost, API_BASE } from "@/lib/api";

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
      toast.success(editingBlog ? "Article updated" : "Article published");
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
      toast.success("Article deleted");
    },
    onError: () => toast.error("Error deleting article")
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
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Journal Archives</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Crafting and curating your atelier stories</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Compose New Article
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/20 h-4 w-4 group-focus-within:text-gold transition-colors" />
          <Input 
            className="pl-12 h-14 bg-white border-onyx/5 rounded-xl shadow-card placeholder:text-onyx/20 focus-visible:ring-gold/30 transition-all" 
            placeholder="Search articles by title or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-14 px-6 bg-white border border-onyx/5 rounded-xl shadow-card flex items-center gap-2 text-onyx/40 text-xs text-nowrap">
          <span className="uppercase tracking-widest">Total Articles:</span>
          <span className="font-medium text-onyx">{filteredBlogs?.length || 0}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-onyx/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Article Title</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">SEO Status</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Publication Date</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Accessing Archives...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBlogs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-onyx/40 italic font-serif">
                  The journal is currently quiet. Compose your first story.
                </TableCell>
              </TableRow>
            ) : filteredBlogs?.map((blog) => (
              <TableRow key={blog.slug} className="group hover:bg-ivory/20 transition-colors border-onyx/5">
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-lg text-onyx">{blog.title}</div>
                  <div className="text-[10px] text-onyx/30 uppercase tracking-widest mt-1">Slug: {blog.slug}</div>
                </TableCell>
                <TableCell className="py-6 px-8 uppercase tracking-widest text-[10px] text-onyx/60">{blog.category}</TableCell>
                <TableCell className="py-6 px-8">
                  {blog.meta_title || blog.meta_description ? (
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase tracking-widest rounded border border-green-100">Configured</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[9px] font-bold uppercase tracking-widest rounded border border-gray-100">Default</span>
                  )}
                </TableCell>
                <TableCell className="py-6 px-8 italic font-serif text-onyx/50">{blog.date}</TableCell>
                <TableCell className="text-right py-6 px-8">
                  <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={`/blog/${blog.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 hover:bg-onyx hover:text-ivory rounded-full transition-all text-onyx/40"
                        title="View Live Article"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenDialog(blog)}
                        className="hover:bg-onyx hover:text-ivory rounded-full transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this article?")) {
                          deleteMutation.mutate(blog.slug);
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Article' : 'Compose New Article'}</DialogTitle>
          </DialogHeader>
          <form 
            key={editingBlog?.slug || 'new'}
            className="space-y-4" 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              
              let imageUrl = editingBlog?.image || "";
              const imageFile = formData.get("image_file") as File;

              if (imageFile && imageFile.size > 0) {
                setIsUploading(true);
                const fileData = new FormData();
                fileData.append("files", imageFile);
                try {
                  const res = await fetch(`${API_BASE}/uploads/`, {
                    method: "POST",
                    body: fileData
                  });
                  if (res.ok) {
                    const result = await res.json();
                    imageUrl = result.urls[0];
                  } else {
                    toast.error("Image upload failed");
                    setIsUploading(false);
                    return;
                  }
                } catch (err) {
                  toast.error("Image upload error");
                  setIsUploading(false);
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL identifier)</Label>
                <Input id="slug" name="slug" defaultValue={editingBlog?.slug} required disabled={!!editingBlog} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingBlog?.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={editingBlog?.category} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time (e.g. 5 min read)</Label>
                <Input id="readTime" name="readTime" defaultValue={editingBlog?.readTime} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Publication Date</Label>
                <Input id="date" name="date" defaultValue={editingBlog?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} required />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="image_file">Cover Image {editingBlog?.image && "(Leave blank to keep existing)"}</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-20 w-32 object-cover rounded shadow-sm border border-onyx/5" />
                  )}
                  <div className="flex-1 relative">
                    <Input 
                      id="image_file" 
                      name="image_file" 
                      type="file" 
                      accept="image/*" 
                      required={!editingBlog?.image} 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="cursor-pointer h-12 pt-2.5"
                    />
                    {isUploading && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Loader2 className="animate-spin h-4 w-4 text-gold" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt / Summary</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={editingBlog?.excerpt} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Separate paragraphs with double enter)</Label>
              <Textarea id="content" name="content" className="min-h-[200px]" defaultValue={editingBlog?.content?.join('\n\n')} required />
            </div>

            <div className="pt-6 mt-6 border-t border-onyx/5">
              <h3 className="text-sm font-medium text-onyx mb-4 uppercase tracking-widest">Search Engine Optimization (SEO)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input id="meta_title" name="meta_title" defaultValue={editingBlog?.meta_title} placeholder="Leave blank to use blog title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea id="meta_description" name="meta_description" defaultValue={editingBlog?.meta_description} placeholder="Leave blank to use blog excerpt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (Comma separated)</Label>
                  <Input id="keywords" name="keywords" defaultValue={editingBlog?.keywords} placeholder="jewellery, luxury, gold, etc." />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : (editingBlog ? 'Update Article' : 'Publish Article')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
