import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
import type { ReactNode } from "react";
import buttonStyles from "../button/styles.module.css";

export type ExternalLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  appearance: "credit" | "action";
  startIcon?: ReactNode;
};
/** Opens outbound destinations with opener protection by default. */
export default function ExternalLink({
  appearance,
  startIcon,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: ExternalLinkProps) {
  const appearanceClass =
    appearance === "action"
      ? `${buttonStyles.contact} ${styles.action}`
      : `${styles.link} ${styles.transitionFont}`;
  return (
    <a
      {...props}
      target={target}
      rel={rel}
      className={`${appearanceClass} ${className}`}
    >
      {startIcon}
      {children}
    </a>
  );
}
