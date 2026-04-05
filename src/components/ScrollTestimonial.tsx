"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Word = ({ children, progress, range }: { children: string; progress: any; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ["hsl(0 0% 35%)", "hsl(0 0% 100%)"]);

  return (
    <motion.span 
      style={{ opacity, color }}
      className="mr-[0.3em] inline-block last:mr-0 transition-colors duration-300"
    >
      {children}
    </motion.span>
  );
};

export const ScrollTestimonial = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = "Strata revolutionized how we handle financial insights using smart analytics. We are now driving better outcomes quicker than we ever imagined! Architecture meets conversion in every single pixel of their design ecosystem.";
  const words = text.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-start justify-center py-24 md:py-48 px-8 md:px-28 bg-black text-white"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-start gap-12">
        {/* Quote Symbol Mark */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-14 h-10 mb-4"
        >
            <img 
                src="/quote_symbol_neuralyn_style.png" 
                alt="Quote" 
                className="w-full h-full object-contain grayscale opacity-60"
            />
        </motion.div>

        {/* Scrolling Word Reveal Text */}
        <h2 className="text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight flex flex-wrap">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
          <span className="text-white/30 ml-2 font-serif italic font-normal">”</span>
        </h2>

        {/* Author Row */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-5 mt-10"
        >
          <div className="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-white/20 to-transparent">
            <img 
              src="/testimonial_avatar_neuralyn_style.png" 
              alt="Brooklyn Simmons" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-white">Brooklyn Simmons</span>
            <span className="text-sm font-normal text-white/40 uppercase tracking-widest">Product Manager @ Nexus</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
