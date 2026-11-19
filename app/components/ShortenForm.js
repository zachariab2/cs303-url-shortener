"use client";

import { useState } from "react";

import { validateAlias, validateUrl } from "@/lib/validation";
import ResultCard from "./ResultCard";
import styles from "./ShortenForm.module.css";

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState(null);
  const [shortUrl, setShortUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    // Catch the obvious problems without a round trip. The API route runs the
    // exact same validators before it will write anything.
    const clientError = validateUrl(url) ?? validateAlias(alias);
    if (clientError) {
      setError(clientError);
      setShortUrl(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), alias: alias.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setShortUrl(null);
        return;
      }

      // Built from the current origin so the link is correct in development and
      // on the deployed site without configuring a base URL in either place.
      setShortUrl(`${window.location.origin}/${data.alias}`);
      setUrl("");
      setAlias("");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setShortUrl(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.panel}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="url">
            Long URL
          </label>
          <input
            className={styles.input}
            id="url"
            name="url"
            type="url"
            placeholder="https://example.com/a/very/long/path"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="alias">
            Alias
          </label>
          <div className={styles.aliasInput}>
            <span className={styles.aliasPrefix}>/</span>
            <input
              className={styles.input}
              id="alias"
              name="alias"
              type="text"
              placeholder="my-link"
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              autoComplete="off"
              maxLength={32}
            />
          </div>
          <p className={styles.hint}>
            Letters, numbers, hyphens and underscores. Up to 32 characters.
          </p>
        </div>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Shortening…" : "Shorten link"}
        </button>
      </form>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {shortUrl ? <ResultCard shortUrl={shortUrl} /> : null}
    </section>
  );
}
