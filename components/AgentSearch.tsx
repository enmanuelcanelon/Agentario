"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n";

type AgentSearchProps = {
  initialQuery: string;
  locale: Locale;
  label: string;
  placeholder: string;
};

export function AgentSearch({
  initialQuery,
  locale,
  label,
  placeholder,
}: AgentSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateQuery(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`/${locale}/agentes?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  return (
    <label className="search-field">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        name="q"
        defaultValue={initialQuery}
        placeholder={placeholder}
        onChange={(event) => updateQuery(event.target.value)}
        className="search-input"
        autoComplete="off"
      />
    </label>
  );
}
