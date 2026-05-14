"use client";

import { useLayoutEffect, useRef } from "react";

export function useNavHeaderHeight() {
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeaderHeightVariable = () => {
      const height = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--nav-h", `${height}px`);
    };

    syncHeaderHeightVariable();

    const ro = new ResizeObserver(syncHeaderHeightVariable);
    ro.observe(el);

    window.addEventListener("resize", syncHeaderHeightVariable);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncHeaderHeightVariable);
    };
  }, []);

  return headerRef;
}
