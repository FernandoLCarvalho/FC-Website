import styles from "./styles.module.css";

interface ILoadingScreenProps {
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
}: ILoadingScreenProps) {
  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${
        fadeOverlay ? styles.overlayHidden : styles.overlayVisible
      }`}
    >
      <h1
        className={`${styles.brandName} ${
          hideBrandName ? styles.textHidden : styles.textVisible
        }`}
      >
        Fernando Carvalho
      </h1>

      <div className={styles.wordGroup}>
        <h1
          className={`${styles.portfolioName} ${
            isPortfolioHighlighted
              ? styles.portfolioNameBlue
              : styles.portfolioNameWhite
          } ${hidePortfolio ? styles.textHidden : styles.textVisible}`}
        >
          Portfolio
        </h1>

        <div className={styles.loadingDot} />
      </div>
    </div>
  );
}
