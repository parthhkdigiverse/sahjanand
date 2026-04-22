import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["contacts"],
    queryFn: () => authenticatedFetch("http://localhost:8001/api/contacts/").then(res => res.json())
  });

  const deleteMutation = useMutation({
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

  return (
    <div className="space-y-12 animate-fade-up">
      <header className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-onyx/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-onyx tracking-wide">Concierge des Demandes</h1>
          <p className="text-onyx/40 text-[10px] uppercase tracking-[0.2em]">Managing client requests with discretion</p>
        </div>
        <div className="h-12 px-6 bg-onyx text-ivory rounded-lg flex items-center gap-3 text-xs uppercase tracking-widest border border-white/5 shadow-luxe">
          <Calendar className="h-4 w-4 text-gold" />
          <span>Active Inquiries: {inquiries?.length || 0}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {isLoading ? (
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
                  <span>{new Date(inquiry.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-onyx/20 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                onClick={() => {
                  if(confirm("Permanently archive and delete this inquiry?")) {
                    deleteMutation.mutate(inquiry._id);
                  }
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-onyx/5">
                <div className="flex items-center gap-4 group/item">
                  <div className="h-10 w-10 rounded-full bg-onyx/[0.02] flex items-center justify-center text-onyx/30 group-hover/item:text-gold group-hover/item:bg-gold/5 transition-all">
                    <Mail size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase tracking-widest text-onyx/30">Email Address</div>
                    <div className="text-sm font-medium text-onyx">{inquiry.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group/item">
                  <div className="h-10 w-10 rounded-full bg-onyx/[0.02] flex items-center justify-center text-onyx/30 group-hover/item:text-gold group-hover/item:bg-gold/5 transition-all">
                    <Phone size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase tracking-widest text-onyx/30">Phone Number</div>
                    <div className="text-sm font-medium text-onyx">{inquiry.phone}</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-0 h-full w-0.5 bg-gold/10" />
                <p className="text-onyx/70 leading-relaxed font-serif text-lg whitespace-pre-wrap italic pl-4">
                  "{inquiry.message}"
                </p>
              </div>
            </CardContent>
            
            <div className="px-8 py-4 bg-onyx/[0.01] border-t border-onyx/5 flex justify-end">
              <Button variant="link" className="text-[10px] uppercase tracking-widest text-gold hover:text-gold-deep p-0 h-auto">
                Reply via Direct Channel →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
