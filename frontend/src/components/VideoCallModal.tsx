import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitContact } from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoCallModal({ isOpen, onClose }: VideoCallModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());

  const mutation = useMutation({
    mutationFn: (data: any) => submitContact(data),
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setStep(1);
        setFormData({ firstName: "", lastName: "", phone: "" });
        setSelectedTime(null);
      }, 4000);
    },
  });

  const timeSlots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", 
    "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", 
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", 
    "06:30 PM", "07:00 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    mutation.mutate({
      name: `${formData.firstName} ${formData.lastName}`,
      email: "video.call@request.com", // Placeholder since form doesn't ask
      phone: formData.phone,
      preferred_date: `${format(selectedDate, "PPP")} at ${selectedTime}`,
      subject: "Video Consultation Request",
      message: "Customer requested a live video shopping session.",
      type: "VIDEO_CALL",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-onyx/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-ivory rounded-[2.5rem] shadow-luxe overflow-hidden border border-gold/10"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-onyx/5 text-onyx/40 hover:text-gold transition-colors z-20"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="p-20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-10"
            >
              <CheckCircle2 className="text-gold" size={48} />
            </motion.div>
            <h2 className="font-serif text-5xl mb-6 text-onyx">Request Confirmed</h2>
            <p className="text-onyx/60 text-lg">Our personal shopper will contact you shortly.</p>
          </div>
        ) : (
          <div className="p-10 md:p-16">
            <div className="text-center mb-16">
              <h3 className="font-['Great_Vibes'] text-[#DDAFAF] text-6xl mb-0 opacity-80 leading-none">Jewellery</h3>
              <h2 className="font-serif text-4xl md:text-6xl text-onyx font-bold tracking-tight">
                Shopping, Live & Personal
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <fieldset className="border border-onyx/10 rounded-full px-6 h-12 flex items-center focus-within:border-gold transition-all">
                  <legend className="px-2 text-[8px] font-bold uppercase tracking-widest text-onyx/30 transition-colors">
                    First Name
                  </legend>
                  <input
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full text-xs outline-none bg-transparent"
                    placeholder="First Name"
                  />
                </fieldset>

                <fieldset className="border border-onyx/10 rounded-full px-6 h-12 flex items-center focus-within:border-gold transition-all">
                  <legend className="px-2 text-[8px] font-bold uppercase tracking-widest text-onyx/30 transition-colors">
                    Last Name
                  </legend>
                  <input
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full text-xs outline-none bg-transparent"
                    placeholder="Last Name"
                  />
                </fieldset>

                <fieldset className="border border-onyx/10 rounded-full px-4 h-12 flex items-center focus-within:border-gold transition-all">
                  <legend className="px-2 text-[8px] font-bold uppercase tracking-widest text-onyx/30 transition-colors">
                    Mobile Number
                  </legend>
                  <div className="flex items-center w-full">
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 text-[10px] outline-none bg-transparent ml-1"
                      placeholder="Mobile Number"
                    />
                  </div>
                </fieldset>
              </div>

              <div className="relative">
                <fieldset className={`border border-onyx/10 rounded-full h-12 flex items-center transition-all ${isPopoverOpen ? 'border-gold' : ''}`}>
                  <legend className={`px-2 text-[8px] font-bold uppercase tracking-widest transition-colors ${isPopoverOpen ? 'text-gold' : 'text-onyx/30'}`}>
                    Date & Time of Virtual Call
                  </legend>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className="w-full px-6 text-[10px] text-left flex items-center justify-between bg-transparent outline-none">
                        <span className={selectedDate && selectedTime ? "text-onyx" : "text-onyx/20"}>
                          {selectedDate && selectedTime 
                            ? `${format(selectedDate, "PPP")} at ${selectedTime}`
                            : "Date & Time of Virtual Call"}
                        </span>
                        <CalendarIcon size={16} className="text-onyx/20" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="p-0 rounded-[1.5rem] overflow-hidden border border-onyx/5 shadow-2xl z-[120] w-[500px]" 
                      align="start" 
                      sideOffset={10}
                    >
                      <div className="flex flex-col bg-white">
                        <div className="flex">
                          {/* Calendar Box */}
                          <div className="flex-1 p-5 border-r border-onyx/5">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              month={visibleMonth}
                              onMonthChange={setVisibleMonth}
                              fixedWeeks
                              showOutsideDays={false}
                              className="p-0"
                              classNames={{
                                month_caption: "flex items-center justify-between mb-0 px-1 pb-4",
                                caption_label: "hidden", 
                                nav: "flex items-center gap-2",
                                button_previous: "h-7 w-7 flex items-center justify-center text-onyx/20 hover:text-gold transition-colors",
                                button_next: "h-7 w-7 flex items-center justify-center text-onyx/20 hover:text-gold transition-colors",
                                head_cell: "text-[#B0A6A4] font-bold text-[9px] w-9 py-4 uppercase tracking-tight",
                                cell: "w-9 h-9 p-0 relative",
                                day: "w-9 h-9 p-0 text-[10px] font-medium rounded-full hover:bg-gold/5 transition-all",
                                selected: "bg-gold text-onyx hover:bg-gold hover:text-onyx rounded-lg",
                                today: "text-gold font-bold border-b-2 border-gold rounded-none",
                                outside: "opacity-20",
                              }}
                              components={{
                                CaptionLabel: () => (
                                  <div className="flex gap-2">
                                    <div className="px-3 py-1.5 rounded-lg border border-onyx/10 text-[10px] font-medium text-onyx/40 min-w-[60px] text-center">
                                      {format(visibleMonth, "MMMM")}
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg border border-onyx/10 text-[10px] font-medium text-onyx/40 min-w-[60px] text-center">
                                      {format(visibleMonth, "yyyy")}
                                    </div>
                                  </div>
                                )
                              }}
                            />
                            {/* Horizontal line below month/year selectors */}
                            <div className="h-px bg-onyx/5 w-full -mt-10 mb-10" />
                          </div>
                          {/* Time Box */}
                          <div className="w-44 p-5 flex flex-col bg-white">
                            {(() => {
                              const availableSlots = timeSlots.filter((time) => {
                                if (!selectedDate || !isToday(selectedDate)) return true;
                                const [timeStr, period] = time.split(" ");
                                let [hours, minutes] = timeStr.split(":").map(Number);
                                if (period === "PM" && hours !== 12) hours += 12;
                                if (period === "AM" && hours === 12) hours = 0;
                                const slotDate = new Date(selectedDate);
                                slotDate.setHours(hours, minutes, 0, 0);
                                return slotDate > new Date();
                              });

                              return (
                                <>
                                  <div className="mb-4">
                                    <h4 className="text-sm font-bold text-onyx tracking-tight">
                                      {selectedTime || (availableSlots.length > 0 ? availableSlots[0] : "Select Time")}
                                    </h4>
                                    <div className="h-px bg-onyx/5 w-full mt-3" />
                                  </div>
                                  
                                  <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 mb-2 max-h-[180px]">
                                    {availableSlots.map((time) => (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={`w-full text-left px-4 py-2 text-[10px] font-bold rounded-lg transition-all ${
                                          selectedTime === time
                                            ? "bg-gold text-onyx"
                                            : "text-onyx/60 hover:bg-gold/5"
                                        }`}
                                      >
                                        {time}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        
                        <div className="p-4 flex justify-end gap-3 bg-white border-t border-onyx/5">
                          <button 
                            type="button"
                            className="px-8 py-2.5 rounded-full text-[11px] font-bold border border-gold text-gold hover:bg-gold/5 transition-all"
                            onClick={() => setIsPopoverOpen(false)}
                          >
                            Cancel
                          </button>
                          <button 
                            type="button"
                            className="px-10 py-2.5 rounded-full text-[11px] font-bold bg-gold text-onyx hover:bg-gold-deep transition-all"
                            onClick={() => setIsPopoverOpen(false)}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </fieldset>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending || !selectedDate || !selectedTime}
                  className="px-20 h-12 rounded-full bg-gold text-onyx hover:bg-gold-deep transition-all duration-500 font-bold uppercase tracking-widest text-[10px] disabled:opacity-50 shadow-lg shadow-gold/10"
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
