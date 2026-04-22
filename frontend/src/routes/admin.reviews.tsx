import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Star, Loader2, Edit2, Plus } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

type Review = {
  _id: string;
  name: string;
  initial: string;
  rating: number;
  text: string;
};

function AdminReviews() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    initial: "",
    rating: 5,
    text: "",
  });

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: () => fetch("http://localhost:8001/api/reviews/").then(res => res.json())
  });

  const createMutation = useMutation({
    mutationFn: async (newReview: Omit<Review, "_id">) => {
      const res = await authenticatedFetch("http://localhost:8001/api/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review created");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Error creating review")
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedReview: Review) => {
      const res = await authenticatedFetch(`http://localhost:8001/api/reviews/${updatedReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedReview.name,
          initial: updatedReview.initial,
          rating: updatedReview.rating,
          text: updatedReview.text,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Error updating review")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`http://localhost:8001/api/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review removed");
    },
    onError: () => toast.error("Error deleting review")
  });

  const resetForm = () => {
    setFormData({ name: "", initial: "", rating: 5, text: "" });
    setEditingReview(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      initial: review.initial,
      rating: review.rating,
      text: review.text,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateMutation.mutate({ ...formData, _id: editingReview._id });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-onyx">Customer Reviews</h1>
          <p className="text-muted-foreground mt-1">Review and manage customer feedback</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gold hover:bg-gold/90 text-onyx">
          <Plus className="mr-2 h-4 w-4" /> Add Review
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Add New Review"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initial">Initial</Label>
              <Input 
                id="initial" 
                value={formData.initial} 
                onChange={(e) => setFormData({...formData, initial: e.target.value})} 
                required 
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input 
                id="rating" 
                type="number" 
                min="1" 
                max="5"
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Review Text</Label>
              <Textarea 
                id="text" 
                value={formData.text} 
                onChange={(e) => setFormData({...formData, text: e.target.value})} 
                required 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-gold" />
          </div>
        ) : reviews?.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No reviews available.
            </CardContent>
          </Card>
        ) : reviews?.map((review) => (
          <Card key={review._id} className="overflow-hidden border-l-4 border-l-gold">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-serif flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">
                  {review.initial || review.name.charAt(0)}
                </div>
                {review.name}
              </CardTitle>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => openEditDialog(review)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if(confirm("Permanently delete this review?")) {
                      deleteMutation.mutate(review._id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-1 text-gold">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-md text-onyx whitespace-pre-wrap">
                "{review.text}"
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
