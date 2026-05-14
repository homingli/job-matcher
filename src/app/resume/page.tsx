// src/app/resume/page.tsx
import fs from 'fs/promises';
import path from 'path';
import ResumeContent from './ResumeContent';

// Define the path to the resume file relative to the project root
const RESUME_PATH = path.resolve(process.cwd(), 'HML.RESUME.md');

export default async function ResumePage() {
  let resumeContent: string = "Could not load resume content.";

  try {
    // Read the file content asynchronously
    resumeContent = await fs.readFile(RESUME_PATH, 'utf-8');
  } catch (error) {
    console.error("Error reading resume file:", error);
  }

  return <ResumeContent content={resumeContent} />;
}
