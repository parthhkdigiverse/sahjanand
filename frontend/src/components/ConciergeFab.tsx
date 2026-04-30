import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Video, MessageCircle, X, Headset } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";
import { VideoCallModal } from "./VideoCallModal";

export function ConciergeFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const whatsappUrl = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=Greetings%2C%20I%20would%20like%20to%20inquire%20about%20your%20collection.`
    : "#";

  const actions = [
    {
      icon: <Video size={20} />,
      label: "Video Consultation",
      onClick: () => {
        setIsVideoModalOpen(true);
        setIsOpen(false);
      },
      color: "bg-onyx",
      textColor: "text-ivory",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Chat with Expert",
      href: settings?.chat_url || whatsappUrl,
      color: "bg-onyx",
      textColor: "text-ivory",
    },
    {
      icon: <MessageCircle size={20} />,
      label: "WhatsApp",
      href: whatsappUrl,
      color: "bg-emerald-600",
      textColor: "text-white",
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="flex flex-col items-end gap-3 mb-2"
          >
            {actions.map((action, index) => (
              <motion.a
                key={action.label}
                onClick={action.onClick}
                href={action.href}
                target={action.href ? "_blank" : undefined}
                rel={action.href ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-luxe border border-gold/10 ${action.color} ${action.textColor} hover:scale-105 transition-transform group cursor-pointer`}
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                  {action.label}
                </span>
                <div className="flex-none">
                  {action.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full flex items-center justify-center shadow-luxe transition-all duration-500 hover:scale-110 active:scale-95 group relative ${
          isOpen ? "bg-white text-gold border border-gold/20" : "bg-gold text-onyx"
        }`}
      >
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-20 bg-white border border-gold/20 px-3 py-1.5 rounded-lg shadow-luxe whitespace-nowrap hidden md:block"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-gold">How may we help you?</p>
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border-r border-t border-gold/20 rotate-45" />
          </motion.div>
        )}

        <div className="relative">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Headset size={28} />
          </motion.div>
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
            className="flex items-center justify-center"
          >
            <X size={28} />
          </motion.div>
        </div>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-onyx opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-onyx"></span>
          </span>
        )}
      </button>

      <VideoCallModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </div>
  );
}
