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
    queryFn: () => authenticatedFetch("http://localhost:8002/api/contacts/").then(res => res.json())
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`http://localhost:8002/api/contacts/${id}`, {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-onyx">Customer Inquiries</h1>
        <p className="text-muted-foreground mt-1">Review and manage messages from your clients</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-gold" />
          </div>
        ) : inquiries?.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No inquiries received yet.
            </CardContent>
          </Card>
        ) : inquiries?.map((inquiry) => (
          <Card key={inquiry._id} className="overflow-hidden border-l-4 border-l-gold">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-serif">{inquiry.subject}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  if(confirm("Permanently delete this inquiry?")) {
                    deleteMutation.mutate(inquiry._id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {inquiry.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {inquiry.phone}
                </div>
                <div className="flex items-center gap-1 font-medium">
                   {inquiry.name}
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <Calendar className="h-3 w-3" /> {new Date(inquiry.created_at).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md text-onyx whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
