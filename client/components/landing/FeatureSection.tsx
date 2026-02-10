import { FileText, LayoutTemplate, PencilRuler, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "AI Resume Parsing",
    description: "Our intelligent AI extracts key skills, experiences, and projects directly from your resume.",
    icon: FileText,
  },
  {
    title: "Custom Portfolio Templates",
    description: "Choose from a gallery of modern, professional templates tailored for developers and students.",
    icon: LayoutTemplate,
  },
  {
    title: "Fully Editable Sections",
    description: "Easily customize and rearrange any section of your portfolio to reflect your brand.",
    icon: PencilRuler,
  },
  {
    title: "Public Shareable Link",
    description: "Get a unique, shareable URL to showcase your professional portfolio to recruiters.",
    icon: Share2,
  },
];

export default function FeaturesSection() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-6 py-24 bg-bg rounded-2xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-txt">Effortless Portfolio Creation</h2>
          <p className="mt-4 text-mute">Streamline your job search with powerful features designed to make you stand out.</p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-surface border border-bd transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 cursor-pointer"
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-acnt">
                    <Icon className="h-5 w-5 text-txt" />
                  </div>

                  {/* Text */}
                  <h3 className="font-semibold text-txt">{feature.title}</h3>
                  <p className="mt-2 text-sm text-mute">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
