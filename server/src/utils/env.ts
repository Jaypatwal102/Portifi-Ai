export const getEnvValue = (name: string): string | undefined => {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
};

export const getRequiredEnv = (name: string): string => {
  const value = getEnvValue(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getJwtSecret = (): string => {
  const value = getEnvValue("JWT_SECRET");

  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return "your-secret-key";
};
