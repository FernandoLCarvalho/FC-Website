import styles from "./styles.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.text}>© {year} Fernando L. Carvalho</span>
    </footer>
  );
}
