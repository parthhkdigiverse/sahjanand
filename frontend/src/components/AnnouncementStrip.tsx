import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";

export function AnnouncementStrip() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  if (!settings?.show_announcement || !settings?.announcement_text) {
    return null;
  }

  // Split messages by pipe symbol and filter out empty strings
  const messages = settings.announcement_text
    .split("|")
    .map((m) => m.trim())
    .filter(Boolean);

  if (messages.length === 0) return null;

  return (
    <div className="w-full bg-onyx text-gold-soft py-2 overflow-hidden border-b border-gold/10 relative z-[60]">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {/* We repeat the messages twice for seamless looping */}
        {[...messages, ...messages].map((msg, idx) => (
          <span 
            key={idx} 
            className="inline-flex items-center mx-8 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mr-4 shrink-0" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
