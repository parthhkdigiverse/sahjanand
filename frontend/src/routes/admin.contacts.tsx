import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Calendar, Loader2, User, Ticket } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { fetchOfferLeads, deleteOfferLead, OfferLead } from "@/lib/api";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
};

function AdminContacts() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("inquiries");

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["contacts"],
    queryFn: () => authenticatedFetch("http://localhost:8001/api/contacts/").then(res => res.json())
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<OfferLead[]>({
    queryKey: ["offer-leads"],
    queryFn: () => {
      const token = localStorage.getItem("maison_aurum_admin_token") || "";
      return fetchOfferLeads(token);
    }
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`http://localhost:8001/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Inquiry removed");
    },
    onError: () => toast.error("Error deleting inquiry")
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("maison_aurum_admin_token") || "";
      return deleteOfferLead(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-leads"] });
      toast.success("Lead removed");
    },
  });

  return (
    <div className="space-y-12 animate-fade-up">
      <header className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Customer Communications</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Managing client requests and marketing leads</p>
        </div>
        <div className="flex gap-4">
          <div className="h-12 px-6 bg-onyx text-ivory rounded-lg flex items-center gap-3 text-xs uppercase tracking-widest border border-white/5 shadow-luxe">
            <Mail className="h-4 w-4 text-gold" />
            <span>Inquiries: {inquiries?.length || 0}</span>
          </div>
          <div className="h-12 px-6 bg-gold text-onyx rounded-lg flex items-center gap-3 text-xs uppercase tracking-widest shadow-luxe">
            <Ticket className="h-4 w-4 text-onyx" />
            <span>Leads: {leads?.length || 0}</span>
          </div>
        </div>
      </header>

      <Tabs defaultValue="inquiries" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white p-1 h-14 rounded-xl border border-onyx/5 shadow-sm">
          <TabsTrigger value="inquiries" className="px-8 h-full rounded-lg data-[state=active]:bg-onyx data-[state=active]:text-ivory text-[10px] uppercase tracking-widest transition-all">
            General Inquiries
          </TabsTrigger>
          <TabsTrigger value="leads" className="px-8 h-full rounded-lg data-[state=active]:bg-onyx data-[state=active]:text-ivory text-[10px] uppercase tracking-widest transition-all">
            Marketing Leads (Offers)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries" className="space-y-8 outline-none">
          {inquiriesLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Consulting Archives...</span>
            </div>
          ) : inquiries?.length === 0 ? (
            <Card className="border-none shadow-card py-20 bg-ivory/50">
              <CardContent className="text-center font-serif text-onyx/40 italic">
                No messages in the concierge inbox at this time.
              </CardContent>
            </Card>
          ) : inquiries?.map((inquiry) => (
            <Card key={inquiry._id} className="border-none shadow-card hover:shadow-luxe transition-all duration-500 overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold opacity-30 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-onyx/5 bg-onyx/[0.01]">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-serif text-onyx tracking-wide">{inquiry.subject}</CardTitle>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-onyx/40">
                    <span className="font-medium text-gold">{inquiry.name}</span>
                    <span className="h-1 w-1 bg-onyx/10 rounded-full" />
                    <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-onyx/20 hover:text-red-500 hover:bg-red-50 rounded-full"
                  onClick={() => {
                    if(confirm("Permanently archive and delete this inquiry?")) {
                      deleteInquiryMutation.mutate(inquiry._id);
                    }
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-onyx/5">
                  <div className="flex items-center gap-4">
                    <Mail size={16} className="text-gold" />
                    <div className="text-sm text-onyx">{inquiry.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={16} className="text-gold" />
                    <div className="text-sm text-onyx">{inquiry.phone}</div>
                  </div>
                </div>
                <p className="text-onyx/70 leading-relaxed font-serif text-lg whitespace-pre-wrap italic">
                  "{inquiry.message}"
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leads" className="space-y-8 outline-none">
          {leadsLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
            </div>
          ) : !leads || leads.length === 0 ? (
            <Card className="border-none shadow-card py-20 bg-ivory/50">
              <CardContent className="text-center font-serif text-onyx/40 italic">
                No marketing leads captured yet.
              </CardContent>
            </Card>
          ) : leads.map((lead) => (
            <Card key={lead._id} className="border-none shadow-card hover:shadow-luxe transition-all duration-500 overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-onyx opacity-30 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-onyx/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-gold" />
                    <CardTitle className="text-xl font-serif text-onyx tracking-wide">{lead.offer_code} Claimant</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-onyx/40">
                    <span className="font-medium text-gold">{lead.name}</span>
                    <span className="h-1 w-1 bg-onyx/10 rounded-full" />
                    <span>{new Date(lead.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-onyx/20 hover:text-red-500 hover:bg-red-50 rounded-full"
                  onClick={() => {
                    if(confirm("Remove this lead?")) {
                      deleteLeadMutation.mutate(lead._id);
                    }
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <Mail size={16} className="text-gold" />
                    <div className="text-sm text-onyx">{lead.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={16} className="text-gold" />
                    <div className="text-sm text-onyx">{lead.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
