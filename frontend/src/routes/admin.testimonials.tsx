import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, Quote, Play } from "lucide-react";
import { authenticatedFetch } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonials,
});

type Testimonial = {
  _id: string;
  image: string;
  name: string;
  quote: string;
  video_url?: string;
};

function AdminTestimonials() {
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => fetch("http://localhost:8001/api/testimonials/").then(res => res.json())
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedFetch(`http://localhost:8001/api/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial removed");
    },
    onError: () => toast.error("Error deleting testimonial")
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-onyx">Testimonials</h1>
        <p className="text-muted-foreground mt-1">Review and manage client testimonials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-gold" />
          </div>
        ) : testimonials?.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-10 text-center text-muted-foreground">
              No testimonials available.
            </CardContent>
          </Card>
        ) : testimonials?.map((testimonial) => (
          <Card key={testimonial._id} className="overflow-hidden flex flex-col">
            <div className="relative h-48 bg-gray-100">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
              {testimonial.video_url && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="text-white h-12 w-12 opacity-80" />
                </div>
              )}
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-serif">{testimonial.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 -mr-2"
                onClick={() => {
                  if(confirm("Permanently delete this testimonial?")) {
                    deleteMutation.mutate(testimonial._id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex gap-2 items-start text-muted-foreground italic bg-gray-50 p-4 rounded-md h-full">
                <Quote className="h-4 w-4 text-gold shrink-0 mt-1" />
                <p className="text-sm">"{testimonial.quote}"</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
