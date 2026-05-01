import { useState, useRef } from "react";
import { Loader2, Plus, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, getImageUrl } from "@/lib/api";
import { authenticatedFetch } from "@/services/auth";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className = "aspect-video" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await authenticatedFetch(`${API_BASE}/uploads/`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
        const imageUrl = result.urls[0];
        onChange(imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.click()}
      className={`relative rounded-2xl overflow-hidden border-2 border-dashed border-gold/20 group cursor-pointer hover:border-gold transition-all duration-700 bg-ivory/5 ${className}`}
    >
      {value ? (
        <>
          <img src={getImageUrl(value)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Uploaded" />
          <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
            <Camera className="h-8 w-8 text-gold mb-2" />
            <span className="text-white text-[10px] uppercase tracking-widest">Replace Image</span>
          </div>
        </>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-onyx/20">
          <Plus className="h-10 w-10 mb-2" />
          <span className="text-xs">Upload Image</span>
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-md">
          <Loader2 className="animate-spin h-8 w-8 text-gold" />
        </div>
      )}
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} 
      />
    </div>
  );
}
