import { CtaSection } from "@/components/landing/CTA";
import FeaturesSection from "@/components/landing/FeatureSection";
import { Footer } from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import { TestimonialsSection } from "@/components/landing/Testimonial";
import { Separator } from "@/components/ui/separator";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Separator />
      <Hero />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
