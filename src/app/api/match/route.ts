import { generateObject } from "ai";
import { NextResponse } from "next/server";

import { matchReportSchema, matchRequestSchema } from "@/lib/match-schema";
import { getModel } from "@/lib/model-registry";
import { loadDefaultResume } from "@/lib/resume";

export const runtime = "nodejs";

function buildPrompt(resume: string, jobDescription: string): string {
  return `You are a career matching assistant. Compare the candidate resume against the job description.

CANDIDATE RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Rules:
- Score 70+ means strong fit, 50-69 means decent fit, below 50 means weak fit.
- Be precise. Do not invent skills.
- If a skill appears as a tool, concept, responsibility, or close synonym, count it as matched.
- Missing skills must be required or strongly implied by the job description.
- Notes must be 2-3 concise sentences.
- Keep skill strings short.`;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body.", 400);
  }

  const parsedRequest = matchRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return errorResponse("Job description must be 20-20000 characters.", 400);
  }

  let modelSelection;
  try {
    modelSelection = getModel();
  } catch {
    return errorResponse("No AI provider configured. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY.", 500);
  }

  try {
    const resume = parsedRequest.data.resume ?? (await loadDefaultResume());
    const result = await generateObject({
      model: modelSelection.model,
      schema: matchReportSchema,
      prompt: buildPrompt(resume, parsedRequest.data.jobDescription),
      temperature: 0.2
    });

    return NextResponse.json({
      report: result.object,
      provider: modelSelection.provider,
      model: modelSelection.modelId
    });
  } catch (error) {
    console.error("Match generation failed", error);
    return errorResponse("Unable to generate match report.", 502);
  }
}
