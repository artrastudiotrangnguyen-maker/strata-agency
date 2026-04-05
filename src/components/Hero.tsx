"use client";

import React from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4">
      {/* Background is now global in page.tsx */}
      
      <div className="relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Architecting the Future</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-medium tracking-[-0.04em] leading-[0.95] mb-8 text-white"
        >
          Elite Web Design & <br />
          <span className="font-serif italic font-normal text-white/90">Digital Architecture</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl font-normal text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We craft data-driven digital experiences for elite brands <br className="hidden md:block" /> 
          seeking global scale and technical precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <a
            href="#contact"
            className="btn-fancy bg-white text-black px-10 py-4 rounded-full text-base font-medium flex items-center gap-2 hover:bg-white/90 transition-colors shadow-xl no-underline"
          >
            Start a Project
            <MoveRight className="w-5 h-5" />
          </a>
          <a
            href="#expertise"
            className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest no-underline border-b border-white/10 pb-1"
          >
            View Capabilities
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
};
