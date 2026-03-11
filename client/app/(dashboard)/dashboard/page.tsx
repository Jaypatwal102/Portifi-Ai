"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PortfolioDashboard() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-bg p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-txt sm:text-2xl">
          Welcome back, Alex.
        </h1>
        <p className="text-sm text-mute sm:text-base">
          Here&apos;s a quick overview of your portfolio.
        </p>
      </div>

      <Card className="cursor-pointer border-bd bg-surface text-txt transition-all duration-200 ease-out hover:-translate-y-1 hover:border-prime/40 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-txt">Portfolio Status</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-acnt"></span>
            <span className="font-medium text-txt">Draft</span>
            <span className="text-sm text-mute">Your portfolio is still in draft mode.</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-bd bg-bg text-txt hover:border-prime/40 hover:bg-bg hover:text-prime sm:w-auto"
          >
            https://portifi.ai/alex
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="cursor-pointer border-bd bg-surface text-txt transition-all duration-200 ease-out hover:-translate-y-1 hover:border-prime/40 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-txt">Upload or Update Your Resume</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-mute">
              Upload your latest resume (PDF, DOCX) to keep your portfolio updated.
            </p>

            <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />

            <Button
              className="w-full bg-prime text-bg hover:opacity-90"
              onClick={() => document.getElementById("resumeUpload")?.click()}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>

            {fileName && <p className="text-sm text-prime">Selected: {fileName}</p>}

            <p className="text-xs text-mute">Supported formats: PDF, DOCX</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer border-bd bg-surface text-txt transition-all duration-200 ease-out hover:-translate-y-1 hover:border-prime/40 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-txt">Portfolio Preview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-mute">
              See how your live portfolio looks before sharing.
            </p>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-bd bg-bg">
              <Image
                src="/image.png"
                alt="Portfolio Preview"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button className="w-full bg-prime text-bg hover:opacity-90 sm:w-auto">
                <Eye className="mr-2 h-4 w-4" />
                View Live Portfolio
              </Button>

              <Button
                variant="ghost"
                className="w-full text-txt hover:bg-bg hover:text-prime sm:w-auto"
              >
                Edit Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
