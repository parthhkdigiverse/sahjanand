import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Calendar, Loader2, Ticket, MessageSquare, Tag, Package, User, InboxIcon, Search, Filter, Download, ArrowUpRight, ExternalLink } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  preferred_date?: string;
  subject: string;
  message: string;
  type: "GENERAL" | "PRODUCT";
  product_id?: string;
  product_name?: string;
  created_at: string;
};

type OfferLead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  offer_code: string;
  created_at: string;
};

function AdminContacts() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("inquiries");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["contacts"],
    queryFn: () => authenticatedFetch(`${API_BASE}/contacts/`).then(res => res.json()),
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<OfferLead[]>({
    queryKey: ["offer-leads"],
    queryFn: async () => {
      const res = await authenticatedFetch(`${API_BASE}/offer-leads/`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/contacts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Inquiry removed");
    },
    onError: () => toast.error("Error deleting inquiry"),
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`${API_BASE}/offer-leads/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete lead");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead removed");
    },
    onError: () => toast.error("Error removing lead"),
  });

  const filteredInquiries = inquiries?.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads?.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.offer_code.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="inquiries" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 h-12 rounded-xl border border-onyx/5 shadow-sm w-full sm:w-auto flex items-stretch">
          <TabsTrigger
            value="inquiries"
            className="px-8 flex-1 sm:flex-none rounded-lg data-[state=active]:bg-onyx data-[state=active]:text-gold text-[10px] uppercase tracking-widest transition-all font-bold"
          >
            Inquiries ({inquiries?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="px-8 flex-1 sm:flex-none rounded-lg data-[state=active]:bg-onyx data-[state=active]:text-gold text-[10px] uppercase tracking-widest transition-all font-bold"
          >
            Offers & Leads ({leads?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries" className="space-y-4 outline-none">
          {inquiriesLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
              <span className="text-[10px] uppercase tracking-widest text-onyx/20 font-bold">Loading...</span>
            </div>
          ) : !filteredInquiries || filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-onyx/5 p-20 flex flex-col items-center gap-4 text-center shadow-sm">
              <InboxIcon className="h-12 w-12 text-onyx/5" />
              <p className="font-serif text-onyx/30 italic">No inquiries found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredInquiries.map((inquiry, idx) => (
                  <motion.div
                    key={inquiry._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="rounded-3xl border-onyx/5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                      <div className="flex flex-col sm:flex-row min-h-[200px]">
                        <div className={`w-full sm:w-2 ${inquiry.type === "PRODUCT" ? "bg-gold" : "bg-onyx/10"}`} />
                        <div className="flex-1 p-6 sm:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] uppercase tracking-widest font-black ${inquiry.type === "PRODUCT" ? "text-gold" : "text-onyx/40"}`}>
                                  {inquiry.type === "PRODUCT" ? "Product Inquiry" : "General Inquiry"}
                                </span>
                                <span className="text-[9px] text-onyx/20">•</span>
                                <span className="text-[9px] uppercase tracking-widest text-onyx/40 font-bold">
                                  {new Date(inquiry.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <h3 className="text-xl font-serif text-onyx">
                                {inquiry.subject.replace("Product Inquiry: ", "")}
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500/30 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                              onClick={() => {
                                if (confirm("Delete this inquiry?")) {
                                  deleteInquiryMutation.mutate(inquiry._id);
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-6 border-y border-onyx/5">
                            <div className="space-y-1">
                              <p className="text-[8px] uppercase tracking-widest text-onyx/30 font-black">Customer</p>
                              <p className="text-sm font-bold text-onyx">{inquiry.name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] uppercase tracking-widest text-onyx/30 font-black">Email</p>
                              <a href={`mailto:${inquiry.email}`} className="text-sm text-gold hover:underline font-bold">{inquiry.email}</a>
                            </div>
                            {inquiry.phone && (
                              <div className="space-y-1">
                                <p className="text-[8px] uppercase tracking-widest text-onyx/30 font-black">Phone</p>
                                <p className="text-sm font-bold text-onyx">{inquiry.phone}</p>
                              </div>
                            )}
                            {inquiry.product_name && (
                              <div className="space-y-1">
                                <p className="text-[8px] uppercase tracking-widest text-onyx/30 font-black">Product</p>
                                <p className="text-sm text-onyx/60 font-medium italic font-serif">{inquiry.product_name}</p>
                              </div>
                            )}
                          </div>

                          <div className="relative mb-6">
                            <p className="text-base font-serif italic text-onyx/70 leading-relaxed pl-4 border-l-2 border-gold/20">
                              "{inquiry.message}"
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <a
                              href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                              className="bg-onyx text-ivory hover:bg-gold hover:text-onyx px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2"
                            >
                              <Mail size={14} />
                              Reply
                            </a>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads" className="space-y-4 outline-none">
          {leadsLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
            </div>
          ) : !filteredLeads || filteredLeads.length === 0 ? (
            <div className="bg-white rounded-3xl border border-onyx/5 p-20 flex flex-col items-center gap-4 text-center shadow-sm">
              <Ticket className="h-12 w-12 text-onyx/5" />
              <p className="font-serif text-onyx/30 italic">No leads found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLeads.map((lead, idx) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="rounded-3xl border-onyx/5 shadow-sm hover:shadow-lg transition-all p-6 sm:p-8 group relative overflow-hidden bg-white">
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-gold font-black">Offer Code</span>
                            <span className="px-2 py-0.5 rounded-md bg-gold/10 text-gold text-[10px] font-black tracking-widest border border-gold/10">
                              {lead.offer_code}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl text-onyx">{lead.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500/30 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            if (confirm("Remove this lead?")) {
                              deleteLeadMutation.mutate(lead._id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-onyx/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest text-onyx/30 font-black">Email</span>
                          <a href={`mailto:${lead.email}`} className="text-sm font-bold text-gold hover:underline">{lead.email}</a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest text-onyx/30 font-black">Phone</span>
                          <span className="text-sm font-bold text-onyx">{lead.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest text-onyx/30 font-black">Captured</span>
                          <span className="text-xs font-medium text-onyx/40">
                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN", { 
                              day: '2-digit', month: 'short', year: 'numeric'
                            }) : "N/A"}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`mailto:${lead.email}?subject=Welcome to Maison Aurum&body=Hello ${lead.name}, thank you for your interest in Maison Aurum. Your welcome code ${lead.offer_code} is ready to use.`}
                        className="w-full bg-onyx text-ivory hover:bg-gold hover:text-onyx h-12 flex items-center justify-center rounded-xl text-[10px] uppercase tracking-widest font-black transition-all gap-2"
                      >
                        <Mail size={14} />
                        Contact Lead
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
