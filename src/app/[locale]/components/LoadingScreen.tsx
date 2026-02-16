"use client";

import styles from "../../styles/loadingScreen.module.css";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "fc_intro_seen";

export default function LoadingScreen() {
  const [hasSeen, setHasSeen] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  });

  const [visible, setVisible] = useState(!hasSeen);
  const [isBlue, setIsBlue] = useState(false);
  const [fadePortfolio, setFadePortfolio] = useState(false);
  const [fadeFernando, setFadeFernando] = useState(false);
  const [fadeScreen, setFadeScreen] = useState(false);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (hasSeen) return;

    setVisible(true);
    setIsBlue(false);
    setFadePortfolio(false);
    setFadeFernando(false);
    setFadeScreen(false);

    const t1 = window.setTimeout(() => setIsBlue(true), 500);
    const t2 = window.setTimeout(() => setFadePortfolio(true), 1500);
    const t3 = window.setTimeout(() => setFadeFernando(true), 2500);
    const t4 = window.setTimeout(() => setFadeScreen(true), 3500);

    const t5 = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setHasSeen(true);
      setVisible(false);
    }, 4500);

    timersRef.current = [t1, t2, t3, t4, t5];

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [hasSeen]);

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
