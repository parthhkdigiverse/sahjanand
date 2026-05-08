import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Loader2, Star, Filter, Download, Check } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Product, fetchCategories, fetchSettings, Category, API_BASE, getImageUrl, cleanImageUrl } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { GripVertical } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function SortableRow({ product, onEdit, onDelete, disabled }: { product: Product, onEdit: (p: Product) => void, onDelete: (id: string) => void, disabled?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as const,
    backgroundColor: isDragging ? 'white' : undefined,
    boxShadow: isDragging ? '0 10px 30px -10px rgba(0,0,0,0.1)' : undefined,
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className={`hover:bg-ivory/20 transition-colors border-onyx/5 group ${isDragging ? 'opacity-50' : ''}`}
    >
      <TableCell className="py-6 px-8 w-12">
        {!disabled && (
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-onyx/20 hover:text-gold transition-colors">
            <GripVertical size={20} />
          </div>
        )}
      </TableCell>
      <TableCell className="py-6 px-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden border border-onyx/5 shadow-sm">
          <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-cover" />
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
            onClick={() => onEdit(product)}
            className="h-10 w-10 rounded-lg hover:bg-gold/10 hover:text-gold"
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/5"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

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

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const availableMetals = settings?.materials 
    ? settings.materials.map(m => m.name) 
    : ["Gold", "Diamond", "Silver"];

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await authenticatedFetch(`${API_BASE}/products/reorder`, {
        method: "POST",
        body: JSON.stringify(ids),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Order updated");
    },
    onError: () => {
      toast.error("Failed to update order");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products?.findIndex((p) => p.id === active.id);
      const newIndex = products?.findIndex((p) => p.id === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && products) {
        const newOrder = arrayMove(products, oldIndex, newIndex);
        queryClient.setQueryData(["products"], newOrder);
        reorderMutation.mutate(newOrder.map(p => p.id));
      }
    }
  };

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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Table>
            <TableHeader className="bg-onyx/[0.02]">
              <TableRow className="hover:bg-transparent border-onyx/5">
                <TableHead className="w-[50px] py-6 px-8"></TableHead>
                <TableHead className="w-[100px] py-6 px-4 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Image</TableHead>
                <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Name</TableHead>
                <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Category</TableHead>
                <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[9px] font-bold">Featured</TableHead>
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
              ) : filteredProducts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24 text-onyx/30 font-serif text-xl italic">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext 
                  items={filteredProducts?.map(p => p.id) || []} 
                  strategy={verticalListSortingStrategy}
                >
                  {filteredProducts?.map((product) => (
                    <SortableRow 
                      key={product.id} 
                      product={product} 
                      onEdit={handleOpenDialog}
                      disabled={!!searchTerm}
                      onDelete={(id) => {
                        if(confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(id);
                        }
                      }}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-onyx p-8 text-ivory space-y-0">
            <DialogTitle className="font-serif text-2xl tracking-wide">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription className="hidden">
              {editingProduct ? "Update the details of this product in your catalog." : "Add a new luxury piece to your collection catalog."}
            </DialogDescription>
          </DialogHeader>
          
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
              const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
                method: "POST",
                body: fileData
              });
              if (res.ok) {
                const result = await res.json();
                mainImageUrl = result.urls[0];
              } else {
                toast.error("Failed to upload main image. File might be too large.");
                return;
              }
            }

            for (let i = 0; i < 4; i++) {
              const file = formData.get(`images_files_${i}`) as File;
              if (file && file.size > 0) {
                const fileData = new FormData();
                fileData.append("files", file);
                const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
                  method: "POST",
                  body: fileData
                });
                if (res.ok) {
                  const result = await res.json();
                  additionalUrls[i] = result.urls[0];
                } else {
                  toast.error(`Failed to upload additional image ${i+1}. File might be too large.`);
                  return;
                }
              }
            }
            
            additionalUrls = additionalUrls.filter(Boolean);

            const selectedMetals = formData.getAll('metal') as string[];

            const payload = {
              ...data,
              metal: selectedMetals,
              image: cleanImageUrl(mainImageUrl),
              images: additionalUrls.map(url => cleanImageUrl(url)).filter(Boolean),
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
                    const slug = e.target.value
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
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
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Metal (Select Multiple)</Label>
                <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl border border-onyx/10 bg-white/50">
                  {availableMetals.map(m => (
                    <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          name="metal" 
                          value={m} 
                          defaultChecked={Array.isArray(editingProduct?.metal) ? editingProduct.metal.includes(m) : editingProduct?.metal === m}
                          className="peer w-5 h-5 rounded-md border-2 border-onyx/10 text-gold checked:border-gold transition-all cursor-pointer appearance-none"
                        />
                        <Check className="absolute w-3.5 h-3.5 text-gold opacity-0 peer-checked:opacity-100 transition-opacity left-0.5 pointer-events-none" strokeWidth={4} />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-bold text-onyx/40 group-hover:text-gold transition-colors">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Weight (Optional)</Label>
                <Input name="weight" defaultValue={editingProduct?.weight} className="h-12 rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-onyx/5">
              <Label className="text-[10px] uppercase tracking-widest text-onyx/40">Images</Label>
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2 col-span-2">
                  <div className="h-32 w-full bg-onyx/5 rounded-2xl flex items-center justify-center overflow-hidden border border-onyx/5">
                    {mainPreview ? <img src={getImageUrl(mainPreview)} className="h-full w-full object-cover" /> : <span className="text-[9px] uppercase tracking-widest text-onyx/20 font-bold">Main Image</span>}
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
                        {addlPreviews[i] ? <img src={getImageUrl(addlPreviews[i]!)} className="h-full w-full object-cover" /> : <span className="text-[8px] uppercase text-onyx/20">Extra {i+1}</span>}
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
