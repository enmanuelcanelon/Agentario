import Link from "next/link";
import { notFound } from "next/navigation";
import { InstallCommand } from "@/components/InstallCommand";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;
  const t = getDictionary(locale);

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__orb" aria-hidden="true" />
        <h1 className="hero__brand">Agentario</h1>
        <p className="hero__tagline">{t.heroTagline}</p>
        <div className="hero__actions">
          <Link href={`/${locale}/agentes`} className="hero__cta">
            {t.heroCta}
          </Link>
          <InstallCommand
            title={t.installTitle}
            hint={t.installHint}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
        </div>
      </div>
    </section>
  );
}
