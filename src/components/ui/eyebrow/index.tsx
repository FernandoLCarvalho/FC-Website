import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
export type EyebrowProps = ComponentPropsWithoutRef<"p"> & {
  variant: "home" | "profile";
};
/** Uppercase role text, preserving each domain's margins and font metrics. */
export default function Eyebrow({
  variant,
  className = "",
  ...props
}: EyebrowProps) {
  return <p {...props} className={`${styles[variant]} ${className}`} />;
}
