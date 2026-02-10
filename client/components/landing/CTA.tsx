import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Ready to build your professional portfolio?</h2>

        <p className="mt-4 text-mute">Join thousands of developers and students showcasing their talent with Portifi AI.</p>

        <div className="mt-8">
          <Button
            className="
              px-8
              py-6
              text-base
              transition-all duration-200
              hover:shadow-lg
              hover:-translate-y-px
              cursor-pointer
            "
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
