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
                              title="Reply via Email"
                            >
                              <Mail size={14} />
                            </a>
                            {inquiry.phone && (
                              <a
                                href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-md group/wa"
                                title="Reply via WhatsApp"
                              >
                                <svg viewBox="0 0 448 512" width="22" height="22">
                                  <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.4 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.7 2.8-3.3 3.7-5.7 5.5-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                              </a>
                            )}
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
                            {call.phone && (
                              <a
                                href={`https://wa.me/${call.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-md group/wa"
                                title="Chat on WhatsApp"
                              >
                                <svg viewBox="0 0 448 512" width="22" height="22">
                                  <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.4 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.7 2.8-3.3 3.7-5.7 5.5-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                              </a>
                            )}
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
