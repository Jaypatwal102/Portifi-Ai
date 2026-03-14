import { createChatModel } from "./lc_models.js";
import { finalOutputSchema, FinalOutput } from "./schema.js";

type JsonRecord = Record<string, unknown>;

const SYSTEM_PROMPT = `You are a resume parsing assistant.
Extract the resume into a single JSON object.
Return JSON only, with these top-level keys exactly:
- basics
- skills
- experience
- education
- projects
- socials

Rules:
- Use empty strings when a text field is missing.
- Use empty arrays when a list is missing.
- Keep dates as strings.
- skills can be either strings or objects with name, level, and category.
- experience items should use a boolean for isCurrent.
- Do not include markdown fences or extra commentary.`;

function getMessageText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (
          item &&
          typeof item === "object" &&
          "text" in item &&
          typeof item.text === "string"
        ) {
          return item.text;
        }

        return "";
      })
      .join("\n");
  }

  return "";
}

function extractJsonObject(text: string): string {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fencedMatch?.[1]?.trim() || text.trim();

  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        start = index;
      }

      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0 && start !== -1) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error("Model did not return a valid JSON object");
}

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => asString(item))
    .filter((item) => item.length > 0);
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "yes", "present", "current"].includes(normalized)) {
      return true;
    }

    if (["false", "no", "past", "former"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
}

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function normalizeParsedResume(raw: unknown): FinalOutput {
  const data = (raw && typeof raw === "object" ? raw : {}) as JsonRecord;
  const basics = (data.basics &&
  typeof data.basics === "object"
    ? data.basics
    : {}) as JsonRecord;
  const basicName = asString(basics.name);

  const normalized = {
    basics: {
      name: basicName || "Unknown Candidate",
      title: asString(basics.title),
      summary: asString(basics.summary),
      location: asString(basics.location),
    },
    skills: Array.isArray(data.skills)
      ? data.skills
          .map((item) => {
            if (typeof item === "string") {
              return item.trim();
            }

            if (item && typeof item === "object") {
              const skill = item as JsonRecord;
              const name = asString(skill.name);

              if (!name) {
                return null;
              }

              return {
                name,
                level: asString(skill.level) || undefined,
                category: asString(skill.category) || undefined,
              };
            }

            return null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      : [],
    experience: Array.isArray(data.experience)
      ? data.experience
          .filter((item): item is JsonRecord => !!item && typeof item === "object")
          .map((item) => {
            const company = asString(item.company);
            const role = asString(item.role);

            if (!hasValue(company) || !hasValue(role)) {
              return null;
            }

            return {
              company,
              role,
              location: asString(item.location),
              startDate: asString(item.startDate),
              endDate: asString(item.endDate),
              isCurrent: asBoolean(item.isCurrent),
              description: asString(item.description),
              highlights: asStringArray(item.highlights),
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      : [],
    education: Array.isArray(data.education)
      ? data.education
          .filter((item): item is JsonRecord => !!item && typeof item === "object")
          .map((item) => {
            const institution = asString(item.institution);
            const degree = asString(item.degree);

            if (!hasValue(institution) || !hasValue(degree)) {
              return null;
            }

            return {
              institution,
              degree,
              fieldOfStudy: asString(item.fieldOfStudy),
              location: asString(item.location),
              startDate: asString(item.startDate),
              endDate: asString(item.endDate),
              grade: asString(item.grade),
              description: asString(item.description),
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects
          .filter((item): item is JsonRecord => !!item && typeof item === "object")
          .map((item) => {
            const name = asString(item.name);

            if (!hasValue(name)) {
              return null;
            }

            return {
              name,
              description: asString(item.description),
              link: asString(item.link),
              technologies: asStringArray(item.technologies),
              highlights: asStringArray(item.highlights),
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      : [],
    socials: Array.isArray(data.socials)
      ? data.socials
          .filter((item): item is JsonRecord => !!item && typeof item === "object")
          .map((item) => {
            const platform = asString(item.platform);
            const url = asString(item.url);

            if (!hasValue(platform) || !hasValue(url)) {
              return null;
            }

            return {
              platform,
              url,
              username: asString(item.username) || undefined,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      : [],
  };

  return finalOutputSchema.parse(normalized);
}

async function invokeWithJsonPrompt(
  model: ReturnType<typeof createChatModel>["model"],
  query: string,
): Promise<FinalOutput> {
  const response = await model.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Resume content:\n${query}\n\nReturn the parsed resume as JSON only.`,
    },
  ]);

  const text = getMessageText(response.content);
  const jsonText = extractJsonObject(text);
  const parsed = JSON.parse(jsonText);

  return normalizeParsedResume(parsed);
}

export async function askStructured(query: string): Promise<FinalOutput> {
  const { model, provider } = createChatModel();

  if (provider === "groq") {
    return invokeWithJsonPrompt(model, query);
  }

  try {
    const structured = model.withStructuredOutput(finalOutputSchema);

    return await structured.invoke([
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Resume content:\n${query}\n\nReturn the parsed resume as JSON only.`,
      },
    ]);
  } catch {
    return invokeWithJsonPrompt(model, query);
  }
}
