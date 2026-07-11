import type { LocalizedAgent } from "@/lib/agents";
import { AgentRow } from "@/components/AgentRow";
import type { Locale } from "@/lib/i18n";

type AgentListProps = {
  agents: LocalizedAgent[];
  locale: Locale;
  emptyState: string;
};

export function AgentList({ agents, locale, emptyState }: AgentListProps) {
  if (agents.length === 0) {
    return <p className="empty-state">{emptyState}</p>;
  }

  return (
    <ul className="agent-list">
      {agents.map((agent) => (
        <AgentRow key={agent.id} agent={agent} locale={locale} />
      ))}
    </ul>
  );
}
