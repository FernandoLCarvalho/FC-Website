import type { ComponentPropsWithRef } from "react";
import styles from "./styles.module.css";
export type IconButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-label"
> & {
  /** Localized accessible name for the decorative icon. */
  label: string;
  variant: "menu" | "drawerClose" | "panelClose";
};

export default function IconButton({
  label,
  variant,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      className={`${styles[variant]} ${className}`}
    />
  );
}
