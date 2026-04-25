import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Star, Loader2, Edit2, Plus } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { fetchReviews, fetchSettings, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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

  const [settingsData, setSettingsData] = useState({
    reviews_heading: "",
    reviews_subheading: "",
  });

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: fetchReviews
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      setSettingsData({
        reviews_heading: settings.reviews_heading || "",
        reviews_subheading: settings.reviews_subheading || "",
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: typeof settingsData) => {
      const fullSettings = { ...settings, ...updatedSettings };
      const res = await authenticatedFetch(`${API_BASE}/settings/`, {
        method: "PUT",
        body: JSON.stringify(fullSettings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Section settings updated");
    },
    onError: () => toast.error("Error updating settings")
  });

  const createMutation = useMutation({
    mutationFn: async (newReview: Omit<Review, "_id">) => {
      const res = await authenticatedFetch(`${API_BASE}/reviews/`, {
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
      const res = await authenticatedFetch(`${API_BASE}/reviews/${updatedReview._id}`, {
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
      const res = await authenticatedFetch(`${API_BASE}/reviews/${id}`, {
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
      initial: review.initial || "",
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

      <Card className="border-onyx/5 shadow-card rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-[#FAF9F6] border-b border-onyx/5 p-8">
          <CardTitle className="font-serif text-xl text-onyx">Section Header Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Section Heading</Label>
              <Input 
                value={settingsData.reviews_heading} 
                onChange={(e) => setSettingsData({...settingsData, reviews_heading: e.target.value})}
                placeholder="What Our Customers Say"
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 ml-1">Section Subheading</Label>
              <Input 
                value={settingsData.reviews_subheading} 
                onChange={(e) => setSettingsData({...settingsData, reviews_subheading: e.target.value})}
                placeholder="4.9 / 5 · Verified by Google · 2,400+ reviews"
                className="h-12 bg-ivory/20 border-onyx/5 focus:border-gold/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => updateSettingsMutation.mutate(settingsData)} 
              disabled={updateSettingsMutation.isPending}
              className="admin-btn-gold h-12 px-10 text-[10px] shadow-xl"
            >
              {updateSettingsMutation.isPending ? "Syncing..." : "Update Header Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Add New Review"}</DialogTitle>
            <DialogDescription className="hidden">
              {editingReview ? "Modify the customer feedback details." : "Create a new customer review entry for your website."}
            </DialogDescription>
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
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-8 w-8 cursor-pointer transition-all ${star <= formData.rating ? "fill-gold text-gold scale-110" : "text-gray-300"}`}
                    onClick={() => setFormData({...formData, rating: star})}
                  />
                ))}
              </div>
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
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">
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
