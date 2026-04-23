import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Plus, 
  Camera, 
  Trash2,
  Save,
  Type,
  FileText,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { 
  fetchAboutData, 
  updateAboutData, 
  API_BASE,
  getImageUrl,
  type AboutData,
  type PromiseItem
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/services/auth";
import { authService } from "@/services/auth";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/about")({
  component: AdminAbout,
});

function AdminAbout() {
  const queryClient = useQueryClient();
  const token = authService.getToken() || "";
  
  const [formData, setFormData] = useState<AboutData>({
    hero_heading: "",
    hero_eyebrow: "",
    story_heading: "",
    story_eyebrow: "",
    story_paragraphs: [],
    promise_heading: "",
    promise_eyebrow: "",
    promises: [],
    cta_text: "",
    cta_link: ""
  });

  const [previews, setPreviews] = useState<{hero?: string, promise?: string}>({});
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const promiseInputRef = useRef<HTMLInputElement>(null);

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["about-data"],
    queryFn: fetchAboutData,
  });

  useEffect(() => {
    if (aboutData) {
      setFormData(aboutData);
      setPreviews({
        hero: aboutData.hero_image,
        promise: aboutData.promise_image
      });
    }
  }, [aboutData]);

  const updateMutation = useMutation({
    mutationFn: (data: AboutData) => updateAboutData(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-data"] });
      toast.success("About page updated successfully");
    },
    onError: () => toast.error("Failed to update about page"),
  });

  const handleImageUpload = async (file: File, type: 'hero' | 'promise') => {
    setIsUploading(type);
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
        setFormData(prev => ({ 
          ...prev, 
          [type === 'hero' ? 'hero_image' : 'promise_image']: imageUrl 
        }));
        setPreviews(prev => ({ ...prev, [type]: imageUrl }));
        toast.success(`${type === 'hero' ? 'Hero' : 'Promise'} image uploaded`);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(null);
    }
  };

  const addParagraph = () => {
    setFormData(prev => ({
      ...prev,
      story_paragraphs: [...prev.story_paragraphs, ""]
    }));
  };

  const removeParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      story_paragraphs: prev.story_paragraphs.filter((_, i) => i !== index)
    }));
  };

  const updateParagraph = (index: number, val: string) => {
    const newPs = [...formData.story_paragraphs];
    newPs[index] = val;
    setFormData(prev => ({ ...prev, story_paragraphs: newPs }));
  };

  const addPromise = () => {
    setFormData(prev => ({
      ...prev,
      promises: [...prev.promises, { title: "", description: "" }]
    }));
  };

  const removePromise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      promises: prev.promises.filter((_, i) => i !== index)
    }));
  };

  const updatePromise = (index: number, field: keyof PromiseItem, val: string) => {
    const newPromises = [...formData.promises];
    newPromises[index] = { ...newPromises[index], [field]: val };
    setFormData(prev => ({ ...prev, promises: newPromises }));
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-gold" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-onyx">Brand Narrative</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Curation and management of the "About Us" heritage content</p>
        </div>
        <Button 
          onClick={() => updateMutation.mutate(formData)}
          disabled={updateMutation.isPending}
          className="bg-onyx text-white hover:bg-gold hover:text-onyx min-w-[200px] h-12 gap-2 shadow-luxe transition-all duration-500"
        >
          {updateMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />}
          {updateMutation.isPending ? "Preserving..." : "Publish Changes"}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-12">
        
        {/* HERO SECTION */}
        <Card className="border-gold/20 shadow-luxe overflow-hidden">
          <CardHeader className="bg-ivory/30 border-b border-gold/10 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Type size={20} />
              </div>
              <div>
                <CardTitle className="font-serif text-2xl text-onyx">Hero Presentation</CardTitle>
                <CardDescription>The first impression of your atelier's history</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-10 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Hero Eyebrow</Label>
                  <Input 
                    value={formData.hero_eyebrow} 
                    onChange={e => setFormData({...formData, hero_eyebrow: e.target.value})}
                    className="border-gold/20 focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Main Heading</Label>
                  <Input 
                    value={formData.hero_heading} 
                    onChange={e => setFormData({...formData, hero_heading: e.target.value})}
                    className="text-xl font-serif border-gold/20 focus:border-gold"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Heritage Visual</Label>
                <div 
                  onClick={() => heroInputRef.current?.click()}
                  className="relative h-64 rounded-2xl overflow-hidden border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all duration-700 bg-ivory/5"
                >
                  {previews.hero ? (
                    <>
                      <img src={getImageUrl(previews.hero)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                        <Camera className="h-8 w-8 text-gold mb-2" />
                        <span className="text-white text-[10px] uppercase tracking-widest">Replace Visual</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20">
                      <Plus className="h-10 w-10 mb-2" />
                      <span className="text-xs">Upload Hero Image</span>
                    </div>
                  )}
                  {isUploading === 'hero' && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-md">
                      <Loader2 className="animate-spin h-8 w-8 text-gold" />
                    </div>
                  )}
                </div>
                <input type="file" ref={heroInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STORY SECTION */}
        <Card className="border-gold/20 shadow-luxe overflow-hidden">
          <CardHeader className="bg-ivory/30 border-b border-gold/10 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <FileText size={20} />
              </div>
              <div>
                <CardTitle className="font-serif text-2xl text-onyx">Atelier Narrative</CardTitle>
                <CardDescription>Detailed storytelling of your brand's journey</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-10 border-b border-gold/10">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Story Eyebrow</Label>
                <Input value={formData.story_eyebrow} onChange={e => setFormData({...formData, story_eyebrow: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Story Heading</Label>
                <Input value={formData.story_heading} onChange={e => setFormData({...formData, story_heading: e.target.value})} className="font-serif" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Narrative Paragraphs</Label>
                <Button variant="ghost" size="sm" onClick={addParagraph} className="text-gold hover:text-onyx hover:bg-gold/10 gap-2 h-8 text-[10px] uppercase tracking-widest font-bold">
                  <Plus size={14} /> Add Paragraph
                </Button>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {formData.story_paragraphs.map((p, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative"
                    >
                      <Textarea 
                        value={p} 
                        onChange={e => updateParagraph(i, e.target.value)}
                        rows={4}
                        placeholder={`Paragraph ${i + 1}...`}
                        className="pr-12 border-gold/10 focus:border-gold bg-ivory/5 transition-all duration-500"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeParagraph(i)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* PROMISE SECTION */}
        <Card className="border-gold/20 shadow-luxe overflow-hidden">
          <CardHeader className="bg-ivory/30 border-b border-gold/10 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <CardTitle className="font-serif text-2xl text-onyx">Brand Promises</CardTitle>
                <CardDescription>Quality assurance and customer guarantees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10 border-b border-gold/10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Promise Eyebrow</Label>
                  <Input value={formData.promise_eyebrow} onChange={e => setFormData({...formData, promise_eyebrow: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Promise Heading</Label>
                  <Input value={formData.promise_heading} onChange={e => setFormData({...formData, promise_heading: e.target.value})} className="font-serif" />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Promise Section Visual</Label>
                <div 
                  onClick={() => promiseInputRef.current?.click()}
                  className="relative h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all duration-700 bg-ivory/5"
                >
                  {previews.promise ? (
                    <>
                      <img src={getImageUrl(previews.promise)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gold" />
                      </div>
                    </>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20">
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-[10px] uppercase tracking-widest">Upload Promise Image</span>
                    </div>
                  )}
                  {isUploading === 'promise' && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-md">
                      <Loader2 className="animate-spin h-6 w-6 text-gold" />
                    </div>
                  )}
                </div>
                <input type="file" ref={promiseInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'promise')} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">List of Guarantees</Label>
                <Button variant="ghost" size="sm" onClick={addPromise} className="text-gold hover:text-onyx hover:bg-gold/10 gap-2 h-8 text-[10px] uppercase tracking-widest font-bold">
                  <Plus size={14} /> Add Promise
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {formData.promises.map((p, i) => (
                    <motion.div 
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative p-6 rounded-2xl border border-gold/10 bg-ivory/10 hover:border-gold/40 hover:bg-white hover:shadow-luxe transition-all duration-500"
                    >
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removePromise(i)}
                        className="absolute top-2 right-2 text-onyx/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </Button>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-gold/60 font-bold">Guarantee Title</Label>
                          <Input 
                            value={p.title} 
                            onChange={e => updatePromise(i, 'title', e.target.value)}
                            placeholder="e.g. Hallmark Certified"
                            className="bg-transparent border-t-0 border-x-0 border-b border-gold/10 rounded-none h-8 px-0 focus:border-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-gold/60 font-bold">Details</Label>
                          <Textarea 
                            value={p.description} 
                            onChange={e => updatePromise(i, 'description', e.target.value)}
                            placeholder="Description of the guarantee..."
                            className="bg-transparent border-gold/5 focus:border-gold text-xs leading-relaxed"
                            rows={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA SECTION */}
        <Card className="border-gold/20 shadow-luxe overflow-hidden">
          <CardHeader className="bg-ivory/30 border-b border-gold/10 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <ChevronRight size={20} />
              </div>
              <div>
                <CardTitle className="font-serif text-2xl text-onyx">Call to Action</CardTitle>
                <CardDescription>The final invitation to explore your collection</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Button Text</Label>
                <Input 
                  value={formData.cta_text} 
                  onChange={e => setFormData({...formData, cta_text: e.target.value})}
                  placeholder="Shop the Collection"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40 font-bold ml-1">Button Link (URL)</Label>
                <Input 
                  value={formData.cta_link} 
                  onChange={e => setFormData({...formData, cta_link: e.target.value})}
                  placeholder="/shop"
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
