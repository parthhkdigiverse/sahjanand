import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
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
import { BlogPost } from "@/lib/api";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

function AdminBlogs() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blogs"],
    queryFn: () => fetch("http://localhost:8001/api/blogs/").then(res => res.json())
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const isEdit = !!editingBlog;
      const url = isEdit 
        ? `http://localhost:8001/api/blogs/${editingBlog.slug}` 
        : `http://localhost:8001/api/blogs/`;
      
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
    },
    onError: () => toast.error("An error occurred")
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await authenticatedFetch(`http://localhost:8001/api/blogs/${slug}`, {
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
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Journal Editoriale</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Crafting and curating your atelier stories</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Composer Un Article
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
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Publication Date</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Accessing Archives...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBlogs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-onyx/40 italic font-serif">
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
                <TableCell className="py-6 px-8 italic font-serif text-onyx/50">{blog.date}</TableCell>
                <TableCell className="text-right py-6 px-8">
                  <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
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
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const payload = {
              ...data,
              content: (data.content as string).split('\n\n').map(p => p.trim()).filter(p => p),
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
              <div className="space-y-2">
                <Label htmlFor="image">Cover Image URL</Label>
                <Input id="image" name="image" defaultValue={editingBlog?.image} required />
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
