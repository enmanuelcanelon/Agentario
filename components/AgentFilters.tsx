"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { AGENT_TYPES, type AgentType } from "@/data/agents";
import type { Locale } from "@/lib/i18n";

type AgentFiltersProps = {
  categories: string[];
  currentType: AgentType | "all";
  currentCategory: string;
  locale: Locale;
  typeLabel: string;
  categoryLabel: string;
  typeAria: string;
  categoryAria: string;
  allTypes: string;
  allCategories: string;
};

export function AgentFilters({
  categories,
  currentType,
  currentCategory,
  locale,
  typeLabel,
  categoryLabel,
  typeAria,
  categoryAria,
  allTypes,
  allCategories,
}: AgentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.replace(`/${locale}/agentes?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  return (
    <div className="filters">
      <div className="filter-group">
        <p className="filter-label">{typeLabel}</p>
        <div className="filter-options" role="group" aria-label={typeAria}>
          <button
            type="button"
            className={
              currentType === "all" ? "filter-chip is-active" : "filter-chip"
            }
            onClick={() => setParam("tipo", "all")}
          >
            {allTypes}
          </button>
          {AGENT_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                currentType === item.value
                  ? "filter-chip is-active"
                  : "filter-chip"
              }
              onClick={() => setParam("tipo", item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-label">{categoryLabel}</p>
        <div className="filter-options" role="group" aria-label={categoryAria}>
          <button
            type="button"
            className={
              currentCategory === "all"
                ? "filter-chip is-active"
                : "filter-chip"
            }
            onClick={() => setParam("categoria", "all")}
          >
            {allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                currentCategory === category
                  ? "filter-chip is-active"
                  : "filter-chip"
              }
              onClick={() => setParam("categoria", category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
