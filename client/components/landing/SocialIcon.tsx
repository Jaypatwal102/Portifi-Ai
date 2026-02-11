import Image from "next/image";
import Link from "next/link";

export function SocialIcon({ href, src, alt }: { href: string; src: string; alt: string }) {
  return (
    <Link href={href} target="_blank">
      <Image src={src} alt={alt} width={18} height={18} className="opacity-70 hover:opacity-100 transition" />
    </Link>
  );
}
