"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, Calendar as CalendarIcon, Clock, Lock, Eye, EyeOff, X, AlertTriangle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PASSWORD = "afsaana2026";

type Booking = {
  ref: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  specialRequest: string;
  status: string;
  createdAt: string;
  cancelledAt?: string;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "cancelled">("all");

  // Confirmation modal state
  const [confirmBooking, setConfirmBooking] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Batch action state
  const [selectedRefs, setSelectedRefs] = useState<string[]>([]);
  const [batchCancelling, setBatchCancelling] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`/api/reservations?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data.bookings) ? data.bookings : (Array.isArray(data) ? data : []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  const handleCancel = async () => {
    if (!confirmBooking) return;
    setCancelling(true);
    setCancelError("");

    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: confirmBooking.ref }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Refresh booking list and clear selection if it was selected
        fetchBookings();
        setSelectedRefs(prev => prev.filter(r => r !== confirmBooking.ref));
        setConfirmBooking(null);

        // Open WhatsApp with pre-filled cancellation message
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        }
      } else {
        setCancelError(data.error || "Failed to cancel booking.");
      }
    } catch {
      setCancelError("Network error. Try again.");
    } finally {
      setCancelling(false);
    }
  };

  // ===== BATCH CANCEL =====
  const handleBatchCancel = async () => {
    if (selectedRefs.length === 0) return;
    
    // Quick confirmation
    if (!window.confirm(`Are you sure you want to cancel these ${selectedRefs.length} bookings?`)) return;

    setBatchCancelling(true);
    let successCount = 0;

    for (const ref of selectedRefs) {
      try {
        const res = await fetch("/api/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ref }),
        });
        if (res.ok) successCount++;
      } catch (err) {
        console.error("Batch cancel error for ref:", ref);
      }
    }

    setBatchCancelling(false);
    setSelectedRefs([]);
    fetchBookings();
    alert(`Successfully cancelled ${successCount} out of ${selectedRefs.length} selected bookings.`);
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all currently visible ACTIVE bookings
      const activeRefs = filteredBookings.filter(b => b.status !== 'cancelled').map(b => b.ref);
      setSelectedRefs(activeRefs);
    } else {
      setSelectedRefs([]);
    }
  };

  const toggleSelect = (ref: string) => {
    setSelectedRefs(prev => 
      prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref]
    );
  };
  
  const today = new Date().toISOString().split("T")[0];

  const filteredBookings = bookings
    .slice()
    .reverse()
    .filter((b) => {
      if (filter === "today") return b.date === today && b.status !== "cancelled";
      if (filter === "upcoming") return b.date >= today && b.status !== "cancelled";
      if (filter === "cancelled") return b.status === "cancelled";
      return true; // "all"
    });

  const todayBookings = bookings.filter((b) => b.date === today && b.status !== "cancelled");
  const totalGuests = todayBookings.reduce((acc, b) => acc + Number(b.guests || 0), 0);
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  // ===== PASSWORD GATE =====
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-12">
            <Lock className="text-gold mx-auto mb-4" size={32} strokeWidth={1} />
            <h1 className="font-serif text-4xl text-white mb-2">
              Afsaana <span className="italic text-gold">Admin</span>
            </h1>
            <p className="text-white/40 text-sm tracking-widest uppercase">Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0A0A0C] border border-white/5 p-10 space-y-6">
            <div className="space-y-2 relative">
              <label className="text-xs uppercase tracking-widest text-white/50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-gold py-2 pr-10 transition-colors font-light"
                  placeholder="Enter admin password"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-2 text-white/30 hover:text-gold transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <p className="text-red-400 text-xs mt-2">{passwordError}</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-gold text-black uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors duration-300">
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ===== MAIN DASHBOARD =====
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif mb-1">Afsaana <span className="text-gold italic">Dashboard</span></h1>
            <p className="text-white/40 font-light text-sm">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="mt-4 md:mt-0 text-xs text-white/30 hover:text-gold transition-colors uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-gold/40">
            Lock Dashboard
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Bookings", value: todayBookings.length, icon: CalendarIcon },
            { label: "Today's Guests", value: totalGuests, icon: Users },
            { label: "All Bookings", value: bookings.length, icon: TrendingUp },
            { label: "Cancelled", value: cancelledCount, icon: X, accent: true },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className={`bg-[#0A0A0C] border p-4 md:p-6 flex items-start justify-between group ${accent ? "border-red-500/10" : "border-white/5"}`}>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
                <h3 className={`text-3xl md:text-4xl font-serif ${accent && value > 0 ? "text-red-400" : "text-white"}`}>{value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent ? "bg-red-500/10 text-red-400" : "bg-gold/10 text-gold"}`}>
                <Icon size={18} />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs & Batch Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "today", "upcoming", "cancelled"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all border ${
                filter === f ? "bg-gold text-black border-gold" : "text-white/40 border-white/10 hover:border-white/30"
              }`}>
                {f === "all" ? "All" : f === "today" ? "Today" : f === "upcoming" ? "Upcoming" : "Cancelled"}
              </button>
            ))}
            <span className="ml-2 text-white/30 text-xs self-center">{filteredBookings.length} record{filteredBookings.length !== 1 ? "s" : ""}</span>
          </div>

          <AnimatePresence>
            {selectedRefs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2"
              >
                <span className="text-red-400 text-xs font-semibold">{selectedRefs.length} Selected</span>
                <button
                  onClick={handleBatchCancel}
                  disabled={batchCancelling}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs uppercase tracking-widest px-3 py-1 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {batchCancelling ? "Cancelling..." : "Cancel Selected"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookings Table */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-white/30">Loading...</div>
          ) : filteredBookings.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0A0A0C] border border-white/5 p-20 text-center">
              <CalendarIcon className="text-white/20 mx-auto mb-4" size={40} strokeWidth={1} />
              <p className="text-white/40 font-light">No bookings for this filter.</p>
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0C] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10">
                      <th className="p-3 md:p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          onChange={toggleSelectAll}
                          checked={
                            filteredBookings.filter(b => b.status !== 'cancelled').length > 0 && 
                            selectedRefs.length === filteredBookings.filter(b => b.status !== 'cancelled').length
                          }
                          className="w-4 h-4 accent-gold cursor-pointer"
                        />
                      </th>
                      {["Ref", "Guest", "Contact", "Date & Time", "Guests", "Note", "Status", "Action"].map(h => (
                        <th key={h} className="p-3 md:p-4 text-xs tracking-widest uppercase text-white/40 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.ref} className={`border-b border-white/5 transition-colors ${booking.status === "cancelled" ? "opacity-50" : "hover:bg-white/[0.02]"} ${selectedRefs.includes(booking.ref) ? "bg-gold/5" : ""}`}>
                        <td className="p-3 md:p-4 text-center">
                          {booking.status !== "cancelled" ? (
                            <input 
                              type="checkbox" 
                              checked={selectedRefs.includes(booking.ref)}
                              onChange={() => toggleSelect(booking.ref)}
                              className="w-4 h-4 accent-gold cursor-pointer"
                            />
                          ) : <span className="text-white/20">—</span>}
                        </td>
                        <td className="p-3 md:p-4 text-gold font-mono text-xs">{booking.ref}</td>
                        <td className="p-3 md:p-4 text-white font-serif text-sm">{booking.name}</td>
                        <td className="p-3 md:p-4 text-white/50 text-xs">{booking.phone}</td>
                        <td className="p-3 md:p-4 text-sm">
                          <div className="flex items-center gap-1 text-white text-xs"><CalendarIcon size={11} className="text-gold shrink-0" /> {booking.date}</div>
                          <div className="flex items-center gap-1 text-white/50 mt-1 text-xs"><Clock size={11} className="text-gold shrink-0" /> {booking.time}</div>
                        </td>
                        <td className="p-3 md:p-4 text-white text-sm">{booking.guests}</td>
                        <td className="p-3 md:p-4 text-white/30 text-xs max-w-[120px] truncate">{booking.specialRequest || "—"}</td>
                        <td className="p-3 md:p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                            booking.status === "cancelled"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-green-500/10 text-green-400 border border-green-500/20"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-3 md:p-4">
                          {booking.status !== "cancelled" ? (
                            <button
                              onClick={() => { setConfirmBooking(booking); setCancelError(""); }}
                              className="text-xs uppercase tracking-widest text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/60 px-3 py-1 transition-all"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const rawPhone = booking.phone.replace(/\D/g, "");
                                const phone = rawPhone.startsWith("91") ? rawPhone : `91${rawPhone}`;
                                const waMessage = encodeURIComponent(
                                  `Dear ${booking.name},\n\nWe regret to inform you that your table reservation at Afsaana by Scooters has been cancelled.\n\n` +
                                  `📅 Date: ${booking.date}\n` +
                                  `🕐 Time: ${booking.time}\n` +
                                  `👥 Guests: ${booking.guests}\n` +
                                  `🔖 Ref: ${booking.ref}\n\n` +
                                  `We sincerely apologise for any inconvenience caused. Please feel free to call us at 07095000024 to rebook or discuss further.\n\n` +
                                  `— Team Afsaana by Scooters`
                                );
                                window.open(`https://wa.me/${phone}?text=${waMessage}`, "_blank");
                              }}
                              className="text-xs flex items-center gap-1.5 uppercase tracking-widest text-green-400/60 hover:text-green-400 border border-green-500/20 hover:border-green-500/60 px-3 py-1 transition-all"
                              title="Message Customer on WhatsApp"
                            >
                              <MessageCircle size={12} /> Notify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== CANCEL CONFIRMATION MODAL ===== */}
      <AnimatePresence>
        {confirmBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setConfirmBooking(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0A0A0C] border border-red-500/20 p-8 max-w-md w-full"
            >
              {/* Modal header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-400" size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-white text-xl">Cancel Booking</h3>
                  <p className="text-white/40 text-xs">{confirmBooking.ref}</p>
                </div>
                <button onClick={() => setConfirmBooking(null)} className="ml-auto text-white/30 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Booking summary */}
              <div className="bg-black/40 p-4 mb-6 space-y-2 border border-white/5">
                {[
                  ["Guest", confirmBooking.name],
                  ["Phone", confirmBooking.phone],
                  ["Date", confirmBooking.date],
                  ["Time", confirmBooking.time],
                  ["Guests", `${confirmBooking.guests} person(s)`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-3 mb-6">
                <p className="text-amber-300 text-xs leading-relaxed">
                  ⚠️ After cancellation, WhatsApp will open automatically with a pre-filled message to <strong>{confirmBooking.phone}</strong>. Just tap <strong>Send</strong> to notify the customer.
                </p>
              </div>

              {cancelError && (
                <p className="text-red-400 text-sm mb-4">{cancelError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmBooking(null)}
                  className="flex-1 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-sm uppercase tracking-widest transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-500/80 hover:bg-red-500 text-white text-sm uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling...</>
                  ) : "Confirm Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
