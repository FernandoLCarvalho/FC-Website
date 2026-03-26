"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "fc_intro_seen";

export function useSessionIntro() {
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

  return { visible, isBlue, fadePortfolio, fadeFernando, fadeScreen };
}
