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
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Category, fetchCategories, API_BASE, getImageUrl, cleanImageUrl } from "@/lib/api";
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
  const [slugValue, setSlugValue] = useState("");

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
    setSlugValue(category?.id || "");
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
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-onyx/20 h-4 w-4 group-focus-within:text-gold transition-all duration-300" />
            <input 
              className="w-full h-14 pl-14 pr-6 bg-white/80 backdrop-blur-md border border-onyx/5 rounded-2xl shadow-sm placeholder:text-onyx/20 outline-none focus:border-gold/30 focus:bg-white transition-all text-sm font-medium" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={() => handleOpenDialog()}
          className="admin-btn-gold h-14 px-10"
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-onyx/5 shadow-2xl overflow-hidden reveal">
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
                <TableCell colSpan={3} className="text-center py-32">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative h-12 w-12">
                      <Loader2 className="animate-spin h-12 w-12 text-gold/40 absolute inset-0" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-gold rounded-full animate-ping" />
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-onyx/30 font-bold">Refining Collection...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-32 text-onyx/30 font-serif text-2xl italic opacity-50">
                  No categories found in the vault.
                </TableCell>
              </TableRow>
            ) : filteredCategories?.map((category) => (
              <TableRow key={category.id} className="admin-table-row group">
                <TableCell className="py-8 px-10">
                  <div className="h-20 w-20 rounded-[1.25rem] overflow-hidden shadow-md border border-onyx/5 group-hover:border-gold/20 transition-all duration-500">
                    {category.image ? (
                      <img src={getImageUrl(category.image)} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="h-full w-full bg-onyx/5 flex items-center justify-center text-onyx/20">
                        <Camera size={24} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-8 px-10">
                  <div className="font-serif text-2xl text-onyx group-hover:text-gold transition-colors duration-300">{category.name}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] text-onyx/30 uppercase tracking-[0.2em] font-bold">Reference:</span>
                    <span className="text-[10px] text-onyx/60 font-medium">{category.id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-8 px-10 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(category)}
                      className="h-11 w-11 rounded-xl hover:bg-gold hover:text-white shadow-sm hover:shadow-gold/20 transition-all"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-11 w-11 rounded-xl text-red-500/40 hover:text-white hover:bg-red-500 shadow-sm hover:shadow-red-500/20 transition-all"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this category?")) {
                          deleteMutation.mutate(category.id);
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white ring-1 ring-onyx/5">
          <DialogHeader className="bg-[#FAF9F6] p-10 text-center relative overflow-hidden border-b border-onyx/[0.03] space-y-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
            
            <p className="text-[9px] tracking-[0.4em] text-gold font-bold uppercase mb-2 animate-fade-up">Vault Management</p>
            <DialogTitle className="font-serif text-3xl tracking-tight text-onyx mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription className="hidden">
              {editingCategory ? "Manage the details of this jewelry category." : "Define a new category for your jewelry collections."}
            </DialogDescription>
            <div className="flex items-center justify-center gap-3 opacity-20 scale-75">
              <div className="h-[1px] w-10 bg-onyx" />
              <div className="h-1.5 w-1.5 rotate-45 border border-onyx" />
              <div className="h-[1px] w-10 bg-onyx" />
            </div>
          </DialogHeader>

          <form className="p-8 space-y-8" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            let imageUrl = editingCategory?.image || "";
            
            const imageFile = formData.get("image_file") as File;
            if (imageFile && imageFile.size > 0) {
              const fileData = new FormData();
              fileData.append("files", imageFile);
              const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
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
              image: cleanImageUrl(imageUrl)
            };
            delete payload.image_file;

            upsertMutation.mutate(payload);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-onyx/40 ml-1">Category Name</Label>
                <Input 
                  name="name" 
                  defaultValue={editingCategory?.name} 
                  required 
                  className="h-12 rounded-xl border-onyx/10 bg-[#F9F8F6]/50 focus:bg-white focus:border-gold/40 transition-all px-5 text-sm"
                  onChange={(e) => {
                    const slug = e.target.value
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setSlugValue(slug);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-onyx/40 ml-1">Slug ID (unique)</Label>
                <Input 
                  id="id" 
                  name="id" 
                  value={slugValue}
                  onChange={(e) => setSlugValue(e.target.value)}
                  required 
                  className="h-12 rounded-xl border-onyx/10 bg-[#F9F8F6]/50 focus:bg-white focus:border-gold/40 transition-all px-5 text-sm" 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-onyx/40 ml-1">Category Image</Label>
              <div className="h-48 w-full bg-[#F9F8F6] rounded-2xl flex items-center justify-center overflow-hidden border border-onyx/5 relative group transition-all">
                {imagePreview ? (
                  <div className="relative h-full w-full group">
                    <img src={getImageUrl(imagePreview)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-onyx/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-white px-5 py-2 rounded-full shadow-lg">
                        <p className="text-onyx text-[9px] uppercase tracking-[0.2em] font-bold">Update Artwork</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-onyx/20">
                    <Plus size={20} />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Select Masterpiece</span>
                  </div>
                )}
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

            <DialogFooter className="pt-8 flex items-center justify-between gap-4 border-t border-onyx/5">
              <button 
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-onyx/30 hover:text-onyx transition-all"
              >
                Discard
              </button>
              <Button 
                type="submit" 
                disabled={upsertMutation.isPending} 
                className="admin-btn-gold h-12 px-10 text-[10px] shadow-xl"
              >
                {upsertMutation.isPending ? "Saving..." : (editingCategory ? 'Update Category' : 'Publish Category')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
