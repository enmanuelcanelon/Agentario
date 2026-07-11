import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AgentFilters } from "@/components/AgentFilters";
import { AgentList } from "@/components/AgentList";
import { AgentSearch } from "@/components/AgentSearch";
import type { AgentType } from "@/data/agents";
import { filterAgents, getAllCategories } from "@/lib/agents";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type AgentesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    tipo?: string;
    categoria?: string;
  }>;
};

const VALID_TYPES = new Set(["prompt", "skill", "bot", "workflow"]);

export async function generateMetadata({ params }: AgentesPageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const t = getDictionary(raw);
  return {
    title: t.catalogMetaTitle,
    description: t.catalogMetaDescription,
  };
}

export default async function AgentesPage({
  params,
  searchParams,
}: AgentesPageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const queryParams = await searchParams;
  const query = queryParams.q ?? "";
  const typeParam = queryParams.tipo ?? "all";
  const category = queryParams.categoria ?? "all";
  const type = (
    VALID_TYPES.has(typeParam) ? typeParam : "all"
  ) as AgentType | "all";

  const categories = getAllCategories(locale);
  const results = filterAgents({ query, type, category, locale });
  const countLabel =
    results.length === 1 ? t.agentCountOne : t.agentCountMany;

  return (
    <section className="catalog">
      <header className="catalog__header">
        <h1 className="catalog__title">{t.catalogTitle}</h1>
        <p className="catalog__subtitle">{t.catalogSubtitle}</p>
      </header>

      <div className="catalog__controls">
        <Suspense fallback={null}>
          <AgentSearch
            initialQuery={query}
            locale={locale}
            label={t.searchLabel}
            placeholder={t.searchPlaceholder}
          />
          <AgentFilters
            categories={categories}
            currentType={type}
            currentCategory={category}
            locale={locale}
            typeLabel={t.filterType}
            categoryLabel={t.filterCategory}
            typeAria={t.filterTypeAria}
            categoryAria={t.filterCategoryAria}
            allTypes={t.allTypes}
            allCategories={t.allCategories}
          />
        </Suspense>
      </div>

      <p className="catalog__count">
        {results.length} {countLabel}
      </p>

      <AgentList
        agents={results}
        locale={locale}
        emptyState={t.emptyState}
      />
    </section>
  );
}
