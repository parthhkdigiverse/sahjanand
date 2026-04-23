import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2, Star, Filter, Download } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Product, fetchCategories, Category, API_BASE } from "@/lib/api";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [addlPreviews, setAddlPreviews] = useState<(string | null)[]>([null, null, null, null]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetch(`${API_BASE}/products/`).then(res => res.json())
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const isEdit = !!editingProduct;
      const url = isEdit 
        ? `${API_BASE}/products/${editingProduct.id}` 
        : `${API_BASE}/products/`;
      
      const res = await authenticatedFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingProduct ? "Product updated" : "Product created");
      setIsDialogOpen(false);
      setEditingProduct(null);
    },
    onError: () => toast.error("An error occurred")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Error deleting product")
  });

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setMainPreview(product?.image || null);
    
    const previews = [null, null, null, null];
    if (product?.images) {
      product.images.forEach((img, i) => {
        if (i < 4) previews[i] = img;
      });
    }
    setAddlPreviews(previews);
    
    setIsDialogOpen(true);
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search products..." 
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
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-onyx/5 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="w-[100px] py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Image</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Name</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Category</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Featured</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-widest text-onyx/20 font-bold">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 text-onyx/30 font-serif text-xl italic">
                  No products found.
                </TableCell>
              </TableRow>
            ) : filteredProducts?.map((product) => (
              <TableRow key={product.id} className="hover:bg-ivory/20 transition-colors border-onyx/5 group">
                <TableCell className="py-6 px-8">
                  <div className="h-16 w-16 rounded-lg overflow-hidden border border-onyx/5 shadow-sm">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-lg text-onyx">{product.name}</div>
                  <div className="text-[10px] text-onyx/30 uppercase tracking-widest mt-0.5">ID: {product.id}</div>
                </TableCell>
                <TableCell className="py-6 px-8 italic font-serif text-onyx/60">{product.category}</TableCell>
                <TableCell className="py-6 px-8">
                  {product.featured ? (
                    <div className="flex items-center gap-1.5 text-gold bg-gold/5 px-2.5 py-1 rounded-full w-fit border border-gold/10">
                      <Star size={10} className="fill-gold" />
                      <span className="text-[8px] uppercase tracking-widest font-black">Featured</span>
                    </div>
                  ) : (
                    <span className="text-[8px] uppercase tracking-widest text-onyx/20 font-bold">Standard</span>
                  )}
                </TableCell>
                <TableCell className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(product)}
                      className="h-10 w-10 rounded-lg hover:bg-gold/10 hover:text-gold"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/5"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(product.id);
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
        <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-onyx p-8 text-ivory">
            <h2 className="font-serif text-2xl tracking-wide">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          
          <form className="p-8 space-y-6 bg-white max-h-[80vh] overflow-y-auto" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            let mainImageUrl = editingProduct?.image || "";
            let additionalUrls = [...(editingProduct?.images || [])];

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
                mainImageUrl = result.urls[0];
              }
            }

            for (let i = 0; i < 4; i++) {
              const file = formData.get(`images_files_${i}`) as File;
              if (file && file.size > 0) {
                const fileData = new FormData();
                fileData.append("files", file);
                const res = await fetch(`${API_BASE}/uploads/`, {
                  method: "POST",
                  body: fileData
                });
                if (res.ok) {
                  const result = await res.json();
                  additionalUrls[i] = result.urls[0];
                }
              }
            }
            
            additionalUrls = additionalUrls.filter(Boolean);

            const payload = {
              ...data,
              image: mainImageUrl,
              images: additionalUrls,
              featured: data.featured === 'on',
              features: (data.features as string).split(',').map(f => f.trim()).filter(f => f),
            };
            
            delete payload.image_file;
            for (let i = 0; i < 4; i++) delete payload[`images_files_${i}`];

            upsertMutation.mutate(payload);
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Slug ID (unique)</Label>
                <Input name="id" id="id" defaultValue={editingProduct?.id} required readOnly={!!editingProduct} placeholder="Auto-generated" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Product Name</Label>
                <Input 
                  name="name" 
                  defaultValue={editingProduct?.name} 
                  required 
                  className="h-12 rounded-xl"
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    const idInput = document.getElementById("id") as HTMLInputElement;
                    if (idInput) idInput.value = slug;
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Category</Label>
                <select 
                  name="category" 
                  defaultValue={editingProduct?.category || (categories[0]?.name || "")} 
                  required
                  className="w-full h-12 rounded-xl border border-onyx/10 bg-white px-4 py-2 text-sm outline-none focus:border-gold/30"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Metal</Label>
                <select 
                  name="metal" 
                  defaultValue={editingProduct?.metal || "Gold"} 
                  required
                  className="w-full h-12 rounded-xl border border-onyx/10 bg-white px-4 py-2 text-sm outline-none focus:border-gold/30"
                >
                  <option value="Gold">Gold</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Weight</Label>
                <Input name="weight" defaultValue={editingProduct?.weight} required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Material Composition</Label>
                <Input name="material" defaultValue={editingProduct?.material} required className="h-12 rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-onyx/5">
              <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Images</Label>
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2 col-span-2">
                  <div className="h-32 w-full bg-onyx/5 rounded-2xl flex items-center justify-center overflow-hidden border border-onyx/5">
                    {mainPreview ? <img src={mainPreview} className="h-full w-full object-cover" /> : <span className="text-[9px] uppercase tracking-widest text-onyx/20 font-bold">Main Image</span>}
                  </div>
                  <Input 
                    name="image_file" 
                    type="file" 
                    accept="image/*" 
                    className="h-10 p-1 rounded-lg text-xs"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setMainPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </div>
                <div className="col-span-3 grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="space-y-1">
                      <div className="h-14 w-full bg-onyx/5 rounded-xl flex items-center justify-center overflow-hidden border border-onyx/5">
                        {addlPreviews[i] ? <img src={addlPreviews[i]!} className="h-full w-full object-cover" /> : <span className="text-[8px] uppercase text-onyx/20">Extra {i+1}</span>}
                      </div>
                      <input 
                        name={`images_files_${i}`} 
                        type="file" 
                        accept="image/*" 
                        className="w-full text-[9px] outline-none"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const newPreviews = [...addlPreviews];
                            newPreviews[i] = URL.createObjectURL(e.target.files[0]);
                            setAddlPreviews(newPreviews);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Description</Label>
              <Textarea name="description" defaultValue={editingProduct?.description} required className="min-h-[120px] rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Features (comma separated)</Label>
              <Input name="features" defaultValue={editingProduct?.features?.join(', ')} className="h-12 rounded-xl" />
            </div>

            <div className="flex items-center space-x-3 py-2">
              <Switch name="featured" defaultChecked={editingProduct?.featured} />
              <Label className="text-sm font-medium text-onyx/60">Featured Product</Label>
            </div>

            <DialogFooter className="pt-6 border-t border-onyx/5">
              <Button type="submit" disabled={upsertMutation.isPending} className="bg-gold text-onyx hover:bg-gold-deep h-12 px-10 rounded-xl font-bold uppercase text-xs tracking-widest">
                {upsertMutation.isPending ? "Saving..." : (editingProduct ? 'Save Product' : 'Create Product')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
