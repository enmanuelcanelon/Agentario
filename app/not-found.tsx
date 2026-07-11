import Link from "next/link";
import { getDictionary, defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary(defaultLocale);

  return (
    <section className="catalog">
      <h1 className="catalog__title">{t.notFoundTitle}</h1>
      <p className="catalog__subtitle">{t.notFoundBody}</p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link href={`/${defaultLocale}/agentes`} className="hero__cta">
          {t.notFoundCta}
        </Link>
      </p>
    </section>
  );
}
