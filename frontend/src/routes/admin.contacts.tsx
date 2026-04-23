import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Calendar, Loader2, Ticket, MessageSquare, Tag, Package, User, InboxIcon } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

type Inquiry = {
  _id: string;
  name: string;
  email: string;
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

  const generalCount = inquiries?.filter(i => i.type === "GENERAL").length ?? 0;
  const productCount = inquiries?.filter(i => i.type === "PRODUCT").length ?? 0;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Customer Communications</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Managing client requests and marketing leads</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="h-11 px-5 bg-onyx text-ivory rounded-lg flex items-center gap-2 text-xs uppercase tracking-widest border border-white/5 shadow-luxe">
            <Mail className="h-4 w-4 text-gold" />
            <span>Inquiries: {inquiries?.length ?? 0}</span>
          </div>
          <div className="h-11 px-5 bg-gold text-onyx rounded-lg flex items-center gap-2 text-xs uppercase tracking-widest shadow-luxe">
            <Ticket className="h-4 w-4" />
            <span>Leads: {leads?.length ?? 0}</span>
          </div>
        </div>
      </header>

      <Tabs defaultValue="inquiries" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 h-14 rounded-xl border border-onyx/5 shadow-sm w-full sm:w-auto">
          <TabsTrigger
            value="inquiries"
            className="px-8 h-full rounded-lg data-[state=active]:bg-onyx data-[state=active]:text-ivory text-[10px] uppercase tracking-widest transition-all"
          >
            General Inquiries
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="px-8 h-full rounded-lg data-[state=active]:bg-onyx data-[state=active]:text-ivory text-[10px] uppercase tracking-widest transition-all"
          >
            Marketing Leads
          </TabsTrigger>
        </TabsList>

        {/* ── Inquiries Tab ── */}
        <TabsContent value="inquiries" className="space-y-4 outline-none">
          {/* Stats row */}
          {!inquiriesLoading && inquiries && inquiries.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-onyx/50 bg-white border border-onyx/5 rounded-lg px-4 py-2 shadow-sm">
                <MessageSquare className="h-3 w-3 text-gold" />
                <span>{generalCount} general {generalCount === 1 ? "inquiry" : "inquiries"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-onyx/50 bg-white border border-onyx/5 rounded-lg px-4 py-2 shadow-sm">
                <Package className="h-3 w-3 text-gold" />
                <span>{productCount} product {productCount === 1 ? "inquiry" : "inquiries"}</span>
              </div>
            </div>
          )}

          {inquiriesLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Loading inquiries...</span>
            </div>
          ) : !inquiries || inquiries.length === 0 ? (
            <Card className="border-none shadow-card py-20 bg-ivory/50">
              <CardContent className="flex flex-col items-center gap-4 text-center">
                <InboxIcon className="h-12 w-12 text-onyx/10" />
                <p className="font-serif text-onyx/40 italic">No messages in the inbox at this time.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card
                  key={inquiry._id}
                  className="border-none shadow-card hover:shadow-luxe transition-all duration-500 overflow-hidden relative group"
                >
                  {/* Gold accent bar */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-30 group-hover:opacity-100 transition-opacity rounded-l-xl" />

                  <CardHeader className="flex flex-row items-start justify-between py-5 px-8 border-b border-onyx/5 bg-onyx/[0.015]">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl font-serif text-onyx tracking-wide truncate">
                          {inquiry.subject}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={inquiry.type === "PRODUCT"
                            ? "bg-gold/15 text-gold border-gold/20 text-[9px] uppercase tracking-widest"
                            : "bg-onyx/5 text-onyx/50 text-[9px] uppercase tracking-widest"
                          }
                        >
                          {inquiry.type === "PRODUCT" ? (
                            <><Package className="h-2.5 w-2.5 mr-1" />Product</>
                          ) : (
                            <><MessageSquare className="h-2.5 w-2.5 mr-1" />General</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-onyx/40 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-gold">{inquiry.name}</span>
                        </span>
                        <span className="h-1 w-1 bg-onyx/10 rounded-full" />
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(inquiry.created_at).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-onyx/20 hover:text-red-500 hover:bg-red-50 rounded-full shrink-0 ml-2"
                      onClick={() => {
                        if (confirm("Permanently delete this inquiry?")) {
                          deleteInquiryMutation.mutate(inquiry._id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="px-8 py-6 space-y-5">
                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-onyx/5">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="flex items-center gap-3 text-sm text-onyx hover:text-gold transition-colors group/link"
                      >
                        <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover/link:bg-gold/20 transition-colors">
                          <Mail className="h-3.5 w-3.5 text-gold" />
                        </div>
                        <span className="truncate">{inquiry.email}</span>
                      </a>
                      {inquiry.product_name && (
                        <div className="flex items-center gap-3 text-sm text-onyx">
                          <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                            <Tag className="h-3.5 w-3.5 text-gold" />
                          </div>
                          <span className="truncate">Re: {inquiry.product_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="bg-ivory/60 border border-onyx/5 rounded-xl p-5">
                      <p className="text-onyx/70 leading-relaxed font-serif text-base whitespace-pre-wrap italic">
                        "{inquiry.message}"
                      </p>
                    </div>

                    {/* Quick reply button */}
                    <div className="flex justify-end">
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-gold/80 transition-colors border border-gold/20 hover:border-gold/50 rounded-lg px-4 py-2"
                      >
                        <Mail className="h-3.5 w-3.5" /> Reply via Email
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Marketing Leads Tab ── */}
        <TabsContent value="leads" className="space-y-4 outline-none">
          {leadsLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
            </div>
          ) : !leads || leads.length === 0 ? (
            <Card className="border-none shadow-card py-20 bg-ivory/50">
              <CardContent className="flex flex-col items-center gap-4 text-center">
                <Ticket className="h-12 w-12 text-onyx/10" />
                <p className="font-serif text-onyx/40 italic">No marketing leads captured yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <Card
                  key={lead._id}
                  className="border-none shadow-card hover:shadow-luxe transition-all duration-500 overflow-hidden relative group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-onyx opacity-20 group-hover:opacity-80 transition-opacity rounded-l-xl" />

                  <CardHeader className="flex flex-row items-center justify-between py-5 px-8 border-b border-onyx/5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-gold/15 text-gold text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-widest">
                          {lead.offer_code}
                        </span>
                        <CardTitle className="text-lg font-serif text-onyx tracking-wide">
                          {lead.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-onyx/40">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.created_at).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-onyx/20 hover:text-red-500 hover:bg-red-50 rounded-full"
                      onClick={() => {
                        if (confirm("Remove this lead?")) {
                          deleteLeadMutation.mutate(lead._id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="px-8 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-3 text-sm text-onyx hover:text-gold transition-colors group/link"
                      >
                        <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover/link:bg-gold/20 transition-colors">
                          <Mail className="h-3.5 w-3.5 text-gold" />
                        </div>
                        <span className="truncate">{lead.email}</span>
                      </a>
                      <div className="flex items-center gap-3 text-sm text-onyx">
                        <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                          <Phone className="h-3.5 w-3.5 text-gold" />
                        </div>
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
