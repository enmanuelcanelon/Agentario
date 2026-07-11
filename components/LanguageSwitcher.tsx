"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {locales.map((item) => {
        const href = pathname.replace(`/${locale}`, `/${item}`);
        const isActive = item === locale;
        return (
          <Link
            key={item}
            href={href}
            hrefLang={item}
            className={isActive ? "lang-switch__link is-active" : "lang-switch__link"}
            aria-current={isActive ? "page" : undefined}
          >
            {item.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
