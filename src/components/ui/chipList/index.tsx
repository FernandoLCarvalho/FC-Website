import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
export type ChipListProps = ComponentPropsWithoutRef<"ul"> & {
  /** Static text tags in their original display order. */
  items: readonly string[];
};
export default function ChipList({
  items,
  className = "",
  ...props
}: ChipListProps) {
  return (
    <ul {...props} className={`${styles.list} ${className}`}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
