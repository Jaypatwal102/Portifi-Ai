import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Portifi AI transformed my outdated resume into a beautiful, functional portfolio overnight. I started getting interview calls almost immediately!",
    name: "Jane Doe",
    role: "Junior Developer",
    avatar: "/avatars/jane.jpg",
  },
  {
    quote: "As a student, building a portfolio was overwhelming. Portifi AI made it so easy, and the templates are fantastic. Highly recommend!",
    name: "Alex Smith",
    role: "Computer Science Student",
    avatar: "/avatars/alex.jpg",
  },
  {
    quote: "The ability to quickly update my portfolio from my resume is a game-changer. Saves so much time and keeps my online presence professional.",
    name: "Emily White",
    role: "Senior Software Engineer",
    avatar: "/avatars/emily.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-txt">What Our Users Say</h2>
          <p className="mt-4 text-mute">Hear from developers and students who landed their dream jobs with Portifi AI.</p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="
                bg-surface
                border border-bd
                rounded-xl
                transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 cursor-pointer
              "
            >
              <CardContent className="p-8 flex flex-col h-full">
                {/* Quote */}
                <p className="text-sm text-mute italic text-center leading-relaxed">“{t.quote}”</p>

                {/* User */}
                <div className="mt-8 flex flex-col items-center">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full" />
                  <p className="mt-4 font-semibold text-txt">{t.name}</p>
                  <p className="text-sm text-mute">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
