"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-32 px-6 flex items-center justify-center overflow-hidden bg-transparent">
      {/* Background is now global in page.tsx */}
      
      {/* V12: Increased overlay for legibility */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />

      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-16 items-start">
        <div className="text-left">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase mb-6 block">The Terminal</span>
          <h2 className="leading-tight text-white mb-8">
            Ready to scale your <span className="font-serif italic text-white">digital architecture</span>?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Our strategic methodology and precision engineering deliver world-class web experiences at scale.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heavy-glass p-10 rounded-[20px] shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-white/60 uppercase pl-1">Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-full p-4 text-white placeholder-white/40 focus:border-white/60 focus:outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-white/60 uppercase pl-1">Email</label>
              <input
                required
                type="email"
                placeholder="john@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-full p-4 text-white placeholder-white/40 focus:border-white/60 focus:outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-white/60 uppercase pl-1">Message</label>
              <textarea
                required
                rows={3}
                placeholder="Project brief..."
                className="w-full bg-white/5 border border-white/10 rounded-[20px] p-4 text-white placeholder-white/40 focus:border-white/60 focus:outline-none transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              disabled={status === "loading"}
              className="btn-fancy w-full py-5 bg-[#f8f8f8] text-[#171717] rounded-full text-base font-medium flex items-center justify-center gap-3 hover:bg-white active:scale-95 transition-all disabled:opacity-50 shadow-xl"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : status === "success" ? (
                <>Success! <CheckCircle2 className="w-5 h-5" /></>
              ) : (
                <>Transmit <Send className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
