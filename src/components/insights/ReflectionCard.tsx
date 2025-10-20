"use client";

import { format } from "date-fns";

interface Reflection {
  id: string;
  title: string;
  content: string;
  reflection_type: "weekly" | "monthly" | "custom";
  period_start: string;
  period_end: string;
  entry_count: number;
  themes: string[];
  insights: string[];
  created_at: string;
}

interface ReflectionCardProps {
  reflection: Reflection;
}

export default function ReflectionCard({ reflection }: ReflectionCardProps) {
  const periodLabel =
    reflection.reflection_type === "weekly" ? "Weekly" : "Monthly";

  return (
    <div className="border border-[rgba(247,247,255,0.1)] p-6 transition-colors hover:border-[rgba(247,247,255,0.2)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl">{reflection.title}</h3>
          <span className="text-sm opacity-60 whitespace-nowrap">
            {periodLabel}
          </span>
        </div>
        <p className="text-sm opacity-60">
          {format(new Date(reflection.period_start), "MMM d")} -{" "}
          {format(new Date(reflection.period_end), "MMM d, yyyy")}
        </p>
        <p className="text-sm opacity-60 mt-1">
          {reflection.entry_count}{" "}
          {reflection.entry_count === 1 ? "entry" : "entries"}
        </p>
      </div>

      {/* Themes */}
      {reflection.themes && reflection.themes.length > 0 && (
        <div className="mb-4">
          <p className="text-sm opacity-60 mb-2">Themes</p>
          <div className="flex flex-wrap gap-2">
            {reflection.themes.map((theme, index) => (
              <span
                key={index}
                className="text-base px-3 py-1 border border-[rgba(247,247,255,0.1)]"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <p className="text-base leading-relaxed whitespace-pre-line">
          {reflection.content}
        </p>
      </div>

      {/* Insights */}
      {reflection.insights && reflection.insights.length > 0 && (
        <div>
          <p className="text-sm opacity-60 mb-2">Key Insights</p>
          <ul className="space-y-2">
            {reflection.insights.map((insight, index) => (
              <li key={index} className="text-base opacity-80">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
