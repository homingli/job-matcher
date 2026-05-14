import { z } from "zod";

export const matchReportSchema = z.object({
  score: z.number().int().min(0).max(100),
  matched_skills: z.array(z.string()).default([]),
  missing_skills: z.array(z.string()).default([]),
  bonus_skills: z.array(z.string()).default([]),
  experience_match: z.string(),
  notes: z.string()
});

export type MatchReport = z.infer<typeof matchReportSchema>;

export const matchRequestSchema = z.object({
  jobDescription: z.string().trim().min(20).max(20000),
  resume: z.string().trim().min(20).max(30000).optional()
});

export type MatchRequest = z.infer<typeof matchRequestSchema>;
