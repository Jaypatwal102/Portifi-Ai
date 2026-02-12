"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [loading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Play video when demo becomes visible
  useEffect(() => {
    if (showDemo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [showDemo]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center">
        {/* Text */}
        <h1 className="text-5xl font-bold leading-tight text-txt">Build your professional portfolio using AI</h1>

        <p className="mt-6 text-lg font-semibold text-mute max-w-2xl">
          Upload your resume and instantly generate a clean, customizable portfolio you can share anywhere.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => router.push("/dashboard")}
            disabled={loading}
            className="bg-mute transition-all duration-200 ease-out shadow-lg hover:shadow-2xl hover:-translate-y-px active:translate-y-0 active:shadow-lg cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Get Started"
            )}
          </Button>

          <Button
            variant="outline"
            disabled={showDemo}
            onClick={() => setShowDemo(true)}
            className="bg-mute transition-all duration-200 ease-out shadow-lg hover:shadow-2xl hover:-translate-y-px active:translate-y-0 active:shadow-lg cursor-pointer text-white"
          >
            View Demo
          </Button>
        </div>

        {/* Media Card */}
        <div className="mt-16 w-full flex justify-center">
          <Card className="border border-bd rounded-xl shadow-lg max-w-2xl w-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg  cursor-pointer">
            <div className="p-3">
              <div className="relative h-65 sm:h-80 md:h-95 lg:h-110 xl:h-125 overflow-hidden rounded-lg">
                {/* Image */}
                <Image
                  src="/small.jpg"
                  alt="AI portfolio preview"
                  fill
                  priority
                  className={`absolute inset-0 object-cover transition-opacity duration-300 ease-in-out ${showDemo ? "opacity-0" : "opacity-100"}`}
                />

                {/* Video */}
                <video
                  ref={videoRef}
                  src="/demo.mp4"
                  controls
                  playsInline
                  onEnded={() => setShowDemo(false)}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out ${
                    showDemo ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
