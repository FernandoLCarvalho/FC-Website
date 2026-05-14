"use client";

import { useEffect } from "react";
import styles from "./styles.module.css";

export default function Footer() {
  useEffect(() => {
    document.documentElement.style.setProperty("--footer-h", "32px");
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.text}>© {year} Fernando L. Carvalho</span>
    </footer>
  );
}
