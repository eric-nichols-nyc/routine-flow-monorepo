import { Server, Monitor, Clock, Zap } from "lucide-react";

interface RenderInfoProps {
  title: string;
  renderTime: string;
  renderLocation: "server" | "client" | "build" | "edge";
  description: string;
  color?: string;
}

const locationConfig = {
  server: {
    icon: Server,
    label: "Server",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
  },
  client: {
    icon: Monitor,
    label: "Client (Browser)",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    dotColor: "bg-blue-400",
  },
  build: {
    icon: Zap,
    label: "Build Time",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    dotColor: "bg-amber-400",
  },
  edge: {
    icon: Zap,
    label: "Edge Runtime",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    textColor: "text-violet-400",
    dotColor: "bg-violet-400",
  },
};

export function RenderInfo({
  title,
  renderTime,
  renderLocation,
  description,
}: RenderInfoProps) {
  const config = locationConfig[renderLocation];
  const Icon = config.icon;

  return (
    <div
      className={`p-6 rounded-2xl border ${config.bgColor} ${config.borderColor} mb-8`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-zinc-900/50 ${config.textColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">{title}</h2>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              Render Time
            </span>
          </div>
          <code className={`text-sm font-mono ${config.textColor}`}>
            {renderTime}
          </code>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              Rendered On
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`}
            />
            <span className={`text-sm font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
