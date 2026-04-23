import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, KeyRound, User, Sparkles } from "lucide-react";

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
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        authService.setToken(data.access_token);
        toast.success("Login Successful");
        navigate({ to: "/admin" });
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      toast.error("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-onyx font-sans">
      {/* Cinematic High-End Background */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1573408339371-2ed3644fcf6e?q=80&w=2670&auto=format&fit=crop" 
          alt="Luxury background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-onyx to-onyx" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[100px]" />
      </motion.div>

      <div className="relative z-10 w-full max-w-xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-block relative">
            <span className="font-serif text-6xl tracking-[0.3em] text-gold text-shadow-gold block mb-2 uppercase">MAISON</span>
            <span className="text-[10px] uppercase tracking-[1em] text-ivory/30 mt-6 block">Admin Portal</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-10 relative overflow-hidden"
        >
          <div className="space-y-3 text-center relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gold/10 border border-gold/20">
                <ShieldCheck className="text-gold h-6 w-6" />
              </div>
            </div>
            <h2 className="text-ivory font-serif text-3xl tracking-wide">Sign In</h2>
            <p className="text-ivory/30 text-[10px] font-medium uppercase tracking-[0.3em]">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-ivory/40 text-[9px] uppercase tracking-[0.4em] ml-4">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="bg-white/[0.03] border-white/10 text-ivory placeholder:text-ivory/20 h-16 px-6 rounded-2xl focus-visible:ring-gold/30 transition-all duration-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-ivory/40 text-[9px] uppercase tracking-[0.4em] ml-4">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-white/[0.03] border-white/10 text-ivory placeholder:text-ivory/20 h-16 px-6 rounded-2xl focus-visible:ring-gold/30 transition-all duration-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 bg-gold text-onyx hover:bg-gold/90 transition-all duration-700 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-ivory/10 text-[9px] uppercase tracking-[0.5em]">© 2026 Maison Aurum</p>
        </div>
      </div>
    </div>
  );
}
