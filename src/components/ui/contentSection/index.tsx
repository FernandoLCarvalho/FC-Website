import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
export type ContentSectionProps = ComponentPropsWithoutRef<"section"> & {
  width?: "content" | "narrow";
  spacing?: "none" | "section" | "map";
  align?: "start" | "center";
};

/** Width and rhythm are independent; unspaced sections center their children. */
export default function ContentSection({
  width = "content",
  spacing = "none",
  align = "start",
  className = "",
  ...props
}: ContentSectionProps) {
  return (
    <section
      {...props}
      className={`${styles[width]} ${styles[spacing]} ${styles[align]} ${className}`}
    />
  );
}
