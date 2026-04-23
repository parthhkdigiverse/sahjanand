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
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx/20 h-3.5 w-3.5 group-focus-within:text-gold transition-colors" />
            <input 
              className="w-full h-10 pl-10 pr-4 bg-white border border-onyx/5 rounded-lg shadow-sm placeholder:text-onyx/20 outline-none focus:border-gold/30 transition-all text-xs font-medium" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="inquiries" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white p-1 h-10 rounded-lg border border-onyx/5 shadow-sm w-full sm:w-auto flex items-stretch">
          <TabsTrigger
            value="inquiries"
            className="px-6 flex-1 sm:flex-none rounded-md data-[state=active]:bg-onyx data-[state=active]:text-gold text-[9px] uppercase tracking-widest transition-all font-bold"
          >
            Inquiries ({inquiries?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="px-6 flex-1 sm:flex-none rounded-md data-[state=active]:bg-onyx data-[state=active]:text-gold text-[9px] uppercase tracking-widest transition-all font-bold"
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
            <div className="bg-white rounded-2xl border border-onyx/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-onyx/[0.02] border-b border-onyx/5">
                  <tr>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Type</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Customer</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Subject & Message</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Received</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-onyx/5">
                  <AnimatePresence mode="popLayout">
                    {filteredInquiries.map((inquiry, idx) => (
                      <motion.tr
                        key={inquiry._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-ivory/20 transition-colors group"
                      >
                        <td className="py-5 px-6 align-top">
                          <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black ${inquiry.type === "PRODUCT" ? "bg-gold/10 text-gold" : "bg-onyx/5 text-onyx/40"}`}>
                            {inquiry.type === "PRODUCT" ? "Product" : "General"}
                          </span>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-onyx">{inquiry.name}</span>
                            <span className="text-[10px] text-onyx/40 font-medium">{inquiry.email}</span>
                            {inquiry.phone && <span className="text-[10px] text-onyx/30 mt-1">{inquiry.phone}</span>}
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="max-w-md">
                            <h4 className="text-sm font-serif text-onyx font-bold mb-1 line-clamp-1">
                              {inquiry.subject.replace("Product Inquiry: ", "")}
                            </h4>
                            <p className="text-xs text-onyx/50 line-clamp-2 leading-relaxed">
                              "{inquiry.message}"
                            </p>
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <span className="text-[10px] text-onyx/40 font-bold uppercase tracking-widest">
                            {new Date(inquiry.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="py-5 px-6 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                              className="h-9 w-9 flex items-center justify-center rounded-lg bg-onyx text-ivory hover:bg-gold hover:text-onyx transition-all shadow-sm"
                              title="Reply"
                            >
                              <Mail size={14} />
                            </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-red-500/30 hover:text-red-500 hover:bg-red-500/5"
                              onClick={() => {
                                if (confirm("Delete this inquiry?")) {
                                  deleteInquiryMutation.mutate(inquiry._id);
                                }
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredLeads.map((lead, idx) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="rounded-2xl border-onyx/5 shadow-sm hover:shadow-md transition-all p-5 group relative overflow-hidden bg-white">
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[8px] font-black tracking-widest border border-gold/10 uppercase">
                            {lead.offer_code}
                          </span>
                          <h3 className="font-serif text-lg text-onyx">{lead.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500/30 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            if (confirm("Remove this lead?")) {
                              deleteLeadMutation.mutate(lead._id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-onyx/5 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase tracking-widest text-onyx/30 font-black">Email</span>
                          <a href={`mailto:${lead.email}`} className="font-bold text-gold hover:underline">{lead.email}</a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase tracking-widest text-onyx/30 font-black">Phone</span>
                          <span className="font-bold text-onyx">{lead.phone}</span>
                        </div>
                      </div>

                      <a
                        href={`mailto:${lead.email}?subject=Welcome to Sahajanand Jewellers&body=Hello ${lead.name}, thank you for your interest in Sahajanand Jewellers. Your welcome code ${lead.offer_code} is ready to use.`}
                        className="w-full bg-onyx text-ivory hover:bg-gold hover:text-onyx h-10 flex items-center justify-center rounded-lg text-[9px] uppercase tracking-widest font-black transition-all gap-2"
                      >
                        <Mail size={12} />
                        Contact
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
