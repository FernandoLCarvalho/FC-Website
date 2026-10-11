"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_STORAGE_KEY = "fc_intro_seen";
// Keep in sync with the inline CSS failsafe in the locale layout.
const INTRO_FAILSAFE_MS = 6000;

const INTRO_TIMINGS_MS = {
  highlightPortfolio: 500,
  hidePortfolio: 1500,
  hideBrandName: 2500,
  fadeOverlay: 3500,
  completeIntro: 4500,
};

export function useSessionIntro() {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isPortfolioHighlighted, setIsPortfolioHighlighted] = useState(false);
  const [hidePortfolio, setHidePortfolio] = useState(false);
  const [hideBrandName, setHideBrandName] = useState(false);
  const [fadeOverlay, setFadeOverlay] = useState(false);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const completeIntro = () => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        /* Completion does not depend on storage. */
      }
      setHasSeenIntro(true);
      setVisible(false);
    };

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

    // The CSS fallback may already have released the page. Never replay it.
    if (performance.now() >= INTRO_FAILSAFE_MS) {
      completeIntro();
      return;
    }

    // Take over the failsafe before making the page inert. Both are owned by
    // this effect so late hydration cannot hide the overlay over an inert page.
    const overlay = document.querySelector("[data-intro-overlay]");
    overlay?.setAttribute("data-intro-controlled", "");
    const main = document.querySelector("main");
    const previousInert = main?.inert ?? false;
    if (main) main.inert = true;

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
      if (main) main.inert = previousInert;
      completeIntro();
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
      if (main) main.inert = previousInert;
      overlay?.removeAttribute("data-intro-controlled");
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
