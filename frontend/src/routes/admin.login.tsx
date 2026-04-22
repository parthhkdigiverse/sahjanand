import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        authService.setToken(data.access_token);
        toast.success("Welcome back, Admin");
        navigate({ to: "/admin" });
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-onyx">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1573408339371-2ed3644fcf6e?q=80&w=2670&auto=format&fit=crop" 
          alt="Luxury background" 
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-onyx via-onyx/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 animate-fade-up">
        <div className="text-center mb-12">
          <div className="inline-block p-4 mb-4">
            <span className="font-serif text-5xl tracking-[0.4em] text-gold block mb-2">MAISON</span>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.8em] text-ivory/40 mt-4 block">Atelier Management</span>
          </div>
        </div>

        <div className="glass-dark p-12 rounded-2xl shadow-luxe border border-white/5 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-ivory font-serif text-2xl tracking-wide">Secure Access</h2>
            <p className="text-ivory/40 text-sm font-light uppercase tracking-widest">Entry portal for authorized personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-ivory/60 text-[10px] uppercase tracking-widest ml-1">Identifier</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Admin ID" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="bg-white/5 border-white/10 text-ivory placeholder:text-ivory/10 h-14 rounded-lg focus-visible:ring-gold/50 focus-visible:border-gold/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-ivory/60 text-[10px] uppercase tracking-widest ml-1">Access Key</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-white/5 border-white/10 text-ivory placeholder:text-ivory/10 h-14 rounded-lg focus-visible:ring-gold/50 focus-visible:border-gold/50 transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-gold text-onyx hover:bg-gold-soft transition-all duration-500 rounded-lg font-medium tracking-widest uppercase text-xs shadow-luxe group overflow-hidden relative"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
              <span className="relative z-10">{isLoading ? "Validating..." : "Enter Workspace"}</span>
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-ivory/20 text-[10px] uppercase tracking-[0.3em]">© 2026 Maison Aurum — Confidential System</p>
        </div>
      </div>
    </div>
  );
}
