"use client";

import { useLayoutEffect, useRef } from "react";

export function useNavHeaderHeight() {
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const set = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };

    set();

    const ro = new ResizeObserver(set);
    ro.observe(el);

    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
  }, []);

  return headerRef;
}

