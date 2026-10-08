import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
export type SectionTitleProps = ComponentPropsWithoutRef<"h1"> & {
  as?: "h1" | "h2" | "h3";
  variant: "page" | "section" | "card";
};

/** Semantic heading level is independent of its visual hierarchy. */
export default function SectionTitle({
  as: Heading = "h2",
  variant,
  className = "",
  ...props
}: SectionTitleProps) {
  return <Heading {...props} className={`${styles[variant]} ${className}`} />;
}
