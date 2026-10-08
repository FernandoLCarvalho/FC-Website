import { useEffect, useRef } from "react";

const PAGE_SCROLL_MEDIA_QUERY =
  "(orientation: landscape) and (max-height: 560px) and (pointer: coarse)";

/** Forward contact-button wheel gestures to the scene, except touch landscape scrolling. */
export function useContactWheelForwarding() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onWheel = (event: WheelEvent) => {
      if (window.matchMedia(PAGE_SCROLL_MEDIA_QUERY).matches) return;
      if (!(event.target instanceof Element) || !event.target.closest("button"))
        return;
      const canvas = section.querySelector("canvas");
      if (!canvas) return;
      event.preventDefault();
      canvas.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY,
          ctrlKey: event.ctrlKey,
          deltaMode: event.deltaMode,
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          deltaZ: event.deltaZ,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
        }),
      );
    };
    // React's delegated wheel listener is passive; cancellation needs a native listener.
    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, []);
  return sectionRef;
}
