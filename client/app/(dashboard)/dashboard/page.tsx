"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PortfolioDashboard() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="bg-bg min-h-screen p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-txt text-xl sm:text-2xl font-semibold">
          Welcome back, Alex! 👋
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Here's a quick overview of your portfolio.
        </p>
      </div>

      {/* Portfolio Status */}
      <Card className="bg-surface border-bd">
        <CardHeader>
          <CardTitle>Portfolio Status</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-acnt rounded-full"></span>
            <span className="font-medium text-txt">Draft</span>
            <span className=" text-sm">• Your portfolio is a draft.</span>
          </div>

          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            https://portifi.ai/alex
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Resume Card */}
        <Card className="bg-surface border-bd">
          <CardHeader>
            <CardTitle>Upload or Update Your Resume</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className=" text-sm">
              Upload your latest resume (PDF, DOCX) to keep your portfolio
              updated.
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
              className="w-full bg-prime text-white hover:opacity-90"
              onClick={() => document.getElementById("resumeUpload")?.click()}
            >
              <UploadCloud className="mr-2 w-4 h-4" /> Upload Resume
            </Button>

            {fileName && (
              <p className="text-sm text-acnt">Selected: {fileName}</p>
            )}

            <p className="text-xs ">Supported formats: PDF, DOCX</p>
          </CardContent>
        </Card>

        {/* Portfolio Preview Card */}
        <Card className="bg-surface border-bd">
          <CardHeader>
            <CardTitle>Portfolio Preview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm">
              See how your live portfolio looks before sharing.
            </p>

            {/* RESPONSIVE IMAGE (BEST APPROACH) */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-bd">
              <Image
                src="/image.png"
                alt="Portfolio Preview"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button className="w-full sm:w-auto bg-prime text-white hover:opacity-90">
                <Eye className="mr-2 w-4 h-4" /> View Live Portfolio
              </Button>

              <Button variant="ghost" className="w-full sm:w-auto text-txt">
                Edit Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs sm:text-sm ">
        © 2026 Portifi AI. All rights reserved.
      </p>
    </div>
  );
}
