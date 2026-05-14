import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_RESUME_PATH = "HML.RESUME.md";

/**
 * Loads the configured resume markdown from disk for server-side matching.
 */
export async function loadDefaultResume(): Promise<string> {
  const configuredPath = process.env.RESUME_PATH ?? DEFAULT_RESUME_PATH;
  const resumePath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(process.cwd(), configuredPath);

  return readFile(resumePath, "utf8");
}
