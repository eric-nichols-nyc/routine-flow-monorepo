import Link from "next/link";
import { docs, categories } from "@/content/docs";
import { FileText, ArrowRight, FlaskConical } from "lucide-react";

export default function DocsIndex() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-3">Documentation</h1>
        <p className="text-zinc-400">
          Deep dives into the concepts demonstrated in each lab.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3 px-1">
            {category}
          </h2>
          <div className="space-y-2">
            {docs
              .filter((doc) => doc.category === category)
              .map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
                >
                  <div className="p-2 rounded-lg bg-zinc-800 text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-100 flex items-center gap-2">
                      {doc.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-teal-400" />
                    </h3>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {doc.description}
                    </p>
                    {doc.relatedLab && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-600">
                        <FlaskConical className="w-3 h-3" />
                        <span>Related lab available</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}

      <div className="mt-10 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
        <p className="text-sm text-zinc-500">
          💡 Each doc links to its related lab where you can see the concept in
          action.
        </p>
      </div>
    </div>
  );
}
