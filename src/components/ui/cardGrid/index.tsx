import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";

/** Existing About layout, with native div attributes and optional caller classes. */
export type CardGridProps = ComponentPropsWithoutRef<"div">;
export default function CardGrid({ className = "", ...props }: CardGridProps) {
  return <div {...props} className={`${styles.root} ${className}`} />;
}
