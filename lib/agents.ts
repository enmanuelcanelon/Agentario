import { agents, type Agent, type AgentType } from "@/data/agents";
import {
  getCategoryLabel,
  type CategoryKey,
  type Locale,
} from "@/lib/i18n";

export type LocalizedAgent = {
  id: string;
  slug: string;
  type: AgentType;
  name: string;
  summary: string;
  categories: string[];
  categoryKeys: CategoryKey[];
  tags: string[];
  content: string;
  usage: string[];
  source?: string;
};

export type AgentFilters = {
  query?: string;
  type?: AgentType | "all";
  category?: string | "all";
  locale: Locale;
};

export function getAllAgents(): Agent[] {
  return agents;
}

export function getAgentBySlug(slug: string): Agent | undefined {
  return agents.find((agent) => agent.slug === slug);
}

export function localizeAgent(agent: Agent, locale: Locale): LocalizedAgent {
  return {
    id: agent.id,
    slug: agent.slug,
    type: agent.type,
    name: agent.name[locale],
    summary: agent.summary[locale],
    categoryKeys: agent.categories,
    categories: agent.categories.map((key) => getCategoryLabel(locale, key)),
    tags: agent.tags[locale],
    content: agent.content[locale],
    usage: agent.usage[locale],
    source: agent.source,
  };
}

export function getAllCategories(locale: Locale): string[] {
  const set = new Set<string>();
  for (const agent of agents) {
    for (const key of agent.categories) {
      set.add(getCategoryLabel(locale, key));
    }
  }
  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, locale === "es" ? "es" : "en"),
  );
}

export function filterAgents({
  query = "",
  type = "all",
  category = "all",
  locale,
}: AgentFilters): LocalizedAgent[] {
  const normalizedQuery = query.trim().toLowerCase();

  return agents
    .filter((agent) => {
      if (type !== "all" && agent.type !== type) {
        return false;
      }

      const localizedCategories = agent.categories.map((key) =>
        getCategoryLabel(locale, key),
      );

      if (category !== "all" && !localizedCategories.includes(category)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const localized = localizeAgent(agent, locale);
      const haystack = [
        localized.name,
        localized.summary,
        localized.type,
        ...localized.categories,
        ...localized.tags,
        agent.name.es,
        agent.name.en,
        ...agent.tags.es,
        ...agent.tags.en,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .map((agent) => localizeAgent(agent, locale));
}

export function getTypeLabel(type: AgentType): string {
  const labels: Record<AgentType, string> = {
    prompt: "Prompt",
    skill: "Skill",
    bot: "Bot",
    workflow: "Workflow",
  };
  return labels[type];
}
