import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";

/** Existing About layout, with native div attributes and optional caller classes. */
export type PageContainerProps = ComponentPropsWithoutRef<"div">;
export default function PageContainer({
  className = "",
  ...props
}: PageContainerProps) {
  return <div {...props} className={`${styles.root} ${className}`} />;
}
