"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Calendar, Clock, Users, User, Phone, MapPin, ChevronRight, ShoppingBag, Info } from "lucide-react";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: Option[];
  cards?: Card[];
  isTyping?: boolean;
};

type Option = {
  label: string;
  action: string;
  icon?: React.ReactNode;
};

type Card = {
  title: string;
  desc: string;
  price: string;
};

// --- INITIAL STATE ---
const welcomeOptions: Option[] = [
  { label: "Book a Table", action: "book_table", icon: <Calendar className="w-4 h-4" /> },
  { label: "View Menu", action: "view_menu", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Order Food", action: "order_food", icon: <Send className="w-4 h-4" /> },
  { label: "Location", action: "location", icon: <MapPin className="w-4 h-4" /> },
  { label: "Restaurant Timings", action: "timings", icon: <Clock className="w-4 h-4" /> },
  { label: "Talk to Support", action: "support", icon: <Phone className="w-4 h-4" /> },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Flow State
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Initialization
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            sender: "bot",
            text: "Hello 👋\nWelcome to Afsaana by Scooters.\n\nHow can I assist you today?",
            options: welcomeOptions
          }
        ]);
      }, 500);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addBotMessage = (text: string, options?: Option[], cards?: Card[], delay: number = 600) => {
    // Show typing indicator
    const typingId = Date.now().toString() + "_typing";
    setMessages(prev => [...prev, { id: typingId, sender: "bot", text: "", isTyping: true }]);
    
    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== typingId);
        return [...filtered, {
          id: Date.now().toString(),
          sender: "bot",
          text,
          options,
          cards
        }];
      });
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "user",
      text
    }]);
  };

  const handleOptionClick = (option: Option) => {
    addUserMessage(option.label);

    switch (option.action) {
      // -----------------------------
      // 1. MAIN MENU
      // -----------------------------
      case "main_menu":
        setCurrentFlow(null);
        setFormData({});
        addBotMessage("How else can I assist you?", welcomeOptions);
        break;

      // -----------------------------
      // 2. BOOK A TABLE FLOW
      // -----------------------------
      case "book_table":
        setCurrentFlow("booking_step_1");
        setFormData({});
        addBotMessage("Great! Please select a date 📅", [
          { label: "Today", action: "booking_date_today" },
          { label: "Tomorrow", action: "booking_date_tomorrow" },
          { label: "Other Date...", action: "booking_date_other" }
        ]);
        break;
      
      case "booking_date_today":
      case "booking_date_tomorrow":
      case "booking_date_other":
        setFormData({ ...formData, date: option.label });
        setCurrentFlow("booking_step_2");
        addBotMessage("How many guests? 👥", [
          { label: "2 Guests", action: "booking_guests_2" },
          { label: "4 Guests", action: "booking_guests_4" },
          { label: "6+ Guests", action: "booking_guests_6" }
        ]);
        break;

      case "booking_guests_2":
      case "booking_guests_4":
      case "booking_guests_6":
        setFormData({ ...formData, guests: option.label });
        setCurrentFlow("booking_step_3");
        addBotMessage("Preferred time? ⏰", [
          { label: "7:00 PM", action: "booking_time_7" },
          { label: "8:00 PM", action: "booking_time_8" },
          { label: "9:00 PM", action: "booking_time_9" }
        ]);
        break;

      case "booking_time_7":
      case "booking_time_8":
      case "booking_time_9":
        setFormData({ ...formData, time: option.label });
        setCurrentFlow("booking_step_4");
        // For the demo chatbot, we simulate asking for name & phone via text input
        addBotMessage("Please type your Name below to continue.");
        break;

      // -----------------------------
      // 3. MENU FLOW
      // -----------------------------
      case "view_menu":
        addBotMessage("Here are our popular signature dishes 🍽", [], [
          { title: "Butter Chicken", desc: "Rich creamy tomato gravy", price: "₹420" },
          { title: "Afsaana Special Biryani", desc: "Aromatic basmati with tender meat", price: "₹550" },
          { title: "Tandoori Platter", desc: "Assorted smoky kebabs", price: "₹680" },
          { title: "Paneer Lababdar", desc: "Cottage cheese in rich gravy", price: "₹380" }
        ]);
        setTimeout(() => {
          addBotMessage("Would you like to order something?", [
            { label: "Yes, Order Food", action: "order_food" },
            { label: "Back to Menu", action: "main_menu" }
          ]);
        }, 1500);
        break;

      case "order_item":
        addUserMessage(`Add ${option.label}`);
        addBotMessage(`Added ${option.label} to your Cart. What's next?`, [
          { label: "Checkout", action: "checkout" },
          { label: "Back to Menu", action: "main_menu" }
        ]);
        break;

      // -----------------------------
      // 4. ORDER FOOD FLOW
      // -----------------------------
      case "order_food":
        addBotMessage("Choose a category to browse:", [
          { label: "🍗 Non Veg", action: "order_cat_nonveg" },
          { label: "🥦 Veg", action: "order_cat_veg" },
          { label: "🍛 Biryani", action: "order_cat_biryani" },
          { label: "🥤 Drinks", action: "order_cat_drinks" }
        ]);
        break;
      
      case "order_cat_nonveg":
      case "order_cat_veg":
      case "order_cat_biryani":
      case "order_cat_drinks":
        addBotMessage("Great! What would you like from here?", [
          { label: "Add Dish #1", action: "order_item" },
          { label: "Add Dish #2", action: "order_item" }
        ]);
        break;

      case "checkout":
        addBotMessage("Your Order Total: ₹850\n\nPickup or Dine-in?", [
          { label: "Pickup", action: "checkout_confirm" },
          { label: "Dine-in", action: "checkout_confirm" }
        ]);
        break;
      
      case "checkout_confirm":
        addBotMessage("✅ Order Placed! We will prepare it shortly.", [
          { label: "Main Menu", action: "main_menu" }
        ]);
        break;

      // -----------------------------
      // 5. LOCATION, TIMINGS, SUPPORT
      // -----------------------------
      case "location":
        addBotMessage("📍 Afsaana by Scooters\n\nRoad near DLM Valley Resort\nDLM City Bungal\nPunjab 145001", [
          { label: "Open in Google Maps", action: "open_maps" },
          { label: "Main Menu", action: "main_menu" }
        ]);
        break;

      case "open_maps":
        window.open("https://maps.google.com/?q=DLM+Valley+Resort+Punjab", "_blank");
        addBotMessage("Opening Google Maps...", [{ label: "Main Menu", action: "main_menu" }]);
        break;

      case "timings":
        addBotMessage("🕒 Our Opening Hours\n\nMonday – Sunday\n11:00 AM – 11:00 PM", [
          { label: "Book a Table", action: "book_table" },
          { label: "Main Menu", action: "main_menu" }
        ]);
        break;

      case "support":
        addBotMessage("You can contact our team directly here:\n\n📞 07095000024", [
          { label: "Chat on WhatsApp", action: "whatsapp" },
          { label: "Main Menu", action: "main_menu" }
        ]);
        break;

      case "whatsapp":
        window.open("https://wa.me/917095000024", "_blank");
        addBotMessage("Opening WhatsApp...", [{ label: "Main Menu", action: "main_menu" }]);
        break;

      default:
        addBotMessage("I am still learning to handle that request.", [{ label: "Main Menu", action: "main_menu" }]);
        break;
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const text = inputText.trim();
    addUserMessage(text);
    setInputText("");

    // Minimal NLP / Flow handling for manual text input
    if (currentFlow === "booking_step_4") {
      setFormData({ ...formData, name: text });
      setCurrentFlow("booking_step_5");
      addBotMessage("Thank you, " + text + ". And your Phone Number? 📱");
    } 
    else if (currentFlow === "booking_step_5") {
      setFormData({ ...formData, phone: text });
      setCurrentFlow(null);
      // Simulate API Call for booking
      addBotMessage("Processing your reservation...", [], [], 500);
      
      setTimeout(() => {
        addBotMessage(
          `✅ Table booked successfully!\n\nName: ${formData.name}\nGuests: ${formData.guests}\nDate: ${formData.date}\nTime: ${formData.time}\n\nOur team will contact you shortly.`,
          [{ label: "Main Menu", action: "main_menu" }]
        );
      }, 2000);
    }
    else {
      // Basic fallback
      const lower = text.toLowerCase();
      if (lower.includes("book") || lower.includes("table") || lower.includes("reservation")) {
        handleOptionClick({ label: "Book a Table", action: "book_table" });
      } else if (lower.includes("menu") || lower.includes("food")) {
        handleOptionClick({ label: "View Menu", action: "view_menu" });
      } else if (lower.includes("time") || lower.includes("open") || lower.includes("hour")) {
        handleOptionClick({ label: "Restaurant Timings", action: "timings" });
      } else {
        addBotMessage("I can help you with bookings, menus, and orders.", [
          { label: "Show Options", action: "main_menu" }
        ]);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] sm:w-[380px] h-[500px] max-h-[80vh] bg-zinc-950 border border-gold/30 rounded-2xl shadow-[0_0_30px_rgba(207,174,109,0.15)] overflow-hidden flex flex-col mb-4 relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zinc-900 to-black p-4 border-b border-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black font-serif text-xl border border-gold/50 shadow-[0_0_10px_rgba(207,174,109,0.3)]">
                    A
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm tracking-wide">Afsaana Assistant 🤖</h3>
                  <p className="text-gold/70 text-xs">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                  
                  {/* Avatar for bot */}
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mr-2 shrink-0 mt-1">
                      <MessageSquare className="w-3 h-3 text-gold" />
                    </div>
                  )}

                  <div className={`max-w-[80%] flex flex-col gap-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    
                    {/* Message Bubble */}
                    {msg.isTyping ? (
                      <div className="bg-zinc-800/60 border border-white/5 text-white/70 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-fit">
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce delay-150"></span>
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce delay-300"></span>
                      </div>
                    ) : msg.text && (
                      <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-[13px] sm:text-sm ${
                        msg.sender === "user" 
                          ? "bg-gold text-black rounded-tr-sm font-medium" 
                          : "bg-zinc-800/80 border border-white/10 text-white/90 rounded-tl-sm"
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    {/* Cards (if any) */}
                    {msg.cards && (
                      <div className="flex gap-2 overflow-x-auto w-[250px] pb-2 snap-x hide-scrollbar">
                        {msg.cards.map((card, i) => (
                          <div key={i} className="min-w-[180px] bg-zinc-900 border border-gold/20 rounded-xl p-3 snap-center shrink-0">
                            <h4 className="text-white text-sm font-serif">{card.title}</h4>
                            <p className="text-white/50 text-[11px] mt-1 line-clamp-2">{card.desc}</p>
                            <p className="text-gold text-sm mt-2 font-medium">{card.price}</p>
                            <button 
                              onClick={() => handleOptionClick({ label: card.title, action: "order_item" })}
                              className="w-full mt-3 py-1.5 text-xs text-black bg-gold rounded-lg font-medium hover:bg-gold/90 transition"
                            >
                              Add to Order
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Options (if any) */}
                    {msg.options && (
                      <div className="flex flex-col gap-1.5 w-full mt-1">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(opt)}
                            className="bg-zinc-900 border border-gold/30 hover:bg-gold/10 text-gold hover:text-white px-3 py-2 rounded-xl text-xs sm:text-[13px] text-left transition-all duration-300 flex items-center gap-2 group"
                          >
                            {opt.icon && <span className="text-gold/70 group-hover:text-gold">{opt.icon}</span>}
                            <span className="flex-1">{opt.label}</span>
                            <ChevronRight className="w-3 h-3 text-gold/30 group-hover:text-gold" />
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendText} className="p-3 bg-zinc-950 border-t border-gold/20 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                disabled={currentFlow?.startsWith("booking_") && !currentFlow.includes("step_4") && !currentFlow.includes("step_5")}
                className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gold"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOGGLE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gold border border-white/20 text-black flex items-center justify-center shadow-[0_0_20px_rgba(207,174,109,0.3)] hover:shadow-[0_0_30px_rgba(207,174,109,0.5)] transition-all z-50 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-gold border-2 border-gold animate-ping opacity-20 group-hover:opacity-40 duration-1000"></span>
        )}
      </motion.button>
    </div>
  );
}
