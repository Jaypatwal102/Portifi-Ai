"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, RefreshCw, UploadCloud } from "lucide-react";

type ResumeItem = {
  id: string;
  userId: string;
  fileUrl: string;
  fileType: string;
  fileHash: string;
  status: string;
  uploadedAt: string;
};

type ResumeListResponse = {
  data: ResumeItem[];
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [parsingResumeId, setParsingResumeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadResumes = async () => {
    setIsLoading(true);

    try {
      const response = await apiFetch<ResumeListResponse>("/resume");
      setResumes(response.data);
      setMessage(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load resumes.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadResumes();
  }, []);

  const handleParseResume = async (resumeId: string) => {
    setParsingResumeId(resumeId);
    setMessage("Parsing resume...");

    try {
      const response = await apiFetch<{
        message: string;
        data: {
          resumeId: string;
          parsedData: unknown;
        };
      }>(`/resume/${resumeId}/parse`, {
        method: "POST",
      });
      console.log("Parsed resume data:", response.data);

      setMessage("Resume parsed. Check the browser console.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to parse resume.";
      console.error("Resume parsing failed:", error);
      setMessage(errorMessage);
    } finally {
      setParsingResumeId(null);
    }
  };

  const handleResumeSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);

    if (!file) {
      setMessage("Please select a resume first.");
      return;
    }

    setIsUploading(true);
    setMessage("Uploading resume...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiFetch<{ message: string; data: ResumeItem }>("/resume", {
        method: "POST",
        body: formData,
      });

      setMessage(`Resume uploaded successfully: ${file.name}`);
      await loadResumes();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload resume.";
      setMessage(errorMessage);
    } finally {
      event.target.value = "";
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-bg p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-txt sm:text-2xl">
            Resumes
          </h1>
          <p className="text-sm text-mute sm:text-base">
            Upload resumes and review everything already stored in your account.
          </p>
        </div>

        <Button
          variant="outline"
          className="border-bd bg-surface text-txt hover:border-prime/40 hover:bg-surface hover:text-prime"
          onClick={() => void loadResumes()}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="border-bd bg-surface text-txt">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-mute">
              Add a new PDF, DOC, or DOCX resume to your account.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeSelect}
            />

            <Button
              className="w-full bg-prime text-bg hover:opacity-90"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading Resume..." : "Upload Resume"}
            </Button>

            {resumeFile && (
              <p className="text-sm text-prime">Selected: {resumeFile.name}</p>
            )}

            <p className="text-xs text-mute">Supported formats: PDF, DOC, DOCX</p>

            {message && <p className="text-sm text-mute">{message}</p>}
          </CardContent>
        </Card>

        <Card className="border-bd bg-surface text-txt">
          <CardHeader>
            <CardTitle>Your Uploaded Resumes</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-sm text-mute">Loading resumes...</p>
            ) : resumes.length === 0 ? (
              <p className="text-sm text-mute">
                No resumes found. Upload your first one.
              </p>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex flex-col gap-4 rounded-xl border border-bd bg-bg p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-txt">
                        <FileText className="h-4 w-4 text-prime" />
                        <span className="font-medium uppercase">
                          {resume.fileType}
                        </span>
                        <span className="rounded-full bg-prime/10 px-2 py-0.5 text-xs font-medium text-prime">
                          {resume.status}
                        </span>
                      </div>

                      <p className="truncate text-sm text-mute">
                        {resume.fileUrl}
                      </p>

                      <p className="text-xs text-mute">
                        Uploaded on{" "}
                        {new Date(resume.uploadedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        className="border-bd bg-surface text-txt hover:border-prime/40 hover:bg-surface hover:text-prime"
                        onClick={() => void handleParseResume(resume.id)}
                        disabled={parsingResumeId === resume.id}
                      >
                        {parsingResumeId === resume.id
                          ? "Parsing Resume..."
                          : "Parse Resume"}
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="border-bd bg-surface text-txt hover:border-prime/40 hover:bg-surface hover:text-prime"
                      >
                        <a
                          href={resume.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Resume
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
