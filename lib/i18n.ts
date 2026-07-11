export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

type Dictionary = {
  metaTitle: string;
  metaDescription: string;
  navExplore: string;
  navAria: string;
  heroTagline: string;
  heroCta: string;
  installTitle: string;
  installHint: string;
  catalogTitle: string;
  catalogSubtitle: string;
  catalogMetaTitle: string;
  catalogMetaDescription: string;
  searchLabel: string;
  searchPlaceholder: string;
  filterType: string;
  filterCategory: string;
  filterTypeAria: string;
  filterCategoryAria: string;
  allTypes: string;
  allCategories: string;
  agentCountOne: string;
  agentCountMany: string;
  emptyState: string;
  backToCatalog: string;
  howToUse: string;
  content: string;
  source: string;
  copy: string;
  copied: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
  agentNotFound: string;
};

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    metaTitle: "Agentario — Librería de agentes de IA",
    metaDescription:
      "Catálogo para descubrir, filtrar y copiar prompts, skills, bots y workflows de IA.",
    navExplore: "Explorar",
    navAria: "Principal",
    heroTagline:
      "Librería de agentes de IA para descubrir, filtrar y copiar prompts, skills, bots y workflows.",
    heroCta: "Explorar agentes",
    installTitle: "Descárgalo en la terminal",
    installHint: "Copia el clone. Luego: cd Agentario → npm install → npx agentario",
    catalogTitle: "Explorar agentes",
    catalogSubtitle: "Busca por nombre o tags y filtra por tipo o categoría.",
    catalogMetaTitle: "Explorar agentes",
    catalogMetaDescription:
      "Busca y filtra prompts, skills, bots y workflows de la librería Agentario.",
    searchLabel: "Buscar agentes",
    searchPlaceholder: "Buscar por nombre, resumen o tags…",
    filterType: "Tipo",
    filterCategory: "Categoría",
    filterTypeAria: "Filtrar por tipo",
    filterCategoryAria: "Filtrar por categoría",
    allTypes: "Todos",
    allCategories: "Todas",
    agentCountOne: "agente",
    agentCountMany: "agentes",
    emptyState:
      "No hay agentes que coincidan con tu búsqueda. Prueba otro término o quita filtros.",
    backToCatalog: "← Volver al catálogo",
    howToUse: "Cómo usarlo",
    content: "Contenido",
    source: "Fuente",
    copy: "Copiar",
    copied: "Copiado",
    notFoundTitle: "No encontrado",
    notFoundBody: "Ese agente no existe en la librería.",
    notFoundCta: "Volver al catálogo",
    agentNotFound: "Agente no encontrado",
  },
  en: {
    metaTitle: "Agentario — AI agent library",
    metaDescription:
      "A catalog to discover, filter, and copy AI prompts, skills, bots, and workflows.",
    navExplore: "Explore",
    navAria: "Main",
    heroTagline:
      "An AI agent library to discover, filter, and copy prompts, skills, bots, and workflows.",
    heroCta: "Explore agents",
    installTitle: "Download it in the terminal",
    installHint: "Copy the clone. Then: cd Agentario → npm install → npx agentario",
    catalogTitle: "Explore agents",
    catalogSubtitle: "Search by name or tags and filter by type or category.",
    catalogMetaTitle: "Explore agents",
    catalogMetaDescription:
      "Search and filter prompts, skills, bots, and workflows in the Agentario library.",
    searchLabel: "Search agents",
    searchPlaceholder: "Search by name, summary, or tags…",
    filterType: "Type",
    filterCategory: "Category",
    filterTypeAria: "Filter by type",
    filterCategoryAria: "Filter by category",
    allTypes: "All",
    allCategories: "All",
    agentCountOne: "agent",
    agentCountMany: "agents",
    emptyState:
      "No agents match your search. Try another term or clear filters.",
    backToCatalog: "← Back to catalog",
    howToUse: "How to use it",
    content: "Content",
    source: "Source",
    copy: "Copy",
    copied: "Copied",
    notFoundTitle: "Not found",
    notFoundBody: "That agent is not in the library.",
    notFoundCta: "Back to catalog",
    agentNotFound: "Agent not found",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type CategoryKey =
  | "writing"
  | "productivity"
  | "research"
  | "code"
  | "quality"
  | "analysis"
  | "marketing"
  | "product"
  | "languages"
  | "education"
  | "support"
  | "ai";

export const categoryLabels: Record<Locale, Record<CategoryKey, string>> = {
  es: {
    writing: "Escritura",
    productivity: "Productividad",
    research: "Investigación",
    code: "Código",
    quality: "Calidad",
    analysis: "Análisis",
    marketing: "Marketing",
    product: "Producto",
    languages: "Idiomas",
    education: "Educación",
    support: "Soporte",
    ai: "IA",
  },
  en: {
    writing: "Writing",
    productivity: "Productivity",
    research: "Research",
    code: "Code",
    quality: "Quality",
    analysis: "Analysis",
    marketing: "Marketing",
    product: "Product",
    languages: "Languages",
    education: "Education",
    support: "Support",
    ai: "AI",
  },
};

export function getCategoryLabel(locale: Locale, key: CategoryKey): string {
  return categoryLabels[locale][key];
}
