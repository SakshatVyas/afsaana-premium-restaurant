"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, Users, MessageSquare, CheckCircle, ArrowLeft } from "lucide-react";

type BookingData = {
  ref: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  specialRequest: string;
  status: string;
};

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequest: "",
  });
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "conflict">("idle");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedBooking(data.booking);
        setStatus("success");
        setFormData({ name: "", phone: "", date: "", time: "", guests: "2", specialRequest: "" });
      } else if (res.status === 409) {
        // Time slot conflict!
        setStatus("conflict");
        setErrorMessage(data.error || "This time slot is already booked.");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please call us directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again or call 07095000024.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-secondary-bg flex items-center justify-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
        
        {/* Left Side - Info */}
        <div className="flex flex-col justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[0.3em] text-xs uppercase font-medium mb-4 block"
          >
            Join Us
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-8"
          >
            Reserve Your <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Table</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 font-light text-lg mb-12 max-w-md leading-relaxed"
          >
            Experience a culinary journey like no other. We recommend booking your table at least 24 hours in advance to guarantee availability.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 border-l-2 border-gold/30 pl-6"
          >
            <div>
              <h4 className="text-white font-serif text-lg mb-1">Dress Code</h4>
              <p className="text-white/50 font-light text-sm">Smart Elegant. Gentlemen are requested to wear full-length trousers and closed shoes.</p>
            </div>
            <div>
              <h4 className="text-white font-serif text-lg mb-1">Cancellation Policy</h4>
              <p className="text-white/50 font-light text-sm">Please let us know at least 4 hours ahead if you need to cancel or modify your reservation.</p>
            </div>
            <div>
              <h4 className="text-white font-serif text-lg mb-1">Restaurant Hours</h4>
              <p className="text-white/50 font-light text-sm">Monday – Sunday: 11:00 AM – 11:00 PM</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form or Confirmation */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-white/5 p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {status === "success" && confirmedBooking ? (
              /* ===== BOOKING CONFIRMED SCREEN ===== */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col items-center justify-center text-center py-8 relative z-10"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mb-8"
                >
                  <CheckCircle className="text-gold w-20 h-20 mx-auto" strokeWidth={1} />
                </motion.div>
                
                <motion.h3 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="font-serif text-3xl text-white mb-2">Table Reserved</motion.h3>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/50 font-light text-sm mb-8">Your experience awaits</motion.p>
                
                {/* Booking Reference */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full border border-gold/30 bg-gold/5 p-5 mb-6">
                  <p className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-1">Booking Reference</p>
                  <p className="text-gold text-2xl font-mono font-bold tracking-widest">{confirmedBooking.ref}</p>
                  <p className="text-white/40 text-xs mt-2">Save this number for any changes</p>
                </motion.div>

                {/* Booking Details Summary */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="w-full text-left space-y-3 mb-8">
                  {[
                    { label: "Name", value: confirmedBooking.name },
                    { label: "Date", value: confirmedBooking.date },
                    { label: "Time", value: confirmedBooking.time },
                    { label: "Guests", value: `${confirmedBooking.guests} Guest(s)` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-white/40 text-xs uppercase tracking-widest">{item.label}</span>
                      <span className="text-white text-sm font-light">{item.value}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="w-full border border-gold/20 bg-gold/5 p-4 mb-8">
                  <p className="text-white/60 text-xs text-center leading-relaxed">
                    📞 Our team will call you at <span className="text-gold">{confirmedBooking.phone}</span> within <span className="text-gold">2 hours</span> to confirm your reservation.
                  </p>
                </motion.div>

                <button
                  onClick={() => { setStatus("idle"); setConfirmedBooking(null); }}
                  className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-xs uppercase tracking-widest"
                >
                  <ArrowLeft size={12} /> Make Another Booking
                </button>
              </motion.div>
            ) : (
              /* ===== BOOKING FORM ===== */
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                      <User size={14} className="text-gold" /> Name
                    </label>
                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 transition-colors font-light" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                      <Phone size={14} className="text-gold" /> Phone
                    </label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 transition-colors font-light" placeholder="+91 00000 00000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                      <Calendar size={14} className="text-gold" /> Date
                    </label>
                    <input 
                      required 
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange} 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 transition-colors font-light [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                      <Clock size={14} className="text-gold" /> Time
                    </label>
                    <select 
                      required
                      name="time" 
                      value={formData.time} 
                      onChange={handleChange} 
                      className="w-full bg-black border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 transition-colors font-light appearance-none"
                    >
                      <option value="" disabled>Select a time</option>
                      {["11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                    <Users size={14} className="text-gold" /> Guests
                  </label>
                  <select name="guests" value={formData.guests} onChange={handleChange} className="w-full bg-black border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 transition-colors font-light appearance-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                    <MessageSquare size={14} className="text-gold" /> Special Request (Optional)
                  </label>
                  <textarea name="specialRequest" value={formData.specialRequest} onChange={handleChange} rows={3} className="w-full bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 transition-colors font-light resize-none" placeholder="Allergies, anniversaries, special viewing..."></textarea>
                </div>

                {(status === "error" || status === "conflict") && (
                  <div className={`border p-4 text-sm font-light ${
                    status === "conflict"
                      ? "border-amber-500/40 bg-amber-500/5 text-amber-300"
                      : "border-red-500/30 bg-red-500/5 text-red-400"
                  }`}>
                    {status === "conflict" && (
                      <p className="font-semibold mb-1">⚠️ Time Slot Fully Booked</p>
                    )}
                    {errorMessage}
                    {status === "conflict" && (
                      <p className="mt-2 text-xs opacity-70">Please select a different time from the dropdown above.</p>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full py-4 mt-4 bg-gold text-black uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : "Book Table"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        
      </div>
    </div>
  );
}
