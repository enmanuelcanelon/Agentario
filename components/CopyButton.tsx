"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label: string;
  copiedLabel: string;
};

export function CopyButton({ text, label, copiedLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="copy-button"
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
