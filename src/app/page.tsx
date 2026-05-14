"use client";

import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { ScoreGauge } from "@/components/score-gauge";
import { SkillList } from "@/components/skill-list";
import type { MatchReport } from "@/lib/match-schema";

type MatchResponse = {
  report: MatchReport;
  provider: string;
  model: string;
};

const SAMPLE_JOB_DESCRIPTION = `Senior Solutions Architect

We need a customer-facing technical leader with deep cloud architecture, AI/LLM experience, strong security knowledge, and ability to run enterprise POCs. Kafka, Flink, AWS, Kubernetes, and executive communication are strong pluses.`;

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [matchResponse, setMatchResponse] = useState<MatchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const characterCount = jobDescription.length;
  const canSubmit = characterCount >= 20 && characterCount <= 20000 && !isLoading;

  const statusText = useMemo(() => {
    if (characterCount === 0) {
      return "Paste job description.";
    }

    if (characterCount < 20) {
      return "Need at least 20 characters.";
    }

    if (characterCount > 20000) {
      return "Too long. Limit 20000 characters.";
    }

    return `${characterCount} characters ready.`;
  }, [characterCount]);

  async function submitJobDescription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setMatchResponse(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ jobDescription })
      });

      const data = (await response.json()) as MatchResponse | { error?: string };
      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "Match request failed.");
      }

      setMatchResponse(data as MatchResponse);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Match request failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
        <section className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel)] p-5 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[color:var(--line)] pb-4">
            <p className="text-sm font-semibold uppercase tracking-normal text-[color:var(--accent)]">Job Matcher</p>
            <h1 className="text-3xl font-semibold text-balance">Resume fit assessment</h1>
            <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
              Paste a job description. The API compares it with the default resume and returns a structured fit report.
            </p>
          </div>

          <form className="mt-5 flex flex-col gap-4" onSubmit={submitJobDescription}>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium" htmlFor="job-description">
                Job description
              </label>
              <button
                className="rounded-md border border-[color:var(--line)] px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
              >
                Use sample
              </button>
            </div>
            <textarea
              id="job-description"
              className="min-h-[420px] resize-y rounded-lg border border-[color:var(--line)] bg-white p-4 text-sm leading-6 shadow-inner"
              placeholder="Paste full job description here..."
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[color:var(--muted)]">{statusText}</p>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={!canSubmit}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Analyze fit
              </button>
            </div>
          </form>
        </section>

        <section className="flex flex-col gap-4">
          {errorMessage ? (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          ) : null}

          {matchResponse ? (
            <>
              <section className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel)] p-5 shadow-sm">
                <ScoreGauge score={matchResponse.report.score} />
                <div className="mt-5 border-t border-[color:var(--line)] pt-4">
                  <h2 className="text-sm font-semibold uppercase tracking-normal text-[color:var(--muted)]">Assessment</h2>
                  <p className="mt-2 leading-7">{matchResponse.report.notes}</p>
                  <p className="mt-3 text-sm text-[color:var(--muted)]">{matchResponse.report.experience_match}</p>
                  <p className="mt-4 text-xs text-[color:var(--muted)]">
                    Provider: {matchResponse.provider} / {matchResponse.model}
                  </p>
                </div>
              </section>
              <SkillList title="Matched skills" items={matchResponse.report.matched_skills} tone="success" />
              <SkillList title="Missing skills" items={matchResponse.report.missing_skills} tone="warning" />
              <SkillList title="Bonus skills" items={matchResponse.report.bonus_skills} tone="neutral" />
            </>
          ) : (
            <section className="rounded-lg border border-dashed border-[color:var(--line)] bg-white/70 p-6">
              <h2 className="text-lg font-semibold">Result</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                Match report appears here after analysis. Configure one AI provider key before using the API.
              </p>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
