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
import { Product } from "@/lib/api";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetch("http://localhost:8001/api/products/").then(res => res.json())
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const isEdit = !!editingProduct;
      const url = isEdit 
        ? `http://localhost:8001/api/products/${editingProduct.id}` 
        : `http://localhost:8001/api/products/`;
      
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
      const res = await authenticatedFetch(`http://localhost:8001/api/products/${id}`, {
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
    setIsDialogOpen(true);
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Inventaire des Produits</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Curating your fine jewellery collection</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Ajouter Un Produit
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx/20 h-4 w-4 group-focus-within:text-gold transition-colors" />
          <Input 
            className="pl-12 h-14 bg-white border-onyx/5 rounded-xl shadow-card placeholder:text-onyx/20 focus-visible:ring-gold/30 transition-all" 
            placeholder="Search items by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-14 px-6 bg-white border border-onyx/5 rounded-xl shadow-card flex items-center gap-2 text-onyx/40 text-xs">
          <span className="uppercase tracking-widest">Affichage:</span>
          <span className="font-medium text-onyx">{filteredProducts?.length || 0} Pièces</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-onyx/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-onyx/[0.02]">
            <TableRow className="hover:bg-transparent border-onyx/5">
              <TableHead className="w-[120px] py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Image</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Name</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Price</TableHead>
              <TableHead className="text-right py-6 px-8 text-onyx/40 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading Archive...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-onyx/40 italic font-serif">
                  No treasures found in the current selection.
                </TableCell>
              </TableRow>
            ) : filteredProducts?.map((product) => (
              <TableRow key={product.id} className="group hover:bg-ivory/20 transition-colors border-onyx/5">
                <TableCell className="py-6 px-8">
                  <div className="relative h-16 w-16 group/img">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded shadow-sm border border-onyx/5 transition-transform duration-500 group-hover/img:scale-110" />
                    <div className="absolute inset-0 bg-onyx/0 group-hover/img:bg-onyx/10 transition-colors rounded" />
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="font-serif text-lg text-onyx">{product.name}</div>
                  <div className="text-[10px] text-onyx/30 uppercase tracking-widest mt-1">ID: {product.id}</div>
                </TableCell>
                <TableCell className="py-6 px-8 italic text-onyx/60 font-serif translate-y-px">{product.category}</TableCell>
                <TableCell className="py-6 px-8">
                  <div className="text-onyx font-medium">
                    {typeof product.price === 'number' ? `₹${product.price.toLocaleString()}` : product.price}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(product.id);
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

      {/* Simplified Upsert Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            // Basic cleanup for array types
            const payload = {
              ...data,
              price: data.price === 'REQUEST' ? 'REQUEST' : Number(data.price),
              features: (data.features as string).split(',').map(f => f.trim()).filter(f => f),
              images: (data.images as string).split(',').map(f => f.trim()).filter(f => f),
            };
            upsertMutation.mutate(payload);
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Slug ID (unique)</Label>
                <Input id="id" name="id" defaultValue={editingProduct?.id} required disabled={!!editingProduct} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={editingProduct?.category} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (number or 'REQUEST')</Label>
                <Input id="price" name="price" defaultValue={editingProduct?.price} required />
              </div>
              <div className="space-y-2 text-gold">
                <Label htmlFor="metal">Metal/Stone</Label>
                <Input id="metal" name="metal" defaultValue={editingProduct?.metal} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" name="weight" defaultValue={editingProduct?.weight} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material Composition</Label>
              <Input id="material" name="material" defaultValue={editingProduct?.material} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Main Image URL</Label>
              <Input id="image" name="image" defaultValue={editingProduct?.image} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Additional Image URLs (comma separated)</Label>
              <Input id="images" name="images" defaultValue={editingProduct?.images?.join(', ')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editingProduct?.description} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input id="features" name="features" defaultValue={editingProduct?.features?.join(', ')} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : (editingProduct ? 'Save Changes' : 'Create Product')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
