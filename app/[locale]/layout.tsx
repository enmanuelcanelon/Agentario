import { notFound } from "next/navigation";
import { DocumentLang } from "@/components/DocumentLang";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getDictionary,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const t = getDictionary(raw);
  return {
    title: {
      default: t.metaTitle,
      template: "%s · Agentario",
    },
    description: t.metaDescription,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;

  return (
    <>
      <DocumentLang locale={locale} />
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
    </>
  );
}
