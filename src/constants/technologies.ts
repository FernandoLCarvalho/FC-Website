interface Technology {
  name: string;
  image?: string;
  badgeLabel?: string;
}

export const technologies: Technology[] = [
  {
    name: "React",
    image: "/React icon.svg",
  },
  {
    name: "Next.js",
    image: "/nextjs ico.svg",
  },
  {
    name: "CSS Modules",
    badgeLabel: "CSS",
  },
];
