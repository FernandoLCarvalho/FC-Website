"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_STORAGE_KEY = "fc_intro_seen";

const INTRO_TIMINGS_MS = {
  highlightPortfolio: 500,
  hidePortfolio: 1500,
  hideBrandName: 2500,
  fadeOverlay: 3500,
  completeIntro: 4500,
};

export function useSessionIntro() {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPortfolioHighlighted, setIsPortfolioHighlighted] = useState(false);
  const [hidePortfolio, setHidePortfolio] = useState(false);
  const [hideBrandName, setHideBrandName] = useState(false);
  const [fadeOverlay, setFadeOverlay] = useState(false);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    let introSeen = false;
    try {
      introSeen = sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
    } catch {
      /* Storage can be disabled. */
    }
    if (
      introSeen ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Read browser storage after hydration without changing the intro schedule.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasSeenIntro(true);
      setVisible(false);
      return;
    }

    if (hasSeenIntro) return;

    setVisible(true);
    setIsPortfolioHighlighted(false);
    setHidePortfolio(false);
    setHideBrandName(false);
    setFadeOverlay(false);

    const highlightPortfolioTimer = window.setTimeout(
      () => setIsPortfolioHighlighted(true),
      INTRO_TIMINGS_MS.highlightPortfolio,
    );
    const hidePortfolioTimer = window.setTimeout(
      () => setHidePortfolio(true),
      INTRO_TIMINGS_MS.hidePortfolio,
    );
    const hideBrandNameTimer = window.setTimeout(
      () => setHideBrandName(true),
      INTRO_TIMINGS_MS.hideBrandName,
    );
    const fadeOverlayTimer = window.setTimeout(
      () => setFadeOverlay(true),
      INTRO_TIMINGS_MS.fadeOverlay,
    );

    const completeIntroTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        /* Completion does not depend on storage. */
      }
      setHasSeenIntro(true);
      setVisible(false);
    }, INTRO_TIMINGS_MS.completeIntro);

    timersRef.current = [
      highlightPortfolioTimer,
      hidePortfolioTimer,
      hideBrandNameTimer,
      fadeOverlayTimer,
      completeIntroTimer,
    ];

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [hasSeenIntro]);

  return {
    visible,
    isPortfolioHighlighted,
    hidePortfolio,
    hideBrandName,
    fadeOverlay,
  };
}
