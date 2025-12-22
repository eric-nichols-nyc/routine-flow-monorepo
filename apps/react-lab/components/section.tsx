import type { LucideIcon } from "lucide-react";

interface SectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  color?: "blue" | "emerald" | "amber" | "rose" | "violet" | "cyan";
}

const colorClasses = {
  blue: "from-blue-500/10 to-transparent border-blue-500/20",
  emerald: "from-emerald-500/10 to-transparent border-emerald-500/20",
  amber: "from-amber-500/10 to-transparent border-amber-500/20",
  rose: "from-rose-500/10 to-transparent border-rose-500/20",
  violet: "from-violet-500/10 to-transparent border-violet-500/20",
  cyan: "from-cyan-500/10 to-transparent border-cyan-500/20",
};

const iconColors = {
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  violet: "text-violet-400",
  cyan: "text-cyan-400",
};

export function Section({
  title,
  icon: Icon,
  children,
  color = "rose",
}: SectionProps) {
  return (
    <div
      className={`p-6 rounded-2xl bg-gradient-to-br border ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className={`w-5 h-5 ${iconColors[color]}`} />}
        <h3 className="font-semibold text-zinc-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}
