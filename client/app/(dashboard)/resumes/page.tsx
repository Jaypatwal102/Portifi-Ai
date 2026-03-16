"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Files,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";

type Basics = {
  name: string;
  title: string;
  summary: string;
  location: string;
};

type SkillItem = string | { name: string; level?: string; category?: string };

type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
  highlights: string[];
};

type EducationItem = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
};

type ProjectItem = {
  name: string;
  description: string;
  link: string;
  technologies: string[];
  highlights: string[];
};

type SocialItem = {
  platform: string;
  url: string;
  username?: string;
};

type ParsedResumeData = {
  id?: string;
  resumeId?: string;
  updatedAt?: string;
  basics: Basics;
  skills: SkillItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  socials: SocialItem[];
};

type ResumeItem = {
  id: string;
  userId: string;
  fileUrl: string;
  fileType: string;
  fileHash: string;
  status: string;
  uploadedAt: string;
  parsedData: ParsedResumeData | null;
};

type ResumeListResponse = {
  data: ResumeItem[];
};

type ResumeMutationResponse = {
  message: string;
  data: {
    resumeId: string;
    parsedData: ParsedResumeData;
  };
};

type ResumeWriteResponse = {
  message: string;
  data: ResumeItem;
};

type ResumeDeleteResponse = {
  message: string;
  data: {
    resumeId: string;
  };
};

const textareaClassName =
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]";

const emptyParsedData = (): ParsedResumeData => ({
  basics: { name: "", title: "", summary: "", location: "" },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  socials: [],
});

const emptyExperience = (): ExperienceItem => ({
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  highlights: [],
});

const emptyEducation = (): EducationItem => ({
  institution: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  grade: "",
  description: "",
});

const emptyProject = (): ProjectItem => ({
  name: "",
  description: "",
  link: "",
  technologies: [],
  highlights: [],
});

const emptySocial = (): SocialItem => ({
  platform: "",
  url: "",
  username: "",
});

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const parseCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const skillToString = (skill: SkillItem) =>
  typeof skill === "string" ? skill : skill.name;

const normalizeParsedData = (value: unknown): ParsedResumeData => {
  const data =
    value && typeof value === "object"
      ? (value as Partial<ParsedResumeData>)
      : undefined;
  const normalizedSkills: SkillItem[] = Array.isArray(data?.skills)
    ? data.skills.reduce<SkillItem[]>((allSkills, skill) => {
        if (typeof skill === "string") {
          allSkills.push(skill);
          return allSkills;
        }

        if (
          skill &&
          typeof skill === "object" &&
          typeof skill.name === "string"
        ) {
          allSkills.push({
            name: skill.name,
            level: typeof skill.level === "string" ? skill.level : undefined,
            category:
              typeof skill.category === "string" ? skill.category : undefined,
          });
        }

        return allSkills;
      }, [])
    : [];

  return {
    id: data?.id,
    resumeId: data?.resumeId,
    updatedAt: data?.updatedAt,
    basics: {
      name: typeof data?.basics?.name === "string" ? data.basics.name : "",
      title: typeof data?.basics?.title === "string" ? data.basics.title : "",
      summary:
        typeof data?.basics?.summary === "string" ? data.basics.summary : "",
      location:
        typeof data?.basics?.location === "string" ? data.basics.location : "",
    },
    skills: normalizedSkills,
    experience: Array.isArray(data?.experience)
      ? data.experience.map((item) => ({
          company: typeof item?.company === "string" ? item.company : "",
          role: typeof item?.role === "string" ? item.role : "",
          location: typeof item?.location === "string" ? item.location : "",
          startDate:
            typeof item?.startDate === "string" ? item.startDate : "",
          endDate: typeof item?.endDate === "string" ? item.endDate : "",
          isCurrent:
            typeof item?.isCurrent === "boolean" ? item.isCurrent : false,
          description:
            typeof item?.description === "string" ? item.description : "",
          highlights: toStringArray(item?.highlights),
        }))
      : [],
    education: Array.isArray(data?.education)
      ? data.education.map((item) => ({
          institution:
            typeof item?.institution === "string" ? item.institution : "",
          degree: typeof item?.degree === "string" ? item.degree : "",
          fieldOfStudy:
            typeof item?.fieldOfStudy === "string" ? item.fieldOfStudy : "",
          location: typeof item?.location === "string" ? item.location : "",
          startDate:
            typeof item?.startDate === "string" ? item.startDate : "",
          endDate: typeof item?.endDate === "string" ? item.endDate : "",
          grade: typeof item?.grade === "string" ? item.grade : "",
          description:
            typeof item?.description === "string" ? item.description : "",
        }))
      : [],
    projects: Array.isArray(data?.projects)
      ? data.projects.map((item) => ({
          name: typeof item?.name === "string" ? item.name : "",
          description:
            typeof item?.description === "string" ? item.description : "",
          link: typeof item?.link === "string" ? item.link : "",
          technologies: toStringArray(item?.technologies),
          highlights: toStringArray(item?.highlights),
        }))
      : [],
    socials: Array.isArray(data?.socials)
      ? data.socials.map((item) => ({
          platform: typeof item?.platform === "string" ? item.platform : "",
          url: typeof item?.url === "string" ? item.url : "",
          username: typeof item?.username === "string" ? item.username : "",
        }))
      : [],
  };
};

const formatForSave = (data: ParsedResumeData) => ({
  basics: data.basics,
  skills: data.skills
    .map((skill) =>
      typeof skill === "string" ? skill.trim() : skill.name.trim(),
    )
    .filter(Boolean),
  experience: data.experience.map((item) => ({
    ...item,
    highlights: item.highlights.filter(Boolean),
  })),
  education: data.education,
  projects: data.projects.map((item) => ({
    ...item,
    technologies: item.technologies.filter(Boolean),
    highlights: item.highlights.filter(Boolean),
  })),
  socials: data.socials,
});

const getTrimmedValue = (value: string) => value.trim();

const isValidUrl = (value: string) => {
  if (!value.trim()) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const validateParsedData = (data: ParsedResumeData) => {
  const errors: string[] = [];

  if (!getTrimmedValue(data.basics.name)) {
    errors.push("Full name is required.");
  }

  data.experience.forEach((item, index) => {
    if (!getTrimmedValue(item.company) || !getTrimmedValue(item.role)) {
      errors.push(`Experience ${index + 1} needs both company and role.`);
    }
  });

  data.education.forEach((item, index) => {
    if (!getTrimmedValue(item.institution) || !getTrimmedValue(item.degree)) {
      errors.push(`Education ${index + 1} needs both institution and degree.`);
    }
  });

  data.projects.forEach((item, index) => {
    if (!getTrimmedValue(item.name)) {
      errors.push(`Project ${index + 1} needs a project name.`);
    }

    if (getTrimmedValue(item.link) && !isValidUrl(item.link)) {
      errors.push(`Project ${index + 1} link must be a valid URL.`);
    }
  });

  data.socials.forEach((item, index) => {
    if (!getTrimmedValue(item.platform) || !getTrimmedValue(item.url)) {
      errors.push(`Social link ${index + 1} needs both platform and URL.`);
      return;
    }

    if (!isValidUrl(item.url)) {
      errors.push(`Social link ${index + 1} URL must be valid.`);
    }
  });

  return errors;
};

const getStatusTone = (status: string) => {
  switch (status) {
    case "PARSED":
      return "bg-emerald-500/10 text-emerald-600";
    case "FAILED":
      return "bg-red-500/10 text-red-600";
    case "PARSING":
      return "bg-amber-500/10 text-amber-600";
    default:
      return "bg-prime/10 text-prime";
  }
};

const getStatusMessage = (resume: ResumeItem) => {
  if (resume.status === "FAILED") {
    return "Parsing failed previously. Retry parsing or replace the file.";
  }

  if (resume.status === "PARSING") {
    return "Resume parsing is in progress.";
  }

  if (resume.parsedData) {
    return "Parsed data is saved and ready to review.";
  }

  return "Upload complete. Parse the file to extract editable data.";
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PARSED":
      return "Ready";
    case "FAILED":
      return "Needs attention";
    case "PARSING":
      return "In progress";
    default:
      return "Uploaded";
  }
};

const getResumeStats = (resumes: ResumeItem[]) => {
  const parsed = resumes.filter((resume) => resume.status === "PARSED").length;
  const parsing = resumes.filter((resume) => resume.status === "PARSING").length;
  const failed = resumes.filter((resume) => resume.status === "FAILED").length;

  return {
    total: resumes.length,
    parsed,
    parsing,
    failed,
  };
};

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-txt">{title}</h3>
        <p className="text-xs text-mute">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"default" | "error">("default");
  const [parsingResumeId, setParsingResumeId] = useState<string | null>(null);
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null);
  const [reuploadingResumeId, setReuploadingResumeId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [editorData, setEditorData] = useState<ParsedResumeData>(
    emptyParsedData,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceResumeId = useRef<string | null>(null);

  const activeResume =
    resumes.find((resume) => resume.id === activeResumeId) ?? null;
  const resumeStats = getResumeStats(resumes);

  const loadResumes = async (options?: { silent?: boolean }) => {
    if (options?.silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await apiFetch<ResumeListResponse>("/resume");
      setResumes(
        response.data.map((resume) => ({
          ...resume,
          parsedData: resume.parsedData
            ? normalizeParsedData(resume.parsedData)
            : null,
        })),
      );
      setMessage(null);
      setValidationErrors([]);
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to load resumes.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadResumes();
  }, []);

  const openEditor = (resumeId: string, parsedData: ParsedResumeData | null) => {
    setActiveResumeId(resumeId);
    setEditorData(
      parsedData ? normalizeParsedData(parsedData) : emptyParsedData(),
    );
    setValidationErrors([]);
    setIsEditorOpen(true);
  };

  const updateResumeInState = (resumeId: string, parsedData: ParsedResumeData) => {
    setResumes((current) =>
      current.map((resume) =>
        resume.id === resumeId
          ? {
              ...resume,
              status: "PARSED",
              parsedData: normalizeParsedData(parsedData),
            }
          : resume,
      ),
    );
  };

  const upsertResumeInState = (resume: ResumeItem) => {
    setResumes((current) => {
      const normalizedResume = {
        ...resume,
        parsedData: resume.parsedData
          ? normalizeParsedData(resume.parsedData)
          : null,
      };

      const existingIndex = current.findIndex((item) => item.id === resume.id);

      if (existingIndex === -1) {
        return [normalizedResume, ...current];
      }

      return current.map((item) =>
        item.id === resume.id ? normalizedResume : item,
      );
    });
  };

  const handleParseResume = async (resume: ResumeItem) => {
    if (resume.parsedData && resume.status === "PARSED") {
      openEditor(resume.id, resume.parsedData);
      setMessageTone("default");
      setMessage("Loaded saved parsed data.");
      return;
    }

    setParsingResumeId(resume.id);
    setMessageTone("default");
    setMessage(
      resume.status === "FAILED"
        ? "Retrying resume parsing..."
        : "Parsing resume...",
    );

    try {
      const response = await apiFetch<ResumeMutationResponse>(
        `/resume/${resume.id}/parse`,
        { method: "POST" },
      );
      const parsedData = normalizeParsedData(response.data.parsedData);
      updateResumeInState(resume.id, parsedData);
      openEditor(resume.id, parsedData);
      setMessage("Resume parsed and opened for editing.");
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to parse resume.",
      );
      setResumes((current) =>
        current.map((item) =>
          item.id === resume.id ? { ...item, status: "FAILED" } : item,
        ),
      );
    } finally {
      setParsingResumeId(null);
    }
  };

  const handleSaveParsedData = async () => {
    if (!activeResumeId) {
      return;
    }

    const errors = validateParsedData(editorData);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessageTone("error");
      setMessage("Fix the validation errors before saving.");
      return;
    }

    setIsSaving(true);
    setValidationErrors([]);
    setMessageTone("default");
    setMessage("Saving parsed resume data...");

    try {
      const response = await apiFetch<ResumeMutationResponse>(
        `/resume/${activeResumeId}/parsed-data`,
        {
          method: "PUT",
          body: JSON.stringify(formatForSave(editorData)),
        },
      );
      const parsedData = normalizeParsedData(response.data.parsedData);
      updateResumeInState(activeResumeId, parsedData);
      setEditorData(parsedData);
      setMessage("Resume data saved successfully.");
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to save resume data.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);

    if (!file) {
      setMessageTone("error");
      setMessage("Please select a resume first.");
      return;
    }

    setIsUploading(true);
    setMessageTone("default");
    setMessage("Uploading resume...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch<ResumeWriteResponse>("/resume", {
        method: "POST",
        body: formData,
      });

      upsertResumeInState(response.data);
      setMessage(`Resume uploaded successfully: ${file.name}`);
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to upload resume.",
      );
    } finally {
      event.target.value = "";
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async (resume: ResumeItem) => {
    const confirmed = window.confirm(
      "Delete this resume and its parsed data permanently?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingResumeId(resume.id);
    setMessageTone("default");
    setMessage("Deleting resume...");

    try {
      await apiFetch<ResumeDeleteResponse>(`/resume/${resume.id}`, {
        method: "DELETE",
      });

      setResumes((current) => current.filter((item) => item.id !== resume.id));

      if (activeResumeId === resume.id) {
        setIsEditorOpen(false);
        setActiveResumeId(null);
        setEditorData(emptyParsedData());
        setValidationErrors([]);
      }

      setMessage("Resume deleted successfully.");
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to delete resume.",
      );
    } finally {
      setDeletingResumeId(null);
    }
  };

  const openReplacePicker = (resumeId: string) => {
    pendingReplaceResumeId.current = resumeId;
    replaceInputRef.current?.click();
  };

  const handleReplaceResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    const resumeId = pendingReplaceResumeId.current;

    pendingReplaceResumeId.current = null;
    event.target.value = "";

    if (!file || !resumeId) {
      return;
    }

    setResumeFile(file);
    setReuploadingResumeId(resumeId);
    setMessageTone("default");
    setMessage("Replacing resume file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch<ResumeWriteResponse>(
        `/resume/${resumeId}/reupload`,
        {
          method: "PUT",
          body: formData,
        },
      );

      upsertResumeInState(response.data);

      if (activeResumeId === resumeId) {
        setEditorData(emptyParsedData());
        setValidationErrors([]);
      }

      setMessage(`Resume replaced successfully: ${file.name}`);
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to replace resume.",
      );
    } finally {
      setReuploadingResumeId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.16),transparent_28%)]">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          <section className="overflow-hidden rounded-[28px] border border-bd/80 bg-surface shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:p-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-prime/20 bg-prime/10 px-3 py-1 text-xs font-medium text-prime">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Resume workspace
                </div>

                <div className="space-y-3">
                  <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-txt sm:text-4xl">
                    Keep every resume polished, parsed, and ready to reuse.
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-mute sm:text-base">
                    Upload your latest files, retry failed parsing, and clean up
                    outdated versions from one place.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-bd bg-bg/70 p-4">
                    <div className="flex items-center gap-2 text-mute">
                      <Files className="h-4 w-4 text-prime" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Total
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-txt">
                      {resumeStats.total}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-bd bg-bg/70 p-4">
                    <div className="flex items-center gap-2 text-mute">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Ready
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-txt">
                      {resumeStats.parsed}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-bd bg-bg/70 p-4">
                    <div className="flex items-center gap-2 text-mute">
                      {resumeStats.failed > 0 ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-amber-600" />
                      )}
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Attention
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-txt">
                      {resumeStats.failed + resumeStats.parsing}
                    </p>
                  </div>
                </div>
              </div>

              <Card className="border-bd bg-bg/80 text-txt shadow-none">
                <CardHeader className="space-y-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-prime/10 px-3 py-1 text-xs font-medium text-prime">
                    <UploadCloud className="h-3.5 w-3.5" />
                    Quick upload
                  </div>
                  <CardTitle className="text-xl">Add a new resume</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-mute">
                    PDF, DOC, and DOCX files are supported. Replacing a file will
                    reset its parsed data so you can start fresh.
                  </p>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeSelect}
                  />
                  <input
                    ref={replaceInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleReplaceResume}
                  />

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="group flex w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-prime/35 bg-[linear-gradient(180deg,rgba(234,88,12,0.08),rgba(234,88,12,0.02))] px-5 py-8 text-center transition hover:border-prime/55 hover:bg-[linear-gradient(180deg,rgba(234,88,12,0.12),rgba(234,88,12,0.03))] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="rounded-2xl bg-surface p-3 text-prime shadow-sm">
                      {isUploading ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <UploadCloud className="h-5 w-5" />
                      )}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-txt">
                        {isUploading ? "Uploading resume..." : "Choose resume file"}
                      </p>
                      <p className="text-xs text-mute">
                        Tap to browse files from your device
                      </p>
                    </div>
                  </button>

                  {resumeFile && (
                    <div className="rounded-2xl border border-bd bg-surface px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-mute">
                        Selected file
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-txt">
                        {resumeFile.name}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 text-xs text-mute">
                    <span>Supported formats: PDF, DOC, DOCX</span>
                    <span>Max size: 5MB</span>
                  </div>

                  {message && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        messageTone === "error"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-bd bg-surface text-mute"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="border-bd bg-surface text-txt shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Your uploaded resumes</CardTitle>
                <p className="text-sm text-mute">
                  Parse, replace, review, and remove resumes without leaving the
                  dashboard.
                </p>
              </div>

              <Button
                variant="outline"
                className="border-bd bg-bg text-txt hover:border-prime/40 hover:bg-bg hover:text-prime"
                onClick={() => void loadResumes({ silent: true })}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh list"}
              </Button>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex min-h-56 items-center justify-center rounded-3xl border border-dashed border-bd bg-bg/70">
                  <div className="flex items-center gap-3 text-sm text-mute">
                    <LoaderCircle className="h-4 w-4 animate-spin text-prime" />
                    Loading resumes...
                  </div>
                </div>
              ) : resumes.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-bd bg-bg/70 px-6 text-center">
                  <FileText className="h-8 w-8 text-prime" />
                  <h2 className="mt-4 text-lg font-medium text-txt">
                    No resumes yet
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-mute">
                    Upload your first resume to start parsing and preparing data
                    for your portfolio.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resumes.map((resume) => (
                    <article
                      key={resume.id}
                      className="rounded-[24px] border border-bd bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))] p-5 transition hover:border-prime/30 hover:shadow-[0_18px_35px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 rounded-full bg-bg px-3 py-1.5 text-sm font-medium text-txt">
                              <FileText className="h-4 w-4 text-prime" />
                              {resume.fileType.toUpperCase()}
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(
                                resume.status,
                              )}`}
                            >
                              {getStatusLabel(resume.status)}
                            </span>
                            {resume.parsedData && (
                              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                                Saved data
                              </span>
                            )}
                          </div>

                          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <div className="space-y-2">
                              <p className="truncate text-sm font-medium text-txt">
                                {resume.fileUrl}
                              </p>
                              <p className="text-sm leading-6 text-mute">
                                {getStatusMessage(resume)}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-bd bg-bg/80 px-4 py-3">
                              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
                                Uploaded
                              </p>
                              <p className="mt-2 text-sm font-medium text-txt">
                                {new Date(resume.uploadedAt).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 xl:w-[360px]">
                          <Button
                            variant="outline"
                            className="border-bd bg-bg text-txt hover:border-prime/40 hover:bg-bg hover:text-prime"
                            onClick={() => void handleParseResume(resume)}
                            disabled={
                              parsingResumeId === resume.id ||
                              deletingResumeId === resume.id ||
                              reuploadingResumeId === resume.id
                            }
                          >
                            {parsingResumeId === resume.id ? (
                              <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Parsing...
                              </>
                            ) : resume.parsedData && resume.status === "PARSED" ? (
                              "Edit data"
                            ) : resume.status === "FAILED" ? (
                              "Retry parse"
                            ) : (
                              "Parse data"
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            className="border-bd bg-bg text-txt hover:border-prime/40 hover:bg-bg hover:text-prime"
                            onClick={() => openReplacePicker(resume.id)}
                            disabled={
                              parsingResumeId === resume.id ||
                              deletingResumeId === resume.id ||
                              reuploadingResumeId === resume.id
                            }
                          >
                            {reuploadingResumeId === resume.id ? (
                              <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Replacing...
                              </>
                            ) : (
                              "Replace file"
                            )}
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            className="border-bd bg-bg text-txt hover:border-prime/40 hover:bg-bg hover:text-prime"
                          >
                            <a
                              href={resume.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View file
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>

                          <Button
                            variant="outline"
                            className="border-bd bg-bg text-txt hover:border-red-400/40 hover:bg-bg hover:text-red-600"
                            onClick={() => void handleDeleteResume(resume)}
                            disabled={
                              parsingResumeId === resume.id ||
                              deletingResumeId === resume.id ||
                              reuploadingResumeId === resume.id
                            }
                          >
                            {deletingResumeId === resume.id ? (
                              <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-l border-bd bg-surface text-txt sm:max-w-3xl"
        >
          <SheetHeader className="sticky top-0 z-10 border-b border-bd bg-surface/95 px-1 backdrop-blur">
            <SheetTitle>Resume Data Editor</SheetTitle>
            <SheetDescription>
              Review parsed data, update any field you want, and save it for later.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 p-4">
            {validationErrors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Resolve these issues before saving:
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-sm">
                      {validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-txt">Full Name</label>
                <Input
                  value={editorData.basics.name}
                  onChange={(event) =>
                    setEditorData((current) => ({
                      ...current,
                      basics: { ...current.basics, name: event.target.value },
                    }))
                  }
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-txt">Title</label>
                <Input
                  value={editorData.basics.title}
                  onChange={(event) =>
                    setEditorData((current) => ({
                      ...current,
                      basics: { ...current.basics, title: event.target.value },
                    }))
                  }
                  placeholder="Frontend Developer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-txt">Location</label>
                <Input
                  value={editorData.basics.location}
                  onChange={(event) =>
                    setEditorData((current) => ({
                      ...current,
                      basics: {
                        ...current.basics,
                        location: event.target.value,
                      },
                    }))
                  }
                  placeholder="Mumbai, India"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-txt">Summary</label>
                <textarea
                  className={textareaClassName}
                  value={editorData.basics.summary}
                  onChange={(event) =>
                    setEditorData((current) => ({
                      ...current,
                      basics: {
                        ...current.basics,
                        summary: event.target.value,
                      },
                    }))
                  }
                  placeholder="Add a short professional summary"
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-bd bg-bg p-4">
              <SectionHeader
                title="Skills"
                description="Use commas to separate skills."
              />
              <textarea
                className={textareaClassName}
                value={editorData.skills.map(skillToString).join(", ")}
                onChange={(event) =>
                  setEditorData((current) => ({
                    ...current,
                    skills: parseCommaSeparated(event.target.value),
                  }))
                }
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="space-y-4 rounded-xl border border-bd bg-bg p-4">
              <SectionHeader
                title="Experience"
                description="Edit jobs and key highlights."
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditorData((current) => ({
                        ...current,
                        experience: [...current.experience, emptyExperience()],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                }
              />

              {editorData.experience.length === 0 ? (
                <p className="text-sm text-mute">No experience added yet.</p>
              ) : (
                editorData.experience.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border border-bd bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-txt">
                        Experience {index + 1}
                      </p>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setEditorData((current) => ({
                            ...current,
                            experience: current.experience.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={item.company}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            experience: current.experience.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, company: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Company"
                      />
                      <Input
                        value={item.role}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            experience: current.experience.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, role: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Role"
                      />
                      <Input
                        value={item.location}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            experience: current.experience.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, location: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Location"
                      />
                      <label className="flex items-center gap-2 text-sm text-txt">
                        <input
                          type="checkbox"
                          checked={Boolean(item.isCurrent)}
                          onChange={(event) =>
                            setEditorData((current) => ({
                              ...current,
                              experience: current.experience.map((entry, itemIndex) =>
                                itemIndex === index
                                  ? { ...entry, isCurrent: event.target.checked }
                                  : entry,
                              ),
                            }))
                          }
                        />
                        Current role
                      </label>
                      <Input
                        value={item.startDate}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            experience: current.experience.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, startDate: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Start date"
                      />
                      <Input
                        value={item.endDate}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            experience: current.experience.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, endDate: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="End date"
                      />
                    </div>

                    <textarea
                      className={textareaClassName}
                      value={item.description}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          experience: current.experience.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, description: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Describe the role"
                    />

                    <textarea
                      className={textareaClassName}
                      value={item.highlights.join(", ")}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          experience: current.experience.map((entry, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...entry,
                                  highlights: parseCommaSeparated(event.target.value),
                                }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Highlights, achievements, impact"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-bd bg-bg p-4">
              <SectionHeader
                title="Education"
                description="Edit schools, degrees, and supporting details."
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditorData((current) => ({
                        ...current,
                        education: [...current.education, emptyEducation()],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                }
              />

              {editorData.education.length === 0 ? (
                <p className="text-sm text-mute">No education added yet.</p>
              ) : (
                editorData.education.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border border-bd bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-txt">
                        Education {index + 1}
                      </p>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={item.institution}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, institution: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Institution"
                      />
                      <Input
                        value={item.degree}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, degree: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Degree"
                      />
                      <Input
                        value={item.fieldOfStudy}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, fieldOfStudy: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Field of study"
                      />
                      <Input
                        value={item.location}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, location: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Location"
                      />
                      <Input
                        value={item.startDate}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, startDate: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Start date"
                      />
                      <Input
                        value={item.endDate}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, endDate: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="End date"
                      />
                      <Input
                        value={item.grade}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            education: current.education.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, grade: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Grade / GPA"
                      />
                    </div>

                    <textarea
                      className={textareaClassName}
                      value={item.description}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          education: current.education.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, description: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Additional details"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-bd bg-bg p-4">
              <SectionHeader
                title="Projects"
                description="Manage your project entries and links."
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditorData((current) => ({
                        ...current,
                        projects: [...current.projects, emptyProject()],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                }
              />

              {editorData.projects.length === 0 ? (
                <p className="text-sm text-mute">No projects added yet.</p>
              ) : (
                editorData.projects.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border border-bd bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-txt">
                        Project {index + 1}
                      </p>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setEditorData((current) => ({
                            ...current,
                            projects: current.projects.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={item.name}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            projects: current.projects.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, name: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Project name"
                      />
                      <Input
                        value={item.link}
                        onChange={(event) =>
                          setEditorData((current) => ({
                            ...current,
                            projects: current.projects.map((entry, itemIndex) =>
                              itemIndex === index
                                ? { ...entry, link: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                        placeholder="Project link"
                      />
                    </div>

                    <textarea
                      className={textareaClassName}
                      value={item.description}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          projects: current.projects.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, description: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Project description"
                    />

                    <textarea
                      className={textareaClassName}
                      value={item.technologies.join(", ")}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          projects: current.projects.map((entry, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...entry,
                                  technologies: parseCommaSeparated(
                                    event.target.value,
                                  ),
                                }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Technologies used"
                    />

                    <textarea
                      className={textareaClassName}
                      value={item.highlights.join(", ")}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          projects: current.projects.map((entry, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...entry,
                                  highlights: parseCommaSeparated(
                                    event.target.value,
                                  ),
                                }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Project highlights"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-bd bg-bg p-4">
              <SectionHeader
                title="Social Links"
                description="Keep profile URLs ready for your portfolio."
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditorData((current) => ({
                        ...current,
                        socials: [...current.socials, emptySocial()],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                }
              />

              {editorData.socials.length === 0 ? (
                <p className="text-sm text-mute">No social links added yet.</p>
              ) : (
                editorData.socials.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border border-bd bg-surface p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <Input
                      value={item.platform}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          socials: current.socials.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, platform: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Platform"
                    />
                    <Input
                      value={item.username ?? ""}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          socials: current.socials.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, username: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="Username"
                    />
                    <Input
                      value={item.url}
                      onChange={(event) =>
                        setEditorData((current) => ({
                          ...current,
                          socials: current.socials.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, url: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                      placeholder="URL"
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        setEditorData((current) => ({
                          ...current,
                          socials: current.socials.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 border-t border-bd bg-surface/95 backdrop-blur">
            <div className="flex w-full items-center justify-between gap-3">
              <p className="text-xs text-mute">
                {activeResume
                  ? `Editing ${activeResume.fileType.toUpperCase()} resume`
                  : "No resume selected"}
              </p>
              <Button
                className="bg-prime text-bg hover:opacity-90"
                onClick={() => void handleSaveParsedData()}
                disabled={!activeResumeId || isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
