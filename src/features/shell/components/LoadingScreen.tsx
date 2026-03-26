"use client";

import styles from "@/shell/styles/loading-screen.module.css";
import { useSessionIntro } from "@/shell/hooks/useSessionIntro";

export default function LoadingScreen() {
  const { visible, isBlue, fadePortfolio, fadeFernando, fadeScreen } =
    useSessionIntro();

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black text-white z-50 gap-4 transition-opacity duration-1000 ${
        fadeScreen ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1
        className={`text-2xl transition-opacity duration-1000 ${
          fadeFernando ? "opacity-0" : "opacity-100"
        }`}
        style={{ fontFamily: "Roboto Mono" }}
      >
        Fernando Carvalho
      </h1>

      <div className="flex items-center gap-3 h-16">
        <h1
          className={`text-2xl duration-1000 transition-colors transition-opacity ${
            isBlue ? "text-blue-300" : "text-white"
          } ${fadePortfolio ? "opacity-0" : "opacity-100"}`}
        >
          Portfolio
        </h1>

        <div
          className={`w-4 h-4 rounded-full bg-blue-300 ${styles.customBounce}`}
        />
      </div>
    </div>
  );
}
