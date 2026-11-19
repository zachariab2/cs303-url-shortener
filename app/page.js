import ShortenForm from "./components/ShortenForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>URL Shortener</h1>
        <p className={styles.subtitle}>
          Give a long link a short name, then share it. Anyone who visits the short
          link lands on the original.
        </p>
      </header>

      <ShortenForm />
    </main>
  );
}
