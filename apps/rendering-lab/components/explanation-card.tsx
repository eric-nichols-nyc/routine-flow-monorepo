import type { LucideIcon } from "lucide-react";

interface ExplanationCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  color?: "emerald" | "blue" | "amber" | "rose" | "violet" | "cyan";
}

const colorClasses = {
  emerald: "border-emerald-500/30 bg-emerald-500/5",
  blue: "border-blue-500/30 bg-blue-500/5",
  amber: "border-amber-500/30 bg-amber-500/5",
  rose: "border-rose-500/30 bg-rose-500/5",
  violet: "border-violet-500/30 bg-violet-500/5",
  cyan: "border-cyan-500/30 bg-cyan-500/5",
};

const iconColorClasses = {
  emerald: "text-emerald-400",
  blue: "text-blue-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  violet: "text-violet-400",
  cyan: "text-cyan-400",
};

export function ExplanationCard({
  title,
  icon: Icon,
  children,
  color = "emerald",
}: ExplanationCardProps) {
  return (
    <div className={`p-5 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
        <h3 className="font-semibold text-zinc-100">{title}</h3>
      </div>
      <div className="text-sm text-zinc-400 space-y-2">{children}</div>
    </div>
  );
}
