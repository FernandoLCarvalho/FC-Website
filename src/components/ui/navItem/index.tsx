import { Link } from "@/i18n/routing";
import styles from "./styles.module.css";

type NavItemBase = {
  id: string;
  label: string;
  variant: "desktop" | "mobile";
  /** Called after activating either a link or an action (e.g. close the drawer). */
  onActivate?: () => void;
};
export type NavItemProps = NavItemBase &
  (
    | { href: string; onClick?: never; expanded?: never; controls?: never }
    | {
        href?: never;
        onClick: () => void;
        expanded?: boolean;
        controls?: string;
      }
  );

export default function NavItem({
  id,
  label,
  variant,
  onActivate,
  ...item
}: NavItemProps) {
  if (item.href !== undefined) {
    return (
      <Link
        href={item.href}
        data-nav-item-id={id}
        className={styles[`${variant}Link`]}
        onClick={onActivate}
      >
        {label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      data-nav-item-id={id}
      className={styles[`${variant}Button`]}
      aria-expanded={item.expanded}
      aria-controls={item.controls}
      onClick={() => {
        item.onClick();
        onActivate?.();
      }}
    >
      {label}
    </button>
  );
}
