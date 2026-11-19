"use client";

import { useEffect, useState } from "react";

import styles from "./ResultCard.module.css";

export default function ResultCard({ shortUrl }) {
  const [copied, setCopied] = useState(false);

  // Reset the confirmation whenever a new link is created, so the button does
  // not claim the previous link is still on the clipboard.
  useEffect(() => {
    setCopied(false);
  }, [shortUrl]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; the link is on screen and selectable.
      setCopied(false);
    }
  }

  return (
    <div className={styles.card}>
      <p className={styles.heading}>Your short link is ready</p>

      <div className={styles.row}>
        <a className={styles.link} href={shortUrl}>
          {shortUrl}
        </a>
        <button className={styles.copyButton} type="button" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
