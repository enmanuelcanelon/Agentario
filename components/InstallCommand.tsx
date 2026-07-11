"use client";

import { useState } from "react";

export const INSTALL_COMMAND =
  "git clone https://github.com/enmanuelcanelon/Agentario.git";

const SETUP_LINES = [
  { text: "git clone https://github.com/enmanuelcanelon/Agentario.git" },
  { text: "cd Agentario" },
  { text: "npm install" },
  { text: "npx agentario" },
] as const;

type InstallCommandProps = {
  title: string;
  hint: string;
  copyLabel: string;
  copiedLabel: string;
};

export function InstallCommand({
  title,
  hint,
  copyLabel,
  copiedLabel,
}: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="install">
      <div className="install__window">
        <div className="install__chrome">
          <div className="install__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="install__title">{title}</p>
          <button
            type="button"
            className="install__copy"
            onClick={handleCopy}
            aria-label={copied ? copiedLabel : copyLabel}
            title={copied ? copiedLabel : copyLabel}
          >
            {copied ? (
              <span className="install__copied">{copiedLabel}</span>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            )}
          </button>
        </div>

        <div className="install__body">
          {SETUP_LINES.map((line) => (
            <p key={line.text} className="install__line">
              <span className="install__prompt">$</span>
              <span className="install__text">
                {line.text.startsWith("git clone") ? (
                  <>
                    <span className="install__cmd">git clone</span>{" "}
                    <span className="install__url">
                      https://github.com/enmanuelcanelon/Agentario.git
                    </span>
                  </>
                ) : line.text === "npx agentario" ? (
                  <>
                    <span className="install__cmd">npx</span>{" "}
                    <span className="install__accent">agentario</span>
                  </>
                ) : line.text.startsWith("npm run") ? (
                  <>
                    <span className="install__cmd">npm run</span>{" "}
                    <span className="install__accent">agentario</span>
                  </>
                ) : (
                  <span className="install__cmd">{line.text}</span>
                )}
              </span>
            </p>
          ))}
        </div>
      </div>
      <p className="install__hint">{hint}</p>
    </div>
  );
}
