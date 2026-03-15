"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";

// Mock Menu Data
const menuCategories = [
  {
    name: "Starters",
    items: [
      { id: "s1", name: "Tandoori Soya Chaap", price: 350, description: "Charcoal grilled soya chunks marinated in yogurt and spices. (V)", image: "/images/unnamed-2.jpg" },
      { id: "s2", name: "Murgh Malai Tikka", price: 450, description: "Creamy, mouth-melting chicken kebabs seasoned with cardamom.", image: "/images/unnamed.jpg" }
    ]
  },
  {
    name: "Mains",
    items: [
      { id: "m1", name: "Afsaana Special Biryani", price: 850, description: "Aromatic basmati rice cooked with saffron, exotic spices.", image: "/images/unnamed.jpg" },
      { id: "m2", name: "Butter Chicken", price: 650, description: "Rich tomato gravy with tender roasted chicken.", image: "/images/2025-07-07.jpg" },
      { id: "m3", name: "Paneer Lababdar", price: 550, description: "Cottage cheese in a luscious spiced cashew-tomato reduction. (V)", image: "/images/2025-07-07.jpg" }
    ]
  },
  {
    name: "Breads",
    items: [
      { id: "b1", name: "Garlic Naan", price: 120, description: "Leavened flatbread brushed with garlic butter.", image: null },
      { id: "b2", name: "Laccha Paratha", price: 150, description: "Flaky, multi-layered whole wheat bread.", image: null }
    ]
  }
];

export default function MenuPage() {
  const [cart, setCart] = useState<{id: string, name: string, price: number, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  const addToCart = (item: {id: string, name: string, price: number}) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-gold tracking-[0.3em] text-xs uppercase font-medium mb-2 block"
            >
              Order Online
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif text-white leading-tight"
            >
              Our <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Menu</span>
            </motion.h1>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="group flex items-center gap-3 bg-secondary-bg border border-white/10 hover:border-gold/50 px-6 py-3 transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="text-gold group-hover:scale-110 transition-transform" size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-white text-sm tracking-widest uppercase hidden md:inline">Cart</span>
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-20">
          {menuCategories.map((category, catIndex) => (
            <div key={category.name}>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-3xl font-serif text-white mb-8 flex items-center gap-4"
              >
                {category.name}
                <div className="h-[1px] bg-white/10 flex-1"></div>
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIndex) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: itemIndex * 0.1 }} viewport={{ once: true }}
                    className="flex flex-col bg-secondary-bg border border-white/5 group hover:border-gold/30 transition-colors"
                  >
                    {item.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif text-white">{item.name}</h3>
                        <span className="text-gold font-sans font-semibold">₹{item.price}</span>
                      </div>
                      <p className="text-white/50 font-light text-sm mb-6 flex-1">{item.description}</p>
                      
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full py-3 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold uppercase tracking-widest text-xs font-semibold transition-all duration-300"
                      >
                        Add to Order
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-secondary-bg border-l border-white/10 z-[120] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black">
                <h2 className="text-xl font-serif text-white flex items-center gap-3">
                  <ShoppingBag className="text-gold" size={20} /> Your Order
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex p-4 border-b border-white/5 bg-black/50">
                <button 
                  onClick={() => setOrderType("delivery")}
                  className={`flex-1 py-2 text-sm uppercase tracking-widest font-semibold transition-colors ${orderType === 'delivery' ? 'text-gold border-b-2 border-gold' : 'text-white/40 border-b-2 border-transparent hover:text-white/80'}`}
                >
                  Delivery
                </button>
                <button 
                  onClick={() => setOrderType("pickup")}
                  className={`flex-1 py-2 text-sm uppercase tracking-widest font-semibold transition-colors ${orderType === 'pickup' ? 'text-gold border-b-2 border-gold' : 'text-white/40 border-b-2 border-transparent hover:text-white/80'}`}
                >
                  Pickup
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                    <ShoppingBag size={48} className="text-white/20" />
                    <p className="text-white font-light">Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center pb-4 border-b border-white/5 group">
                      <div>
                        <h4 className="text-white font-serif">{item.name}</h4>
                        <div className="text-gold text-sm">₹{item.price}</div>
                      </div>
                      <div className="flex items-center gap-4 bg-black border border-white/10 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-white/60 hover:text-white"><Minus size={14} /></button>
                        <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-white/60 hover:text-white"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-black border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-white/70 font-light">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-white/70 font-light pb-4 border-b border-white/5">
                    <span>Taxes & Fees</span>
                    <span>₹{Math.round(cartTotal * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-white text-lg font-serif pt-2">
                    <span>Total</span>
                    <span className="text-gold">₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
                  </div>
                  
                  <button className="w-full py-4 mt-6 bg-gradient-to-r from-gold/90 to-gold text-black uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(207,174,109,0.2)] hover:shadow-[0_0_30px_rgba(207,174,109,0.4)] transition-all">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
