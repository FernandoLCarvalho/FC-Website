import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import { useLocale } from "next-intl";
import { action } from "storybook/actions";

// The real module is re-exported for `routing` only; its navigation helpers
// (Link/usePathname/useRouter) need a mounted Next.js app router, which the
// Storybook mock breaks on Next 16 (see `.storybook/main.ts`).
export { routing } from "../../src/i18n/routing";

interface MockRouting {
  pathname: string;
}

export const MockRoutingContext = createContext<MockRouting>({
  pathname: "/",
});

const logNavigation = action("navigate");

type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  locale?: string;
};

export function Link({ href, locale, onClick, ...props }: LinkProps) {
  const activeLocale = useLocale();
  const target = `/${locale ?? activeLocale}${href === "/" ? "" : href}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logNavigation(target);
    onClick?.(event);
  };

  return <a {...props} href={target} onClick={handleClick} />;
}

export function usePathname() {
  return useContext(MockRoutingContext).pathname;
}

export function useRouter() {
  return {
    push: (href: string, options?: { locale?: string }) =>
      logNavigation(href, options),
    replace: (href: string, options?: { locale?: string }) =>
      logNavigation(href, options),
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
}

export function redirect() {
  throw new Error("redirect() is not available in Storybook");
}
