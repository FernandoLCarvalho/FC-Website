import styles from "./styles.module.css";

export interface LoadingScreenProps {
  visible: boolean;
  isPortfolioHighlighted: boolean;
  hidePortfolio: boolean;
  hideBrandName: boolean;
  fadeOverlay: boolean;
}

export default function LoadingScreen({
  visible,
  isPortfolioHighlighted,
  hidePortfolio,
  hideBrandName,
  fadeOverlay,
}: LoadingScreenProps) {
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`${styles.overlay} ${
        fadeOverlay ? styles.overlayHidden : styles.overlayVisible
      }`}
    >
      <p
        className={`${styles.brandName} ${
          hideBrandName ? styles.textHidden : styles.textVisible
        }`}
      >
        Fernando Carvalho
      </p>

      <div className={styles.wordGroup}>
        <p
          className={`${styles.portfolioName} ${
            isPortfolioHighlighted
              ? styles.portfolioNameBlue
              : styles.portfolioNameWhite
          } ${hidePortfolio ? styles.textHidden : styles.textVisible}`}
        >
          Portfolio
        </p>

        <div className={styles.loadingDot} />
      </div>
    </div>
  );
}
