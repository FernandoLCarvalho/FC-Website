import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
import type { ReactNode } from "react";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  /** Contact action appearance; caller owns the surrounding layout. */
  variant?: "contact";
  startIcon?: ReactNode;
};

export default function Button({
  variant = "contact",
  startIcon,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles[variant]} ${className}`}
    >
      {startIcon}
      <span>{children}</span>
    </button>
  );
}
