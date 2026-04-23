import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2, Camera } from "lucide-react";
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
import { toast } from "sonner";
import { Category, API_BASE } from "@/lib/api";
import { motion } from "framer-motion";

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
              placeholder="Search categories..." 
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
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-onyx/5 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="w-[100px] py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Image</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Category Details</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-widest text-onyx/20 font-bold">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-24 text-onyx/30 font-serif text-xl italic">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : filteredCategories?.map((category) => (
              <TableRow key={category.id} className="hover:bg-ivory/20 transition-colors border-onyx/5 group">
                <TableCell className="py-6 px-8">
                  <div className="h-16 w-16 rounded-xl overflow-hidden shadow-sm border border-onyx/5">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-onyx/5 flex items-center justify-center text-onyx/20">
                        <Camera size={20} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-xl text-onyx">{category.name}</div>
                  <div className="text-[9px] text-onyx/30 uppercase tracking-widest mt-0.5">ID: {category.id}</div>
                </TableCell>
                <TableCell className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(category)}
                      className="h-10 w-10 rounded-lg hover:bg-gold/10 hover:text-gold"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/5"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this category?")) {
                          deleteMutation.mutate(category.id);
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
        <DialogContent className="max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-onyx p-8 text-ivory">
            <h2 className="font-serif text-2xl tracking-wide">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          </div>

          <form className="p-8 space-y-6 bg-white" onSubmit={async (e) => {
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Category Name</Label>
                <Input 
                  name="name" 
                  defaultValue={editingCategory?.name} 
                  required 
                  className="h-12 rounded-xl"
                  onChange={(e) => {
                    if (!editingCategory) {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      const idInput = document.getElementById("id") as HTMLInputElement;
                      if (idInput) idInput.value = slug;
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Slug ID (unique)</Label>
                <Input id="id" name="id" defaultValue={editingCategory?.id} required readOnly={!!editingCategory} className="h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Category Image</Label>
                <div className="h-40 w-full bg-onyx/5 rounded-2xl flex items-center justify-center overflow-hidden border border-onyx/5 relative group">
                  {imagePreview ? <img src={imagePreview} className="h-full w-full object-cover" /> : <Camera size={24} className="text-onyx/20" />}
                  <Input 
                    name="image_file" 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-onyx/5">
              <Button type="submit" disabled={upsertMutation.isPending} className="bg-gold text-onyx hover:bg-gold-deep h-12 px-10 rounded-xl font-bold uppercase text-xs tracking-widest">
                {upsertMutation.isPending ? "Saving..." : (editingCategory ? 'Save Category' : 'Create Category')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
