import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WorkShowcaseSection, ServicesSection, TestimonialsSection, PricingSection } from "@/components/ContentSections";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-black min-h-screen relative">
      {/* Global Fixed Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <WorkShowcaseSection />
        <ServicesSection />
        <PricingSection />
        <TestimonialsSection />
        <ContactSection />
        
        {/* Footer */}
        <footer className="py-20 px-12 border-t border-white/5 bg-transparent backdrop-blur-xl">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tighter">STRATA</h2>
              <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                Architecting high-performance digital ecosystems for global brands.
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Direct Contact</span>
                <a href="mailto:ngtrangppt@gmail.com" className="text-white/90 hover:text-white transition-colors text-lg">
                  ngtrangppt@gmail.com
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Social</span>
                <div className="flex flex-col gap-2 text-sm text-white/60">
                  <a href="https://instagram.com" className="hover:text-white transition-colors">Instagram</a>
                  <a href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</a>
                  <a href="https://x.com" className="hover:text-white transition-colors">Twitter (X)</a>
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Legal</span>
                <div className="flex flex-col gap-2 text-sm text-white/60">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-bold tracking-widest text-white/30 uppercase">
            <span>© 2024 STRATA AGENCY</span>
            <span>Built with Precision</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
