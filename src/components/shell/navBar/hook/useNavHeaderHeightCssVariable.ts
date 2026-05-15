"use client";

import { useLayoutEffect, useRef } from "react";

const NAV_HEADER_HEIGHT_CSS_VARIABLE = "--nav-h";

export function useNavHeaderHeightCssVariable() {
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeaderHeightVariable = () => {
      const height = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        NAV_HEADER_HEIGHT_CSS_VARIABLE,
        `${height}px`,
      );
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
