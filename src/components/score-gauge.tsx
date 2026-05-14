type ScoreGaugeProps = {
  score: number;
};

function scoreLabel(score: number): string {
  if (score >= 70) {
    return "Strong fit";
  }

  if (score >= 50) {
    return "Decent fit";
  }

  return "Weak fit";
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-28 w-28 shrink-0">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100" role="img" aria-label={`Match score ${score}%`}>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#d9ded5" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#0f766e"
            strokeLinecap="round"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
          {score}%
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-[color:var(--muted)]">Match</p>
        <p className="mt-1 text-3xl font-semibold">{scoreLabel(score)}</p>
      </div>
    </div>
  );
}
