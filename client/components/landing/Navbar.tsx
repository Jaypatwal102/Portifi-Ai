import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-txt">
            Portifi AI
          </Link>

          <Link href="/features" className="text-txt hover:text-hv font-semibold ml-10">
            Features
          </Link>
          <Link href="/testimonials" className="text-txt hover:text-hv transition font-semibold">
            Testimonials
          </Link>
          <Link href="/demo" className="text-txt hover:text-hv font-semibold">
            Demo
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Button asChild className="bg-bg text-txt hover:bg-blue-300 inline-flex relative transition-all duration-200 hover:shadow-xl hover:-translate-y-px">
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild className="inline-flex relative transition-all duration-200 hover:shadow-xl hover:-translate-y-px">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
