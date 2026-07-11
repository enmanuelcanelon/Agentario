"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

type DocumentLangProps = {
  locale: Locale;
};

export function DocumentLang({ locale }: DocumentLangProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
