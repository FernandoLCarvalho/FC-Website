interface ProfessionalCompetency {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tools: string[];
}

export const professionalCompetencies: ProfessionalCompetency[] = [
  {
    id: "product-frontend",
    titleKey: "TECH_PRODUCT_FRONTEND_TITLE",
    descriptionKey: "TECH_PRODUCT_FRONTEND_DESCRIPTION",
    tools: [
      "React",
      "Next.js",
      "TypeScript",
      "MUI",
      "TanStack Query",
      "Zustand",
    ],
  },
  {
    id: "api-driven-apps",
    titleKey: "TECH_API_DRIVEN_APPS_TITLE",
    descriptionKey: "TECH_API_DRIVEN_APPS_DESCRIPTION",
    tools: ["REST APIs", "Auth flows", "Server state", "Forms", "Dashboards"],
  },
  {
    id: "spec-driven-ai-workflows",
    titleKey: "TECH_SPEC_DRIVEN_AI_TITLE",
    descriptionKey: "TECH_SPEC_DRIVEN_AI_DESCRIPTION",
    tools: [
      "Specs",
      "Context maps",
      "Constraints",
      "Validation checks",
      "Atomic delivery",
    ],
  },
  {
    id: "system-understanding",
    titleKey: "TECH_SYSTEM_UNDERSTANDING_TITLE",
    descriptionKey: "TECH_SYSTEM_UNDERSTANDING_DESCRIPTION",
    tools: ["CQRS exposure", "Background jobs", "Payments", "Persistence"],
  },
];
