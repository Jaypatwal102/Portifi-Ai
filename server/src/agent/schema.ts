import { z } from "zod";

export const basicsSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    title: z.string().default(""),
    summary: z.string().default(""),
    location: z.string().default(""),
  })
  .passthrough();

export const skillItemSchema = z.union([
  z.string().min(1),
  z
    .object({
      name: z.string().min(1),
      level: z.string().optional(),
      category: z.string().optional(),
    })
    .passthrough(),
]);

export const skillsSchema = z.array(skillItemSchema).default([]);

export const experienceItemSchema = z
  .object({
    company: z.string().min(1),
    role: z.string().min(1),
    location: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    isCurrent: z.boolean().optional(),
    description: z.string().default(""),
    highlights: z.array(z.string()).default([]),
  })
  .passthrough();

export const educationItemSchema = z
  .object({
    institution: z.string().min(1),
    degree: z.string().min(1),
    fieldOfStudy: z.string().default(""),
    location: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    grade: z.string().default(""),
    description: z.string().default(""),
  })
  .passthrough();

export const projectItemSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().default(""),
    link: z.string().default(""),
    technologies: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
  })
  .passthrough();

export const socialItemSchema = z
  .object({
    platform: z.string().min(1),
    url: z.string().min(1),
    username: z.string().optional(),
  })
  .passthrough();

// Final AI parsing output mapped to ResumeParsedData JSON columns.
export const finalOutputSchema = z
  .object({
    basics: basicsSchema,
    skills: skillsSchema,
    experience: z.array(experienceItemSchema).default([]),
    education: z.array(educationItemSchema).default([]),
    projects: z.array(projectItemSchema).default([]),
    socials: z.array(socialItemSchema).default([]),
  })
  .strict();

// Full table-shaped schema (including non-JSON scalar columns in ResumeParsedData).
export const resumeParsedDataSchema = finalOutputSchema.extend({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  updatedAt: z.coerce.date(),
});

export type FinalOutput = z.infer<typeof finalOutputSchema>;
export type ResumeParsedData = z.infer<typeof resumeParsedDataSchema>;
