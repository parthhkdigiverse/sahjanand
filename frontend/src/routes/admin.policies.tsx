import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Loader2, Save, ArrowLeft, GripVertical } from "lucide-react";
import { fetchPolicies, createPolicy, updatePolicy, deletePolicy, Policy, PolicySection } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth";

export const Route = createFileRoute("/admin/policies")({
  component: AdminPolicies,
});

function AdminPolicies() {
  const queryClient = useQueryClient();
  const token = authService.getToken() || "";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  const [formData, setFormData] = useState<Policy>({
    slug: "",
    title: "",
    intro: "",
    sections: []
  });

  const { data: policies, isLoading } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
  });

  const upsertMutation = useMutation({
    mutationFn: (data: Policy) => {
      if (editingPolicy?._id) {
        return updatePolicy(editingPolicy._id, data, token);
      } else {
        return createPolicy(data, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success(editingPolicy ? "Policy updated" : "Policy created");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Error saving policy"),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deletePolicy(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy deleted");
    },
    onError: () => toast.error("Error deleting policy"),
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      intro: "",
      sections: []
    });
    setEditingPolicy(null);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: "", body: [""] }]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const updateSectionHeading = (index: number, val: string) => {
    const newSections = [...formData.sections];
    newSections[index].heading = val;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const addLine = (sectionIndex: number) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].body.push("");
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const removeLine = (sectionIndex: number, lineIndex: number) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].body = newSections[sectionIndex].body.filter((_, i) => i !== lineIndex);
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const updateLine = (sectionIndex: number, lineIndex: number, val: string) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].body[lineIndex] = val;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Legal & Policies</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Manage your brand's legal narrative</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 px-8 transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe sheen"
        >
          <Plus className="mr-3 h-4 w-4" /> Add Policy
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin h-8 w-8 text-gold" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies?.map((policy) => (
            <Card key={policy.slug} className="border-none shadow-card hover:shadow-luxe transition-all duration-500 group overflow-hidden">
               <CardHeader className="bg-onyx/[0.02] border-b border-onyx/5">
                <CardTitle className="font-serif text-xl group-hover:text-gold transition-colors">{policy.title}</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">/{policy.slug}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-onyx/60 line-clamp-2 italic">"{policy.intro}"</p>
                <div className="flex justify-end gap-2 pt-4 border-t border-onyx/5">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(policy)} className="h-8 w-8 text-onyx/40 hover:text-gold hover:bg-gold/5">
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if(confirm("Delete this policy?")) removeMutation.mutate(policy._id!); }} className="h-8 w-8 text-onyx/40 hover:text-red-500 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-ivory border-none shadow-luxe p-0">
          <div className="sticky top-0 z-10 bg-ivory/80 backdrop-blur-md p-8 border-b border-onyx/5 flex justify-between items-center">
            <DialogHeader>
              <DialogTitle className="font-serif text-3xl text-onyx">
                {editingPolicy ? "Update Policy" : "Draft New Policy"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-4">
               <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="uppercase tracking-widest text-[10px]">Discard</Button>
               <Button 
                onClick={() => upsertMutation.mutate(formData)}
                disabled={upsertMutation.isPending}
                className="bg-onyx text-ivory hover:bg-gold hover:text-onyx uppercase tracking-widest text-[10px] px-8 h-10 shadow-luxe sheen"
              >
                {upsertMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save size={14} className="mr-2" />}
                {editingPolicy ? "Update Document" : "Publish Document"}
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">Policy Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white border-onyx/5 focus:border-gold/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">URL Slug</Label>
                <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="privacy-policy" className="bg-white border-onyx/5 focus:border-gold/50" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">Introduction Summary</Label>
                <Textarea value={formData.intro} onChange={e => setFormData({...formData, intro: e.target.value})} className="bg-white border-onyx/5 focus:border-gold/50 font-serif italic" rows={3} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl">Legal Sections</h3>
                <Button variant="outline" size="sm" onClick={addSection} className="text-gold border-gold/20 hover:bg-gold/5 text-[10px] uppercase tracking-widest">
                  <Plus size={14} className="mr-2" /> Add Section
                </Button>
              </div>

              <div className="space-y-8">
                {formData.sections.map((section, sIndex) => (
                  <Card key={sIndex} className="border-onyx/5 bg-onyx/[0.01]">
                    <CardHeader className="flex flex-row items-center justify-between py-4 bg-onyx/[0.02]">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-onyx/20 font-serif text-2xl">{sIndex + 1}</span>
                        <Input 
                          value={section.heading} 
                          onChange={e => updateSectionHeading(sIndex, e.target.value)} 
                          placeholder="Section Heading"
                          className="bg-transparent border-none focus:ring-0 text-lg font-serif px-0" 
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeSection(sIndex)} className="text-onyx/20 hover:text-red-500">
                        <Trash2 size={16} />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {section.body.map((line, lIndex) => (
                        <div key={lIndex} className="flex gap-3 items-start group">
                          <span className="mt-4 text-gold/30 line-clamp-1 w-4 h-px bg-gold/30 shrink-0" />
                          <Textarea 
                            value={line} 
                            onChange={e => updateLine(sIndex, lIndex, e.target.value)}
                            className="bg-white border-onyx/5 focus:border-gold/10 text-sm py-3 min-h-[40px] resize-none overflow-hidden" 
                            rows={1}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeLine(sIndex, lIndex)} className="opacity-0 group-hover:opacity-100 h-10 w-10 text-onyx/10 hover:text-red-300">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addLine(sIndex)} className="text-[10px] uppercase tracking-widest text-gold/60 hover:text-gold hover:bg-gold/5 mt-2">
                        <Plus size={12} className="mr-2" /> Add Bullet Point
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
