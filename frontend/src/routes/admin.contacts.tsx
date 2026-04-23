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
                  className="border border-onyx/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${inquiry.type === "PRODUCT" ? "bg-gold" : "bg-onyx/30"}`} />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold">
                          {inquiry.type === "PRODUCT" ? "Product Inquiry" : "General Inquiry"}
                        </span>
                        <CardTitle className="text-lg font-serif text-onyx">
                          {inquiry.subject.replace("Product Inquiry: ", "")}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] uppercase tracking-widest text-onyx/40">
                          {new Date(inquiry.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-onyx/20 hover:text-red-500 hover:bg-red-50"
                        onClick={() => {
                          if (confirm("Delete this inquiry?")) {
                            deleteInquiryMutation.mutate(inquiry._id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                      <div className="flex flex-wrap gap-8">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-onyx/40">Customer</p>
                          <p className="text-sm font-medium">{inquiry.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-onyx/40">Email Address</p>
                          <a href={`mailto:${inquiry.email}`} className="text-sm text-gold hover:underline">{inquiry.email}</a>
                        </div>
                        {inquiry.phone && (
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-onyx/40">Phone Number</p>
                            <p className="text-sm font-medium">{inquiry.phone}</p>
                          </div>
                        )}
                        {inquiry.preferred_date && (
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-onyx/40">Requested Date</p>
                            <p className="text-sm font-medium">{inquiry.preferred_date}</p>
                          </div>
                        )}
                        {inquiry.product_name && (
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-onyx/40">Regarding</p>
                            <p className="text-sm text-onyx/70">{inquiry.product_name}</p>
                          </div>
                        )}
                      </div>
                      
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                        className="inline-flex items-center gap-2 bg-onyx text-ivory px-5 py-2 rounded-lg text-[10px] uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all shadow-sm"
                      >
                        <Mail className="h-3.5 w-3.5" /> Reply
                      </a>
                    </div>

                    <div className="bg-secondary/5 rounded-lg p-5 border border-onyx/5">
                      <p className="text-onyx/80 leading-relaxed text-sm whitespace-pre-wrap italic">
                        "{inquiry.message}"
                      </p>
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
                className="border border-onyx/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-gold/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                        Welcome Offer Claimed
                      </span>
                      <CardTitle className="text-lg font-serif text-onyx">
                        {lead.name}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-gold/10 text-gold text-[10px] font-bold px-3 py-1 rounded border border-gold/20 tracking-widest">
                      {lead.offer_code}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-onyx/20 hover:text-red-500 hover:bg-red-50"
                      onClick={() => {
                        if (confirm("Remove this lead?")) {
                          deleteLeadMutation.mutate(lead._id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-8">
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest text-onyx/40">Email Address</p>
                        <a href={`mailto:${lead.email}`} className="text-sm text-gold hover:underline">{lead.email}</a>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest text-onyx/40">Phone Number</p>
                        <p className="text-sm font-medium">{lead.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest text-onyx/40">Date Captured</p>
                        <p className="text-sm text-onyx/70">
                          {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN", { 
                            day: '2-digit', month: 'short', year: 'numeric', 
                            hour: '2-digit', minute: '2-digit' 
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <a
                      href={`mailto:${lead.email}?subject=Welcome to Maison Aurum&body=Hello ${lead.name}, thank you for your interest in Maison Aurum. Your welcome code ${lead.offer_code} is ready to use.`}
                      className="inline-flex items-center gap-2 border border-onyx text-onyx px-5 py-2 rounded-lg text-[10px] uppercase tracking-widest hover:bg-onyx hover:text-ivory transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" /> Contact Lead
                    </a>
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
