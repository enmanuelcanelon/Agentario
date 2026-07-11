import Link from "next/link";
import type { LocalizedAgent } from "@/lib/agents";
import { getTypeLabel } from "@/lib/agents";
import type { Locale } from "@/lib/i18n";

type AgentRowProps = {
  agent: LocalizedAgent;
  locale: Locale;
};

export function AgentRow({ agent, locale }: AgentRowProps) {
  return (
    <li className="agent-row">
      <Link
        href={`/${locale}/agentes/${agent.slug}`}
        className="agent-row__link"
      >
        <div className="agent-row__meta">
          <span className="type-pill">{getTypeLabel(agent.type)}</span>
          <span className="agent-row__categories">
            {agent.categories.join(" · ")}
          </span>
        </div>
        <h2 className="agent-row__title">{agent.name}</h2>
        <p className="agent-row__summary">{agent.summary}</p>
      </Link>
    </li>
  );
}
