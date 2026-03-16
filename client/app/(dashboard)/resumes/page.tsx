"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
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
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
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
  const [message, setMessage] = useState<string | null>(null);
  const [parsingResumeId, setParsingResumeId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [editorData, setEditorData] = useState<ParsedResumeData>(emptyParsedData);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeResume =
    resumes.find((resume) => resume.id === activeResumeId) ?? null;

  const loadResumes = async () => {
    setIsLoading(true);

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
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to load resumes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadResumes();
  }, []);

  const openEditor = (resumeId: string, parsedData: ParsedResumeData | null) => {
    setActiveResumeId(resumeId);
    setEditorData(parsedData ? normalizeParsedData(parsedData) : emptyParsedData());
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

  const handleParseResume = async (resume: ResumeItem) => {
    if (resume.parsedData) {
      openEditor(resume.id, resume.parsedData);
      setMessage("Loaded saved parsed data.");
      return;
    }

    setParsingResumeId(resume.id);
    setMessage("Parsing resume...");

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
      setMessage(
        error instanceof Error ? error.message : "Failed to parse resume.",
      );
    } finally {
      setParsingResumeId(null);
    }
  };

  const handleSaveParsedData = async () => {
    if (!activeResumeId) {
      return;
    }

    setIsSaving(true);
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
      setMessage(
        error instanceof Error ? error.message : "Failed to upload resume.",
      );
    } finally {
      event.target.value = "";
      setIsUploading(false);
    }
  };

  return (
    <>
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

              <p className="text-xs text-mute">
                Supported formats: PDF, DOC, DOCX
              </p>

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
                          {resume.parsedData && (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                              Saved data
                            </span>
                          )}
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
                          onClick={() => void handleParseResume(resume)}
                          disabled={parsingResumeId === resume.id}
                        >
                          {parsingResumeId === resume.id
                            ? "Parsing Resume..."
                            : resume.parsedData
                              ? "Edit Parsed Data"
                              : "Parse Data"}
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

      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-l border-bd bg-surface text-txt sm:max-w-3xl"
        >
          <SheetHeader className="border-b border-bd">
            <SheetTitle>Resume Data Editor</SheetTitle>
            <SheetDescription>
              Review parsed data, update any field you want, and save it for later.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 p-4">
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

          <SheetFooter className="border-t border-bd bg-surface">
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
