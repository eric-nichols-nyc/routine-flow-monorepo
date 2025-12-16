interface CircularCountdownProps {
  progress: number;
  overtime: boolean;
  hasDuration: boolean;
}

export function CircularCountdown({
  progress,
  overtime,
  hasDuration,
}: CircularCountdownProps) {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = hasDuration ? Math.min(Math.max(progress, 0), 1) : 0;
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <svg className="h-full w-full" viewBox="0 0 260 260" aria-hidden="true">
      <g transform="rotate(-90 130 130)">
        <circle
          className="text-muted stroke-12"
          stroke="currentColor"
          fill="transparent"
          strokeWidth="16"
          cx="130"
          cy="130"
          r={radius}
          opacity={0.3}
        />
        <circle
          className={`stroke-16 transition-[stroke-dashoffset] duration-300 ${
            overtime ? "text-destructive" : "text-primary"
          }`}
          stroke="currentColor"
          fill="transparent"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          cx="130"
          cy="130"
          r={radius}
        />
      </g>
    </svg>
  );
}

