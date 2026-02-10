import Link from "next/link";
import { Linkedin } from "lucide-react";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-5 gap-12">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-primary">Portifi AI</div>
            <p className="mt-4 text-sm text-mute max-w-xs">Turn your resume into a live portfolio using AI.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-txt">Product</h4>
            <ul className="mt-4 space-y-2 text-mute">
              <li>
                <Link href="/features" className="text-mute hover:text-txt transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-mute hover:text-txt transition">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-mute hover:text-txt transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-txt">Company</h4>
            <ul className="mt-4 space-y-2 text-mute">
              <li>
                <Link href="/about" className="text-mute hover:text-txt transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-mute hover:text-txt transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-mute hover:text-txt transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-txt">Resources</h4>
            <ul className="mt-4 space-y-2 text-mute">
              <li>
                <Link href="/help" className="text-mute hover:text-txt transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-mute hover:text-txt transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-mute hover:text-txt transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-txt">Connect</h4>
            <div className="flex gap-8 mt-5">
              <SocialIcon href="#" src="/github.svg" alt="GitHub" />
              <Link href="#" className="opacity-70 hover:opacity-100 transition">
                <Linkedin size={18} />
              </Link>
              <SocialIcon href="#" src="/x.svg" alt="X" />
              <SocialIcon href="mailto:hello@portifi.ai" src="/gmail.svg" alt="Email" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-bd" />

        {/* Bottom */}
        <div className="mt-6 text-center text-sm text-mute">© 2026 Portifi AI. All rights reserved.</div>
      </div>
    </footer>
  );
}
