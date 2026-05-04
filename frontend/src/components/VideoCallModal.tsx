import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitContact } from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

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
        className="relative w-full max-w-3xl bg-onyx rounded-[2.5rem] shadow-luxe overflow-hidden border border-gold/20"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-ivory/5 text-ivory/40 hover:text-gold transition-colors z-20"
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
            <h2 className="font-serif text-5xl mb-6 text-ivory">Request Confirmed</h2>
            <p className="text-ivory/60 text-lg">Our personal shopper will contact you shortly.</p>
          </div>
        ) : (
          <div className="p-10 md:p-16">
            <div className="text-center mb-16">
              <h3 className="font-['Great_Vibes'] text-gold text-7xl mb-2 opacity-90 leading-none">Jewellery</h3>
              <h2 className="font-serif text-5xl md:text-7xl text-ivory font-bold tracking-tight">
                Shopping, Live & Personal
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <fieldset className="border border-ivory/30 rounded-full px-6 h-14 flex items-center focus-within:border-gold transition-all">
                  <legend className="px-2 text-[10px] font-bold uppercase tracking-widest text-gold transition-colors">
                    First Name
                  </legend>
                  <input
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full text-base outline-none bg-transparent text-ivory placeholder:text-ivory/60"
                    placeholder="First Name"
                  />
                </fieldset>

                <fieldset className="border border-ivory/30 rounded-full px-6 h-14 flex items-center focus-within:border-gold transition-all">
                  <legend className="px-2 text-[10px] font-bold uppercase tracking-widest text-gold transition-colors">
                    Last Name
                  </legend>
                  <input
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full text-base outline-none bg-transparent text-ivory placeholder:text-ivory/60"
                    placeholder="Last Name"
                  />
                </fieldset>

                <fieldset className="border border-ivory/30 rounded-full px-4 h-14 flex items-center focus-within:border-gold transition-all">
                  <legend className="px-2 text-[10px] font-bold uppercase tracking-widest text-gold transition-colors">
                    Mobile Number
                  </legend>
                  <div className="flex items-center w-full">
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 text-base outline-none bg-transparent ml-1 text-ivory placeholder:text-ivory/50"
                      placeholder="Mobile Number"
                    />
                  </div>
                </fieldset>
              </div>

              <div className="relative">
                <fieldset className={`border border-ivory/30 rounded-full h-14 flex items-center transition-all ${isPopoverOpen ? 'border-gold' : ''}`}>
                  <legend className={`px-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isPopoverOpen ? 'text-gold' : 'text-gold'}`}>
                    Date & Time of Virtual Call
                  </legend>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className="w-full px-6 text-sm text-left flex items-center justify-between bg-transparent outline-none">
                        <span className={selectedDate && selectedTime ? "text-ivory" : "text-ivory/50"}>
                          {selectedDate && selectedTime 
                            ? `${format(selectedDate, "PPP")} at ${selectedTime}`
                            : "Date & Time of Virtual Call"}
                        </span>
                        <CalendarIcon size={18} className="text-ivory/50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="p-0 rounded-[2.5rem] overflow-hidden border border-gold/20 shadow-2xl z-[120] w-[650px] bg-onyx" 
                      align="start" 
                      sideOffset={10}
                    >
                      <div className="flex bg-onyx min-h-[420px]">
                        {/* Left Side: Calendar */}
                        <div className="flex-1 p-8 border-r border-ivory/10">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            month={visibleMonth}
                            onMonthChange={setVisibleMonth}
                            fixedWeeks
                            showOutsideDays={false}
                            className="p-0 bg-transparent"
                            classNames={{
                              month: "space-y-6",
                              month_caption: "flex justify-between items-center mb-8 relative px-2",
                              caption_label: "flex items-center gap-3",
                              nav: "flex items-center gap-2",
                              button_previous: "h-9 w-9 flex items-center justify-center rounded-full border border-gold/20 text-ivory/60 hover:text-gold hover:bg-gold/10 transition-all",
                              button_next: "h-9 w-9 flex items-center justify-center rounded-full border border-gold/20 text-ivory/60 hover:text-gold hover:bg-gold/10 transition-all",
                              head_row: "flex w-full",
                              head_cell: "text-gold font-bold text-[11px] w-10 uppercase tracking-widest text-center",
                              row: "flex w-full mt-2",
                              cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                              day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gold/10 hover:text-gold rounded-full transition-all flex items-center justify-center text-ivory/80",
                              selected: "bg-gold !text-onyx hover:bg-gold-deep hover:!text-onyx focus:bg-gold focus:!text-onyx rounded-full font-bold",
                              today: "text-gold font-bold border-b-2 border-gold rounded-none",
                              outside: "text-ivory/20 opacity-50",
                              disabled: "text-ivory/10 opacity-50",
                            }}
                            components={{
                              CaptionLabel: () => (
                                <div className="flex gap-2">
                                  <div className="px-4 py-2 rounded-xl border border-gold/30 text-[11px] font-bold text-gold uppercase tracking-widest bg-gold/5 min-w-[85px] text-center">
                                    {format(visibleMonth, "MMMM")}
                                  </div>
                                  <div className="px-4 py-2 rounded-xl border border-gold/30 text-[11px] font-bold text-gold uppercase tracking-widest bg-gold/5 min-w-[70px] text-center">
                                    {format(visibleMonth, "yyyy")}
                                  </div>
                                </div>
                              )
                            }}
                          />
                        </div>

                        {/* Right Side: Custom Time Input */}
                        <div className="w-[240px] p-8 flex flex-col bg-onyx/50">
                          <div className="flex-1">
                            <h4 className="text-gold font-serif text-xl mb-1">Preferred Time</h4>
                            <p className="text-ivory/40 text-[10px] uppercase tracking-widest mb-6">Schedule your session</p>
                            
                            <div className="space-y-6">
                              <div className="relative">
                                <fieldset className="border border-ivory/20 rounded-2xl px-4 h-14 flex items-center focus-within:border-gold transition-all bg-onyx/30">
                                  <legend className="px-2 text-[9px] font-bold uppercase tracking-widest text-gold">Time</legend>
                                  <Clock className="text-gold/40 mr-3" size={16} />
                                  <input
                                    type="text"
                                    value={selectedTime || ""}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    placeholder="e.g. 11:30 AM"
                                    className="w-full text-sm outline-none bg-transparent text-ivory placeholder:text-ivory/20 font-medium"
                                  />
                                </fieldset>
                              </div>

                              <div>
                                <p className="text-[9px] font-bold text-gold uppercase tracking-widest mb-3 opacity-60">Common Slots</p>
                                <div className="grid grid-cols-1 gap-2">
                                  {["11:00 AM", "02:30 PM", "05:00 PM"].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => setSelectedTime(s)}
                                      className={`px-4 py-2.5 rounded-xl border text-[10px] font-bold transition-all text-center ${
                                        selectedTime === s 
                                          ? "bg-gold border-gold text-onyx shadow-lg shadow-gold/20" 
                                          : "border-ivory/10 text-ivory/60 hover:border-gold/50 hover:text-gold hover:bg-gold/5"
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 pt-6 border-t border-ivory/5">
                            <button 
                              type="button"
                              className="w-full py-3 rounded-full text-[10px] font-bold bg-gold text-onyx hover:bg-gold-deep transition-all uppercase tracking-widest shadow-lg shadow-gold/10"
                              onClick={() => setIsPopoverOpen(false)}
                            >
                              Confirm
                            </button>
                            <button 
                              type="button"
                              className="w-full py-3 rounded-full text-[10px] font-bold border border-ivory/20 text-ivory/40 hover:text-ivory/80 transition-all uppercase tracking-widest"
                              onClick={() => setIsPopoverOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
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
                  className="px-20 h-14 rounded-full bg-gold text-onyx hover:bg-gold-deep transition-all duration-500 font-bold uppercase tracking-widest text-xs disabled:opacity-50 shadow-lg shadow-gold/10"
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
