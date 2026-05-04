import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNRIPageData, updateNRIPageData, NRIPageData, cleanImageUrl, fetchNRILeads, toggleNRILeadRead, deleteNRILead, NRILead } from "@/lib/api";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Globe, Mail, Phone, MapPin, Inbox, CheckCircle2, Circle, Layout, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/nri")({
  component: AdminNRIPage,
});

function AdminNRIPage() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = authService.getToken();
    if (t) setToken(t);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["nri-page"],
    queryFn: fetchNRIPageData,
  });

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["nri-leads"],
    queryFn: () => fetchNRILeads(token),
    enabled: !!token,
  });

  const toggleReadMutation = useMutation({
    mutationFn: (id: string) => toggleNRILeadRead(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nri-leads"] });
      toast.success("Lead status updated");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteNRILead(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nri-leads"] });
      toast.success("Lead deleted successfully");
    },
  });

  const mutation = useMutation({
    mutationFn: (newData: NRIPageData) => updateNRIPageData(newData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nri-page"] });
      toast.success("NRI page updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update NRI page:", error);
      toast.error("Failed to update NRI page");
    },
  });

  const form = useForm<NRIPageData>({
    defaultValues: {
      hero_heading: "",
      hero_eyebrow: "",
      hero_image: "",
      intro_heading: "",
      intro_paragraphs: [""],
      benefits_image: "",
      benefits: [],
      cta_text: "",
      cta_link: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const introParagraphs = form.watch("intro_paragraphs") || [];
  
  const addParagraph = () => {
    form.setValue("intro_paragraphs", [...introParagraphs, ""]);
  };

  const removeParagraph = (index: number) => {
    form.setValue(
      "intro_paragraphs",
      introParagraphs.filter((_, i) => i !== index)
    );
  };

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: "benefits",
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = (formData: NRIPageData) => {
    if (!token) {
      toast.error("You must be logged in to update data");
      return;
    }
    
    // Clean image URLs before saving
    const cleanedData = {
      ...formData,
      hero_image: cleanImageUrl(formData.hero_image),
      benefits_image: cleanImageUrl(formData.benefits_image)
    };
    
    mutation.mutate(cleanedData);
  };

  if (isLoading) return <div className="p-8 text-center text-onyx/50">Loading...</div>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-onyx mb-2 flex items-center gap-3">
            <Globe className="text-gold" size={28} />
            NRI Services
          </h1>
          <p className="text-sm text-onyx/60">Manage the content and inquiries for your global audience.</p>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-8">
        <TabsList className="bg-ivory border border-onyx/5 p-1 rounded-full h-12 inline-flex">
          <TabsTrigger 
            value="content" 
            className="rounded-full px-8 text-xs tracking-widest uppercase font-bold data-[state=active]:bg-onyx data-[state=active]:text-ivory"
          >
            <Layout size={14} className="mr-2" />
            Page Content
          </TabsTrigger>
          <TabsTrigger 
            value="inquiries" 
            className="rounded-full px-8 text-xs tracking-widest uppercase font-bold data-[state=active]:bg-onyx data-[state=active]:text-ivory"
          >
            <MessageSquare size={14} className="mr-2" />
            Lead Inquiries
            {leads && leads.filter((l: any) => !l.is_read).length > 0 && (
              <span className="ml-2 bg-gold text-onyx w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-pulse">
                {leads.filter((l: any) => !l.is_read).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Hero Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-onyx/5 space-y-6">
              <h2 className="text-xl font-serif text-onyx border-b border-onyx/10 pb-4">Hero Section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Eyebrow</label>
                    <Controller
                      name="hero_eyebrow"
                      control={control}
                      render={({ field }) => <Input {...field} className="bg-ivory/50" />}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Heading</label>
                    <Controller
                      name="hero_heading"
                      control={control}
                      render={({ field }) => <Input {...field} className="bg-ivory/50" />}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Hero Image</label>
                  <Controller
                    name="hero_image"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        className="aspect-video"
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Intro Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-onyx/5 space-y-6">
              <h2 className="text-xl font-serif text-onyx border-b border-onyx/10 pb-4">Introduction</h2>
              
              <div>
                <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Heading</label>
                <Controller
                  name="intro_heading"
                  control={control}
                  render={({ field }) => <Input {...field} className="bg-ivory/50" />}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider">Paragraphs</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addParagraph}
                    className="h-8 text-xs gap-2"
                  >
                    <Plus size={14} /> Add Paragraph
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {introParagraphs.map((p, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={index} 
                      className="flex gap-4 items-start bg-ivory/30 p-4 rounded-xl border border-onyx/5"
                    >
                      <Controller
                        name={`intro_paragraphs.${index}`}
                        control={control}
                        render={({ field: inputField }) => (
                          <Textarea {...inputField} className="bg-white min-h-[100px]" />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParagraph(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-onyx/5 space-y-6">
              <h2 className="text-xl font-serif text-onyx border-b border-onyx/10 pb-4">Benefits & Services</h2>
              
              <div>
                <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Section Image (Optional)</label>
                <Controller
                  name="benefits_image"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      className="aspect-[4/3] max-w-md"
                    />
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider">Services List</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendBenefit({ title: "", description: "" })}
                    className="h-8 text-xs gap-2"
                  >
                    <Plus size={14} /> Add Service
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {benefitFields.map((field, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={field.id} 
                      className="flex gap-4 items-start bg-ivory/30 p-6 rounded-xl border border-onyx/5"
                    >
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-onyx/50 uppercase mb-1 block">Title</label>
                          <Controller
                            name={`benefits.${index}.title`}
                            control={control}
                            render={({ field: inputField }) => (
                              <Input {...field} className="bg-white font-medium" />
                            )}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-onyx/50 uppercase mb-1 block">Description</label>
                          <Controller
                            name={`benefits.${index}.description`}
                            control={control}
                            render={({ field: inputField }) => (
                              <Textarea {...inputField} className="bg-white text-sm" />
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBenefit(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 mt-6"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-onyx/5 space-y-6">
              <h2 className="text-xl font-serif text-onyx border-b border-onyx/10 pb-4">Call to Action</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Heading Over Form</label>
                  <Controller
                    name="cta_text"
                    control={control}
                    render={({ field }) => <Input {...field} className="bg-ivory/50" />}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-onyx/70 uppercase tracking-wider mb-2 block">Action Link (Keep /nri for form anchor)</label>
                  <Controller
                    name="cta_link"
                    control={control}
                    render={({ field }) => <Input {...field} className="bg-ivory/50" placeholder="/nri" />}
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end sticky bottom-8">
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-onyx text-ivory hover:bg-onyx/90 px-8 py-6 rounded-full text-sm tracking-wide font-medium shadow-2xl shadow-onyx/20"
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="inquiries">
          <NRILeadsList 
            leads={leads} 
            isLoading={leadsLoading}
            onToggleRead={(id: string) => toggleReadMutation.mutate(id)}
            onDelete={(id: string) => {
              if (window.confirm("Are you sure you want to delete this inquiry?")) {
                deleteLeadMutation.mutate(id);
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NRILeadsList({ leads, isLoading, onToggleRead, onDelete }: any) {
  if (isLoading) return <div className="p-20 text-center text-onyx/50">Loading inquiries...</div>;

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-20 text-center border border-onyx/5">
        <Inbox className="mx-auto text-onyx/10 mb-4" size={48} />
        <p className="text-onyx/40 font-medium">No inquiries received yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {leads.map((lead: any) => (
        <motion.div
          key={lead._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-6 border ${lead.is_read ? 'border-onyx/5 opacity-70' : 'border-gold/30 shadow-luxe'} relative group`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${lead.is_read ? 'bg-onyx/5 text-onyx/30' : 'bg-gold/10 text-gold'}`}>
                 {lead.is_read ? <CheckCircle2 size={16} /> : <Circle size={16} fill="currentColor" />}
               </div>
               <div>
                 <h4 className="font-serif text-lg text-onyx">{lead.name}</h4>
                 <span className="text-[10px] text-onyx/40 uppercase tracking-widest">{new Date(lead.created_at).toLocaleDateString()}</span>
               </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleRead(lead._id)}
                className={`h-8 w-8 ${lead.is_read ? 'text-onyx/40' : 'text-gold'} hover:bg-gold/10`}
                title={lead.is_read ? "Mark as Unread" : "Mark as Read"}
              >
                {lead.is_read ? <Circle size={14} /> : <CheckCircle2 size={14} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(lead._id)}
                className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-onyx/60">
              <Mail size={14} className="text-onyx/30" />
              <a href={`mailto:${lead.email}`} className="hover:text-gold transition-colors">{lead.email}</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-onyx/60">
              <Phone size={14} className="text-onyx/30" />
              <a href={`tel:${lead.phone}`} className="hover:text-gold transition-colors">{lead.phone}</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-onyx/60">
              <MapPin size={14} className="text-onyx/30" />
              <span>{lead.country}</span>
            </div>
          </div>

          <div className="bg-ivory/50 p-4 rounded-xl text-sm text-onyx/80 leading-relaxed italic border border-onyx/5">
            "{lead.message}"
          </div>
        </motion.div>
      ))}
    </div>
  );
}
