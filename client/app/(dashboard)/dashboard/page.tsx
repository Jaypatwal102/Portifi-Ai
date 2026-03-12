"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, ExternalLink, Eye, FileText } from "lucide-react";
import mammoth from "mammoth";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";

export default function PortfolioDashboard() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractMessage, setExtractMessage] = useState<string | null>(null);

  const handleResumeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);
    setExtractMessage(file ? null : "Please upload a resume first.");
  };

  const handleExtractResume = async () => {
    if (!resumeFile) return;

    setIsExtracting(true);
    setExtractMessage("Extracting resume details...");

    try {
      const extension = resumeFile.name.split(".").pop()?.toLowerCase();
      let extractedText = "";

      if (extension === "docx" || extension === "doc") {
        const arrayBuffer = await resumeFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value.trim();
      } else if (extension === "pdf") {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const arrayBuffer = await resumeFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const pages = await Promise.all(
          Array.from({ length: pdf.numPages }, async (_, index) => {
            const page = await pdf.getPage(index + 1);
            const textContent = await page.getTextContent();

            return textContent.items
              .map((item) => ("str" in item ? item.str : ""))
              .join(" ");
          }),
        );

        extractedText = pages.join("\n").trim();
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
      }

      console.log("Extracted Resume Text:", extractedText);
      setExtractMessage(
        extractedText
          ? `Resume text extracted from ${resumeFile.name}. Check the console.`
          : `No text could be extracted from ${resumeFile.name}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to extract resume text.";
      console.error("Resume extraction failed:", error);
      setExtractMessage(message);
    } finally {
      setIsExtracting(false);
    }
  };

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
            <span className="text-sm text-mute">
              Your portfolio is still in draft mode.
            </span>
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
            <CardTitle className="text-txt">
              Upload or Update Your Resume
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-mute">
              Upload your latest resume (PDF, DOCX) to keep your portfolio
              updated.
            </p>

            <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeSelect}
            />

            <Button
              className="w-full bg-prime text-bg hover:opacity-90"
              onClick={() => document.getElementById("resumeUpload")?.click()}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>

            {resumeFile && (
              <p className="text-sm text-prime">Selected: {resumeFile.name}</p>
            )}

            <p className="text-xs text-mute">Supported formats: PDF, DOCX</p>

            <Button
              variant="outline"
              className="mt-8 w-full border-bd bg-bg text-txt hover:border-prime/40 hover:bg-bg hover:text-prime disabled:border-bd disabled:bg-bg disabled:text-mute"
              disabled={!resumeFile || isExtracting}
              onClick={handleExtractResume}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isExtracting ? "Extracting Resume..." : "Extract Resume"}
            </Button>

            {extractMessage && (
              <p className="text-sm text-mute">{extractMessage}</p>
            )}
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
