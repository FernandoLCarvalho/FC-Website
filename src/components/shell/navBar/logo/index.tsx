import Image from "next/image";
import styles from "../styles.module.css";

export default function NavBarLogo() {
  return (
    <div className={styles.logoWrapper}>
      <Image
        src="/Logo.svg"
        alt="Logo"
        width={50}
        height={50}
        className={styles.logo}
        loading="lazy"
      />
    </div>
  );
}
