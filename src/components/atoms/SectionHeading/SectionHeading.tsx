import type { ReactNode } from "react";

export interface ISectionHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  children,
  as: Tag = "h2",
  className,
}: ISectionHeadingProps) {
  const defaultClass =
    "text-center text-lg font-semibold text-white md:text-2xl";
  return (
    <Tag className={className?.trim() ? className : defaultClass}>
      {children}
    </Tag>
  );
}
