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
import { Category, API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch(`${API_BASE}/categories/`).then(res => res.json())
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const isEdit = !!editingCategory;
      const url = isEdit 
        ? `${API_BASE}/categories/${editingCategory.id}` 
        : `${API_BASE}/categories/`;
      
      const res = await authenticatedFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to save category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(editingCategory ? "Category updated" : "Category created");
      setIsDialogOpen(false);
      setEditingCategory(null);
    },
    onError: (error: any) => toast.error(error.message || "An error occurred")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: () => toast.error("Error deleting category")
  });

  const handleOpenDialog = (category: Category | null = null) => {
    setEditingCategory(category);
    setImagePreview(category?.image || null);
    setIsDialogOpen(true);
  };

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Category Management</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Organizing your fine collections</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Add New Category
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/20 h-4 w-4 group-focus-within:text-gold transition-colors" />
          <Input 
            className="pl-12 h-14 bg-white border-onyx/5 rounded-xl shadow-card placeholder:text-onyx/20 focus-visible:ring-gold/30 transition-all" 
            placeholder="Search categories by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-14 px-6 bg-white border border-onyx/5 rounded-xl shadow-card flex items-center gap-2 text-onyx/40 text-xs">
          <span className="uppercase tracking-widest">Displaying:</span>
          <span className="font-medium text-onyx">{filteredCategories?.length || 0} Categories</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-onyx/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="w-[120px] py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Image</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Category Details</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading Categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-20 text-onyx/40 italic font-serif">
                  No categories found in the current selection.
                </TableCell>
              </TableRow>
            ) : filteredCategories?.map((category) => (
              <TableRow key={category.id} className="group hover:bg-ivory/20 transition-colors border-onyx/5">
                <TableCell className="py-6 px-8">
                  {category.image ? (
                    <div className="relative h-16 w-16 group/img">
                      <img src={category.image} alt={category.name} className="h-full w-full object-cover rounded shadow-sm border border-onyx/5 transition-transform duration-500 group-hover/img:scale-110" />
                      <div className="absolute inset-0 bg-onyx/0 group-hover/img:bg-onyx/10 transition-colors rounded" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-onyx/5 rounded flex items-center justify-center text-onyx/20 text-xs italic">
                      No Img
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-lg text-onyx">{category.name}</div>
                  <div className="text-[10px] text-onyx/30 uppercase tracking-widest mt-1">ID: {category.id}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this category?")) {
                          deleteMutation.mutate(category.id);
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            let imageUrl = editingCategory?.image || "";
            
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
              image: imageUrl
            };
            delete payload.image_file;

            upsertMutation.mutate(payload);
          }}>
            <div className="space-y-2">
              <Label htmlFor="id">Slug ID (unique)</Label>
              <Input 
                id="id" 
                name="id" 
                defaultValue={editingCategory?.id} 
                required 
                readOnly={!!editingCategory} 
                placeholder="e.g. rings"
              />
              {!editingCategory && (
                <p className="text-[10px] text-onyx/40">This will be used in URLs and cannot be changed later.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={editingCategory?.name} 
                required 
                placeholder="e.g. Rings"
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  const idInput = document.getElementById("id") as HTMLInputElement;
                  if (idInput) idInput.value = slug;
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_file">Image {editingCategory?.image && "(Leave blank to keep existing)"}</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded shadow-sm border border-onyx/5" />
                )}
                <Input 
                  id="image_file" 
                  name="image_file" 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={upsertMutation.isPending} className="bg-gold text-onyx hover:bg-gold/90">
                {upsertMutation.isPending ? "Saving..." : (editingCategory ? 'Save Changes' : 'Create Category')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
