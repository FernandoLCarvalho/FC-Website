import { useEffect, useRef } from "react";

/** The pointer-blocking drawer is modal: contain focus, suspend background, restore on exit. */
export function useMobileMenuFocus(
  open: boolean,
  rendered: boolean,
  onClose: () => void,
) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!open || !rendered || !drawer) return;
    const trigger = triggerRef.current;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer, header > *"),
    ).filter(
      (element) =>
        element !== drawer &&
        !element.contains(drawer) &&
        element.id !== "asset-credits-panel" &&
        !element.hasAttribute("data-menu-backdrop"),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], select, [tabindex='0']",
        ),
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === drawer)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === drawer)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !drawer.contains(event.target))
        drawer.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open, rendered, onClose]);
  return { drawerRef, triggerRef };
}
