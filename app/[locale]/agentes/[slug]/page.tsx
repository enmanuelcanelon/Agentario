import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import {
  getAgentBySlug,
  getAllAgents,
  getTypeLabel,
  localizeAgent,
} from "@/lib/agents";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

type AgentDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllAgents().flatMap((agent) =>
    locales.map((locale) => ({ locale, slug: agent.slug })),
  );
}

export async function generateMetadata({ params }: AgentDetailPageProps) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const agent = getAgentBySlug(slug);
  const t = getDictionary(raw);
  if (!agent) {
    return { title: t.agentNotFound };
  }
  return {
    title: agent.name[raw],
    description: agent.summary[raw],
  };
}

export default async function AgentDetailPage({
  params,
}: AgentDetailPageProps) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;
  const t = getDictionary(locale);
  const rawAgent = getAgentBySlug(slug);

  if (!rawAgent) {
    notFound();
  }

  const agent = localizeAgent(rawAgent, locale);

  return (
    <article className="detail">
      <Link href={`/${locale}/agentes`} className="detail__back">
        {t.backToCatalog}
      </Link>

      <header className="detail__header">
        <div className="detail__meta">
          <span className="type-pill">{getTypeLabel(agent.type)}</span>
          <span className="agent-row__categories">
            {agent.categories.join(" · ")}
          </span>
        </div>
        <h1 className="detail__title">{agent.name}</h1>
        <p className="detail__lede">{agent.summary}</p>
        <ul className="detail__tags">
          {agent.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      </header>

      <section className="detail-section">
        <h2>{t.howToUse}</h2>
        <ol className="usage-list">
          {agent.usage.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="detail-section">
        <h2>{t.content}</h2>
        <div className="content-block">
          <div className="content-block__toolbar">
            <CopyButton
              text={agent.content}
              label={t.copy}
              copiedLabel={t.copied}
            />
          </div>
          <pre>{agent.content}</pre>
        </div>
      </section>

      {agent.source ? (
        <p className="detail__source">
          {t.source}:{" "}
          {agent.source.startsWith("http") ? (
            <a href={agent.source} target="_blank" rel="noopener noreferrer">
              {agent.source}
            </a>
          ) : (
            agent.source
          )}
        </p>
      ) : null}
    </article>
  );
}
