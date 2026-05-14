import styles from "./styles.module.css";

interface ILoadingScreenProps {
  visible: boolean;
  isBlue: boolean;
  fadePortfolio: boolean;
  fadeFernando: boolean;
  fadeScreen: boolean;
}

export default function LoadingScreen({
  visible,
  isBlue,
  fadePortfolio,
  fadeFernando,
  fadeScreen,
}: ILoadingScreenProps) {
  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${
        fadeScreen ? styles.overlayHidden : styles.overlayVisible
      }`}
    >
      <h1
        className={`${styles.brandName} ${
          fadeFernando ? styles.textHidden : styles.textVisible
        }`}
      >
        Fernando Carvalho
      </h1>

      <div className={styles.wordGroup}>
        <h1
          className={`${styles.portfolioName} ${
            isBlue ? styles.portfolioNameBlue : styles.portfolioNameWhite
          } ${fadePortfolio ? styles.textHidden : styles.textVisible}`}
        >
          Portfolio
        </h1>

        <div className={styles.loadingDot} />
      </div>
    </div>
  );
}
