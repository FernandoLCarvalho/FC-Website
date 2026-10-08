import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";

/** Existing About layout, with native article attributes and optional caller classes. */
export type CardProps = ComponentPropsWithoutRef<"article">;
export default function Card({ className = "", ...props }: CardProps) {
  return <article {...props} className={`${styles.root} ${className}`} />;
}
