import { Zap, Clock, Hourglass } from "lucide-react";

// Simulates a fast data fetch (500ms)
async function getFastData() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    value: Math.floor(Math.random() * 1000),
    loadedAt: new Date().toISOString(),
  };
}

// Simulates a medium data fetch (1500ms)
async function getMediumData() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    items: Math.floor(Math.random() * 50) + 10,
    loadedAt: new Date().toISOString(),
  };
}

// Simulates a slow data fetch (3000ms)
async function getSlowData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    analysis: "Complete",
    score: Math.floor(Math.random() * 100),
    loadedAt: new Date().toISOString(),
  };
}

export async function FastComponent() {
  const data = await getFastData();

  return (
    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-emerald-400" />
        <span className="text-xs text-emerald-400 font-medium">
          Fast (500ms)
        </span>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{data.value}</p>
      <p className="text-xs text-zinc-500">Quick metric</p>
      <div className="mt-3 pt-3 border-t border-emerald-500/20">
        <p className="text-xs text-zinc-600 truncate">
          Loaded: {data.loadedAt}
        </p>
      </div>
    </div>
  );
}

export async function MediumComponent() {
  const data = await getMediumData();

  return (
    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-amber-400" />
        <span className="text-xs text-amber-400 font-medium">
          Medium (1.5s)
        </span>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{data.items}</p>
      <p className="text-xs text-zinc-500">Items fetched</p>
      <div className="mt-3 pt-3 border-t border-amber-500/20">
        <p className="text-xs text-zinc-600 truncate">
          Loaded: {data.loadedAt}
        </p>
      </div>
    </div>
  );
}

export async function SlowComponent() {
  const data = await getSlowData();

  return (
    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Hourglass className="w-4 h-4 text-rose-400" />
        <span className="text-xs text-rose-400 font-medium">Slow (3s)</span>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{data.score}%</p>
      <p className="text-xs text-zinc-500">{data.analysis}</p>
      <div className="mt-3 pt-3 border-t border-rose-500/20">
        <p className="text-xs text-zinc-600 truncate">
          Loaded: {data.loadedAt}
        </p>
      </div>
    </div>
  );
}
