import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Plus, 
  Camera, 
  Trash2,
  Save,
  Trophy,
  Edit2,
  X,
  GripVertical
} from "lucide-react";
import { 
  fetchAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement,
  API_BASE,
  getImageUrl,
  cleanImageUrl,
  type Achievement
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/services/auth";
import { authService } from "@/services/auth";

export const Route = createFileRoute("/admin/achievements")({
  component: AdminAchievements,
});

function AdminAchievements() {
  const queryClient = useQueryClient();
  const token = authService.getToken() || "";
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Achievement, "_id">>({
    title: "",
    description: "",
    image: "",
    order: 0
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Achievement, "_id">) => createAchievement(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement added successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to add achievement"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Achievement> }) => updateAchievement(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement updated successfully");
      setEditingId(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update achievement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAchievement(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement deleted successfully");
    },
    onError: () => toast.error("Failed to delete achievement"),
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const fileData = new FormData();
    fileData.append("files", file);
    try {
      const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
        method: "POST",
        body: fileData,
      });
      if (res.ok) {
        const result = await res.json();
        const imageUrl = result.urls[0];
        setFormData(prev => ({ ...prev, image: imageUrl }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      order: (achievements?.length || 0)
    });
    setEditingId(null);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingId(achievement._id);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      image: achievement.image,
      order: achievement.order
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-gold" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-onyx">Hall of Fame</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Manage your atelier's prestigious achievements and milestones</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-5">
          <Card className="border-gold/20 shadow-luxe sticky top-24">
            <CardHeader className="bg-ivory/30 border-b border-gold/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Trophy size={20} />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl text-onyx">{editingId ? "Edit Achievement" : "New Achievement"}</CardTitle>
                  <CardDescription>Record a new milestone</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Achievement Visual</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all duration-700 bg-ivory/5"
                  >
                    {formData.image ? (
                      <>
                        <img src={getImageUrl(formData.image)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                          <Camera className="h-6 w-6 text-gold mb-1" />
                          <span className="text-white text-[8px] uppercase tracking-widest">Change Visual</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20">
                        <Plus className="h-8 w-8 mb-2" />
                        <span className="text-[10px] uppercase tracking-widest">Upload Achievement Image</span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-md">
                        <Loader2 className="animate-spin h-6 w-6 text-gold" />
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Achievement Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Best Diamond Jeweller 2024"
                    required
                    className="border-gold/20 focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Description</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the significance of this achievement..."
                    required
                    rows={4}
                    className="border-gold/20 focus:border-gold resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Display Order</Label>
                  <Input 
                    type="number"
                    value={formData.order} 
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="border-gold/20 focus:border-gold"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-onyx text-white hover:bg-gold hover:text-onyx h-12 gap-2 shadow-luxe transition-all duration-500"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />}
                    {editingId ? "Update Achievement" : "Save Achievement"}
                  </Button>
                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-gold/20 text-onyx hover:bg-ivory h-12 w-12 p-0"
                    >
                      <X size={18} />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-onyx/30">Active Achievements ({achievements?.length || 0})</h2>
          </div>

          <div className="space-y-4">
            {achievements?.map((achievement) => (
              <Card key={achievement._id} className="group border-gold/10 hover:border-gold/40 hover:shadow-luxe transition-all duration-500 overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-40 h-40 sm:h-auto overflow-hidden relative">
                    <img src={getImageUrl(achievement.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-2 left-2 bg-onyx/80 text-gold px-2 py-1 rounded text-[8px] font-bold tracking-widest">
                      #{achievement.order}
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-onyx mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{achievement.description}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 sm:mt-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(achievement)}
                        className="text-onyx/40 hover:text-gold hover:bg-gold/5 gap-2 h-9 px-4 text-[10px] uppercase tracking-widest font-bold"
                      >
                        <Edit2 size={14} /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this achievement from your hall of fame?")) {
                            deleteMutation.mutate(achievement._id);
                          }
                        }}
                        className="text-onyx/20 hover:text-red-500 hover:bg-red-50 gap-2 h-9 px-4 text-[10px] uppercase tracking-widest font-bold"
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {(!achievements || achievements.length === 0) && (
              <div className="py-20 text-center bg-ivory/10 rounded-3xl border-2 border-dashed border-gold/10">
                <Trophy className="h-12 w-12 text-gold/20 mx-auto mb-4" />
                <p className="text-onyx/40 font-serif italic text-lg">No achievements recorded yet.</p>
                <p className="text-[10px] uppercase tracking-widest text-onyx/20 mt-1">Your journey of excellence begins here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
