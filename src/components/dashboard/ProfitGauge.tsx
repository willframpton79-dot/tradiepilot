'use client';

interface ProfitGaugeProps {
  margin: number;
  targetMarginPct?: number;
}

export default function ProfitGauge({ margin, targetMarginPct = 30 }: ProfitGaugeProps) {
  const percentage = Math.max(0, Math.min(100, margin * 100));
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  // At target margin → ~67% fill (looks healthy); at 1.5× target → full arc
  const fillRatio = Math.min(percentage / (targetMarginPct * 1.5), 1);
  const offset = circumference - fillRatio * circumference;

  let color = "#22c55e"; // green
  if (margin < 0.2) color = "#ef4444"; // red
  else if (margin < 0.3) color = "#f59e0b"; // amber

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{percentage.toFixed(0)}%</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Margin</span>
      </div>
    </div>
  );
}
