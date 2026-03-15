"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: 'Welcome to Afsaana! How may I assist you with your reservation or dining experience today?' }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    // Mock bot response logic based on user prompt criteria
    setTimeout(() => {
      let botResponse = "I can help you with reservations, our signature menu, opening hours, or location details. For highly specific requests, please call our concierge directly at 07095000024.";
      
      const lower = userMsg.toLowerCase();
      
      if (lower.match(/\b(hi|hello|hey|greetings|morning|evening)\b/)) {
        botResponse = "Greetings! Welcome to Afsaana by Scooters. How can I make your experience today magnificent?";
      } 
      else if (lower.match(/\b(veg|vegetarian|plant|vegan)\b/)) {
        botResponse = "Yes! We offer an exquisite array of vegetarian delicacies including rich Paneer preparations, fragrant Veg Biryani, and seasonal farm-fresh platters.";
      } 
      else if (lower.match(/\b(non|chicken|meat|mutton|fish|lamb)\b/)) {
        botResponse = "Our non-vegetarian signature dishes are renowned! We highly recommend our slow-cooked Butter Chicken, perfectly charred Tandoori platters, and authentic Mutton Rogan Josh.";
      } 
      else if (lower.match(/\b(time|open|hours|when|close)\b/)) {
        botResponse = "We are open gracefully every day of the week from 11:00 AM to 11:00 PM.";
      } 
      else if (lower.match(/\b(location|where|address|map|place)\b/)) {
        botResponse = "You can find us in the heart of luxury at 8Q32+PR Bungal, Punjab, located just near the beautiful DLM Valley Resort.";
      } 
      else if (lower.match(/\b(reserve|book|table|reservation|seat)\b/)) {
        botResponse = "I would be delighted to assist! You can secure a table by clicking the 'Reserve Table' button at the top right of your screen, which will take you to our dedicated booking portal.";
      }
      else if (lower.match(/\b(menu|food|dishes|options|signature|eat)\b/)) {
        botResponse = "Our menu is a curated journey of premium North Indian and global fusion cuisine. You can view our full digital menu by clicking 'Explore Menu' or navigating to the Menu page.";
      }
      else if (lower.match(/\b(price|cost|expensive|cheap|bill)\b/)) {
        botResponse = "Afsaana offers a hyper-premium dining experience. While our ingredients and preparation are of the highest luxury standard, we ensure the experience provides exceptional value for the memories created.";
      }
      else if (lower.match(/\b(alcohol|drinks|bar|cocktails|wine|beer)\b/)) {
        botResponse = "We feature a masterfully curated bar with signature mocktails and premium beverages to perfectly complement our culinary offerings.";
      }
      else if (lower.match(/\b(parking|valet|park)\b/)) {
        botResponse = "Yes, we offer secure complimentary parking and dedicated valet services for your absolute convenience.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 1200);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-14 h-14 bg-gradient-to-r from-gold/90 to-gold rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(207,174,109,0.3)] hover:scale-110 transition-transform"
      >
        <MessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 lg:bottom-28 lg:right-10 z-[100] w-80 md:w-96 h-[500px] bg-secondary-bg border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-black p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-serif text-black font-bold">
                  A
                </div>
                <div>
                  <h3 className="text-white font-serif text-sm">Afsaana Concierge</h3>
                  <p className="text-white/40 text-xs">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-secondary-bg to-black hide-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gold text-black rounded-br-none' 
                        : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black border-t border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our menu..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                >
                  <Send size={14} className="ml-0.5 mt-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
