"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Layout, Search, Globe, Rocket, Quote, X, MoveRight, ExternalLink } from "lucide-react";

// --- Mouse Spotlight Component ---
const SpotlightCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.08), transparent 80%)`
            : "",
        }}
      />
      {children}
    </div>
  );
};

// --- Work Modal Component ---
const WorkModal = ({ work, isOpen, onClose }: { work: any; isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[20px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={work.image} 
                alt={work.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-4 block">{work.tag}</span>
              <h2 className="text-4xl font-light mb-6 text-white">{work.title}</h2>
              
              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-2">The Challenge</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{work.description}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-2">The Result</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{work.result}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <a 
                  href="#contact" 
                  onClick={onClose}
                  className="btn-fancy flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-all no-underline"
                >
                  Start Similar Project
                  <MoveRight className="w-4 h-4" />
                </a>
                <button className="p-4 border border-white/10 rounded-full text-white hover:bg-white/5 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Testimonial Column Component ---
const TestimonialColumn = ({ testimonials, speed, reverse }: { testimonials: any[]; speed: number; reverse?: boolean }) => {
  return (
    <div className="flex flex-col gap-6 py-6 overflow-hidden max-h-[700px] relative">
      <motion.div
        animate={{ y: reverse ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        className="flex flex-col gap-6"
      >
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <div key={i} className="p-8 bg-white/5 backdrop-blur-lg border border-white/5 rounded-[20px] flex flex-col gap-4">
            <Quote className="w-6 h-6 text-white/20 mb-2" />
            <p className="text-base text-white/90 leading-relaxed italic">"{t.content}"</p>
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm">{t.name}</span>
              <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{t.role}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const TestimonialsSection = () => {
    const list = [
        { name: "Sarah Jenkins", role: "CEO @ Aura", content: "Strata transformed our digital presence. Absolute mastery." },
        { name: "Marcus Thorne", role: "Product @ Nexus", content: "Their understanding of the US market aesthetic is unmatched." },
        { name: "Elena Rossi", role: "Founder @ V-Tech", content: "Ultra-fast loading times and world-class design." },
        { name: "David Chen", role: "Marketing @ Global", content: "A high-end experience from start to finish." },
        { name: "Sophie Dubois", role: "Lead @ Paris", content: "They architect world-class digital ecosystems." },
        { name: "Liam O'Connor", role: "CEO @ Dublin", content: "Innovation meets conversion in every pixel." },
    ];

  return (
    <section className="py-24 md:py-32 px-12 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase mb-6 block">Voices</span>
          <h2 className="font-light">Client <span className="font-serif italic font-normal">Testimonials</span>.</h2>
        </div>

        {/* V11: Removed container bg/border for floating effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[700px] overflow-hidden p-6 bg-transparent">
          <TestimonialColumn testimonials={list} speed={40} />
          <TestimonialColumn testimonials={list} speed={50} reverse />
          <TestimonialColumn testimonials={list} speed={40} />
        </div>
      </div>
    </section>
  );
};

export const WorkShowcaseSection = () => {
  const [selectedWork, setSelectedWork] = useState<any>(null);

  const works = [
    { 
      title: "Vanguard Tech", 
      tag: "Fintech", 
      image: "/works/vanguard.png",
      description: "Vanguard requested a paradigm shift in how their users interact with complex financial datasets. We needed to bridge technical depth with consumer-grade simplicity.",
      result: "A 40% increase in user retention and a design system that scales across their entire global equity platform."
    },
    { 
      title: "Aura Luxury", 
      tag: "E-Commerce", 
      image: "/works/aura.png",
      description: "Integrating high-end fashion with high-performance e-commerce. The challenge was maintaining brand soul while optimizing for conversion speed.",
      result: "Record-breaking launch day sales and a mobile-first experience that redefined their digital boutique presence."
    },
    { 
      title: "Nexus Global", 
      tag: "SaaS", 
      image: "/works/nexus.png",
      description: "Visualizing real-time network infrastructure for global IT teams. We focused on clarity, speed, and a futuristic 'command center' aesthetic.",
      result: "Adopted by 3 Fortune 500 companies within the first quarter of deployment. Superior UX lead to zero churn in Beta."
    },
  ];

  return (
    <section id="work" className="relative py-24 md:py-32 px-8 md:px-28 bg-transparent text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase mb-6 block">Selected Work</span>
            <h2 className="font-light text-white">Digital <span className="font-serif italic font-normal text-white/90">Excellence</span>.</h2>
          </div>
          <button className="btn-fancy text-sm text-white/60 hover:text-white uppercase tracking-widest pb-2 border-b border-white/10 hidden md:block">
            View Archive
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {works.map((work, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              onClick={() => setSelectedWork(work)}
              className="relative group aspect-[4/5] overflow-hidden rounded-[20px] bg-[#0a0a0a] border border-white/5 cursor-pointer shadow-xl"
            >
              <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <img src={work.image} alt={work.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-2">{work.tag}</span>
                <h3 className="text-2xl font-medium text-white group-hover:translate-x-2 transition-transform duration-500">{work.title}</h3>
              </div>
              <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/50" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <WorkModal 
        work={selectedWork} 
        isOpen={!!selectedWork} 
        onClose={() => setSelectedWork(null)} 
      />
    </section>
  );
};

export const ServicesSection = () => {
    const services = [
        { icon: Layout, title: "UI/UX Architecture", desc: "User-centric design that guides conversions naturally." },
        { icon: Zap, title: "Next-Gen Performance", desc: "Ultra-fast loading times with React and Vercel Edge." },
        { icon: Search, title: "Technical SEO", desc: "Semantic HTML and meta-optimization for search engines." },
        { icon: Globe, title: "Global Branding", desc: "Visual identity that resonates with EU/US markets." },
        { icon: Rocket, title: "Strategy & Launch", desc: "Data-driven roadmaps from discovery to global scale." },
        { icon: CheckCircle2, title: "WCAG Compliance", desc: "Inclusive design meeting international accessibility standards." },
    ];

  return (
    <section id="expertise" className="relative py-24 md:py-32 px-8 md:px-28 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase mb-6 block">Capabilities</span>
          <h2 className="font-light text-white">Systematic <span className="font-serif italic font-normal text-white/90">Innovation</span>.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <SpotlightCard 
              key={idx}
              className="p-10 bg-white/5 backdrop-blur-2xl border border-white/5 hover:border-white/20 transition-all rounded-[20px] group shadow-xl"
            >
              <service.icon className="w-8 h-8 text-white/50 group-hover:text-white transition-colors mb-6" />
              <h3 className="text-xl font-medium mb-4 text-white">{service.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{service.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export const PricingSection = () => {
  const tiers = [
    {
      name: "Essential",
      price: "$1,900+",
      desc: "Perfect for startups needing a high-impact presence.",
      features: ["Custom 3-Page Website", "Responsive Design", "Basic SEO", "30-Day Support"],
      cta: "Plan Essential"
    },
    {
      name: "Professional",
      price: "$3,500+",
      desc: "Our most popular tier for growing businesses.",
      features: ["Custom 6-Page Website", "Advanced Animations", "Technical SEO", "CMS Integration", "60-Day Support"],
      cta: "Go Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Bespoke digital ecosystems at global scale.",
      features: ["Unlimited Pages", "Custom Web Apps", "Performance Optimization", "Third-party APIs", "Priority Support"],
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="relative py-24 md:py-32 px-8 md:px-28 bg-transparent text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase mb-6 block">Investment</span>
          <h2 className="font-light text-white">Transparent <span className="font-serif italic font-normal text-white/90">Pricing</span>.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`relative p-10 bg-white/5 backdrop-blur-2xl border rounded-[20px] flex flex-col transition-all duration-500 hover:scale-[1.02] ${tier.popular ? "border-white/30 bg-white/10 shadow-2xl" : "border-white/5 shadow-xl"}`}
            >
              {tier.popular && (
                <span className="absolute top-6 right-8 text-[8px] font-bold tracking-widest uppercase py-1 px-3 bg-white text-black rounded-full">Most Popular</span>
              )}
              <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-4 block">{tier.name}</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-light text-white">{tier.price}</span>
              </div>
              <p className="text-white/60 text-xs mb-8 leading-relaxed">{tier.desc}</p>
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-white/40" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`btn-fancy py-4 rounded-full text-center text-sm font-medium transition-all no-underline ${tier.popular ? "bg-white text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
