"use client";

import React, { useState, useEffect } from "react";
import { MoveRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Expertise", href: "#expertise" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 w-full z-50 py-4 px-8 md:px-12 flex justify-between items-center transition-all duration-700 ease-in-out",
          isScrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/[0.03]" : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="flex items-center">
          <a href="/" className="text-white text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity flex items-center">
            STRATA<span className="text-white/50 text-[10px] align-top ml-0.5">®</span>
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white/70 text-sm font-medium tracking-wide hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all"
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" className="btn-fancy flex items-center gap-2 px-6 py-2.5 bg-[#f8f8f8] text-[#171717] rounded-full text-sm font-medium hover:bg-white no-underline">
            Get Started
            <MoveRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-white text-2xl font-bold tracking-tighter">STRATA</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/60 p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-light text-white hover:text-white/60 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 flex items-center justify-between w-full p-6 bg-white text-black rounded-full text-lg font-medium group no-underline"
              >
                Start Project
                <MoveRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>

            <div className="mt-auto border-t border-white/10 pt-8 flex gap-6 text-white/40 text-xs font-bold tracking-widest uppercase">
              <a href="https://instagram.com">Instagram</a>
              <a href="https://x.com">Twitter</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
