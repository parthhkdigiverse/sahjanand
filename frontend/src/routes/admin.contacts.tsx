import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Trash2, 
  Mail, 
  Loader2, 
  MessageSquare, 
  InboxIcon, 
  Search, 
  ChevronRight, 
  Star,
  Phone,
  Circle,
  CheckCircle2,
  Inbox
} from "lucide-react";
import { authenticatedFetch, authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { API_BASE, fetchOfferLeads, OfferLead, toggleOfferLeadRead, deleteOfferLead } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

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

function AdminContacts() {
  const queryClient = useQueryClient();
  const token = authService.getToken() || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "unread">("all");
  const [leadFilter, setLeadFilter] = useState<"all" | "unread">("all");

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["contacts"],
    queryFn: () => authenticatedFetch(`${API_BASE}/contacts/`).then(res => res.json()),
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<OfferLead[]>({
    queryKey: ["offer-leads"],
    queryFn: () => fetchOfferLeads(token),
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

  const toggleInquiryReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const res = await authenticatedFetch(`${API_BASE}/contacts/${id}/toggle-read`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: isRead }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Inquiry status updated");
    },
  });

  const toggleLeadReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => toggleOfferLeadRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead status updated");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteOfferLead(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead removed");
    },
  });

  const videoCalls = inquiries?.filter(i => i.type === "VIDEO_CALL");
  const standardInquiries = inquiries?.filter(i => i.type !== "VIDEO_CALL");

  const filteredInquiries = standardInquiries?.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (inquiryFilter === "unread") return matchesSearch && !i.is_read;
    return matchesSearch;
  });

  const filteredVideoCalls = videoCalls?.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.phone?.includes(searchTerm) ||
      i.preferred_date?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredLeads = leads?.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.phone.includes(searchTerm);

    if (leadFilter === "unread") return matchesSearch && !l.is_read;
    return matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx">Customer Inquiries</h1>
          <p className="text-muted-foreground text-sm">Manage messages, video consultations, and promotional leads</p>
        </div>
      </header>

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

      <Tabs defaultValue="inquiries" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-onyx/[0.03] p-1 h-12 rounded-xl border border-onyx/5">
            <TabsTrigger value="inquiries" className="px-8 text-[10px] uppercase tracking-widest font-black data-[state=active]:bg-onyx data-[state=active]:text-gold rounded-lg transition-all">
              Standard Inquiries ({standardInquiries?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="videocalls" className="px-8 text-[10px] uppercase tracking-widest font-black data-[state=active]:bg-onyx data-[state=active]:text-gold rounded-lg transition-all flex items-center gap-2">
              Video Consultations ({videoCalls?.length || 0})
              {videoCalls?.some(v => !v.is_read) && <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />}
            </TabsTrigger>
            <TabsTrigger value="leads" className="px-8 text-[10px] uppercase tracking-widest font-black data-[state=active]:bg-onyx data-[state=active]:text-gold rounded-lg transition-all flex items-center gap-2">
              Promotional Leads ({leads?.length || 0})
              {leads?.some(l => !l.is_read) && <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inquiries" className="space-y-6 outline-none">
          {inquiriesLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
              <span className="text-[10px] uppercase tracking-widest text-onyx/20 font-bold">Loading inquiries...</span>
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
                    {filteredInquiries.map((inquiry) => (
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
                            <h4 className="text-sm font-serif text-onyx font-bold mb-1">
                              {inquiry.subject.replace("Product Inquiry: ", "")}
                            </h4>
                            <p className="text-xs text-onyx/50 line-clamp-2 leading-relaxed italic">
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

        <TabsContent value="videocalls" className="space-y-6 outline-none">
          {!filteredVideoCalls || filteredVideoCalls.length === 0 ? (
            <div className="bg-white rounded-3xl border border-onyx/5 p-20 flex flex-col items-center gap-4 text-center shadow-sm">
              <InboxIcon className="h-12 w-12 text-onyx/5" />
              <p className="font-serif text-onyx/30 italic">No video consultation requests found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-onyx/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-onyx/[0.02] border-b border-onyx/5">
                  <tr>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Status</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Scheduled For</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Customer</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold">Request Detail</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest text-onyx/40 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-onyx/5">
                  <AnimatePresence mode="popLayout">
                    {filteredVideoCalls.map((call) => (
                      <motion.tr
                        key={call._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`hover:bg-ivory/20 transition-colors group ${!call.is_read ? 'bg-gold/[0.02]' : ''}`}
                      >
                        <td className="py-5 px-6 align-top">
                          {!call.is_read ? (
                            <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-gold">
                              <Circle size={8} className="fill-gold" /> New Request
                            </span>
                          ) : (
                            <span className="text-[8px] font-black uppercase tracking-widest text-onyx/20">
                              Reviewed
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-onyx font-serif">{call.preferred_date}</span>
                            <span className="text-[10px] text-onyx/40 font-bold uppercase tracking-widest mt-1">
                              Received: {new Date(call.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-onyx">{call.name}</span>
                            <span className="text-[10px] text-onyx/40 font-medium">{call.phone}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <p className="text-xs text-onyx/50 italic max-w-xs leading-relaxed">
                            "{call.message}"
                          </p>
                        </td>
                        <td className="py-5 px-6 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-9 w-9 rounded-lg ${call.is_read ? 'text-onyx/20' : 'text-gold bg-gold/5 hover:bg-gold/10'}`}
                              onClick={() => toggleInquiryReadMutation.mutate({ id: call._id, isRead: !call.is_read })}
                            >
                              <CheckCircle2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-red-500/30 hover:text-red-500 hover:bg-red-500/5"
                              onClick={() => confirm("Remove this consultation request?") && deleteInquiryMutation.mutate(call._id)}
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

        <TabsContent value="leads" className="space-y-6 outline-none">
          {/* FILTER BUTTONS */}
          <div className="flex justify-start">
            <div className="flex bg-white p-1 rounded-lg border border-onyx/5 shadow-sm">
              <button 
                onClick={() => setLeadFilter("all")}
                className={`px-6 py-2.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${leadFilter === "all" ? "bg-onyx text-gold shadow-md" : "text-onyx/30 hover:text-onyx"}`}
              >
                All ({leads?.length || 0})
              </button>
              <button 
                onClick={() => setLeadFilter("unread")}
                className={`px-6 py-2.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${leadFilter === "unread" ? "bg-onyx text-gold shadow-md" : "text-onyx/30 hover:text-onyx"}`}
              >
                Unread ({leads?.filter(l => !l.is_read).length || 0})
              </button>
            </div>
          </div>

          {leadsLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin h-8 w-8 text-gold/40" />
            </div>
          ) : !filteredLeads || filteredLeads.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-dashed border-onyx/10 p-20 flex flex-col items-center gap-4 text-center">
              <InboxIcon className="h-12 w-12 text-onyx/5" />
              <p className="font-serif text-onyx/30 italic">No promotional leads found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead) => (
                  <motion.div
                    key={lead._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className={`group relative overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-xl rounded-2xl ${lead.is_read ? "bg-white" : "bg-white ring-1 ring-gold/20 shadow-gold/5"}`}>
                      {!lead.is_read && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 h-4">
                              {!lead.is_read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                              )}
                            </div>
                            <CardTitle className="font-serif text-xl text-onyx leading-tight">{lead.name}</CardTitle>
                            <p className="text-[9px] text-onyx/30 font-bold uppercase tracking-widest">
                              {new Date(lead.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleLeadReadMutation.mutate({ id: lead._id, isRead: !lead.is_read })}
                              className={`h-8 w-8 rounded-full ${lead.is_read ? "text-onyx/20" : "text-gold bg-gold/5"}`}
                              title={lead.is_read ? "Mark as unread" : "Mark as read"}
                            >
                              {lead.is_read ? <Circle size={14} /> : <CheckCircle2 size={14} />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => confirm("Delete this lead permanently?") && deleteLeadMutation.mutate(lead._id)}
                              className="h-8 w-8 rounded-full text-red-500/20 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="space-y-0.5">
                              <span className="text-[8px] uppercase tracking-widest text-onyx/30 font-bold">Contact Number</span>
                              <p className="text-xs font-bold text-onyx flex items-center gap-1.5">
                                <Phone size={10} className="text-gold" /> {lead.phone}
                              </p>
                            </div>
                            {lead.email && (
                              <div className="space-y-0.5">
                                <span className="text-[8px] uppercase tracking-widest text-onyx/30 font-bold">Electronic Mail</span>
                                <p className="text-xs font-bold text-onyx flex items-center gap-1.5 truncate">
                                  <Mail size={10} className="text-gold" /> {lead.email}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* DYNAMIC FIELDS */}
                          {lead.data && Object.keys(lead.data).length > 0 && (
                            <div className="pt-3 border-t border-onyx/5 grid grid-cols-2 gap-4">
                              {Object.entries(lead.data).map(([key, value]) => (
                                value ? (
                                  <div key={key} className="space-y-0.5">
                                    <span className="text-[8px] uppercase tracking-widest text-onyx/30 font-bold">
                                      {key.replace(/_/g, ' ')}
                                    </span>
                                    <p className="text-xs font-bold text-onyx leading-tight capitalize">
                                      {String(value)}
                                    </p>
                                  </div>
                                ) : null
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
