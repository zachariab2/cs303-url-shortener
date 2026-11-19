import Link from "next/link";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>No link here</h1>
      <p className={styles.message}>
        That alias has not been claimed, or the link was mistyped.
      </p>
      <Link className={styles.link} href="/">
        Shorten a link
      </Link>
    </main>
  );
}
