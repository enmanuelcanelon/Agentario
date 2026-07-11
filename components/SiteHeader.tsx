import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = getDictionary(locale);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={`/${locale}`} className="site-logo">
          Agentario
        </Link>
        <div className="site-header__actions">
          <nav className="site-nav" aria-label={t.navAria}>
            <Link href={`/${locale}/agentes`}>{t.navExplore}</Link>
          </nav>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
