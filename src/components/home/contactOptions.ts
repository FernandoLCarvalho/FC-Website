import { contact } from "@/constants/contact";
import type { IconName } from "@components/ui/icon";

function buildWhatsAppContactUrl(message: string) {
  const phoneNumber = contact.whatsAppPhoneNumber;
  if (!phoneNumber) return null;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function mailToContactUrl(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export type ContactOption = {
  id: IconName;
  href: string | null;
  icon: IconName;
  label: string;
};

export function buildContactOptions(
  t: (
    key:
      | "WHATSAPP_CONTACT"
      | "WHATSAPP_CTA"
      | "EMAIL_SUBJECT"
      | "EMAIL_CTA"
      | "GITHUB_CTA"
      | "LINKEDIN_CTA",
  ) => string,
): readonly ContactOption[] {
  return [
    {
      id: "whatsapp",
      icon: "whatsapp",
      href: buildWhatsAppContactUrl(t("WHATSAPP_CONTACT")),
      label: t("WHATSAPP_CTA"),
    },
    {
      id: "envelope",
      icon: "envelope",
      href: mailToContactUrl(contact.email, t("EMAIL_SUBJECT")),
      label: t("EMAIL_CTA"),
    },
    {
      id: "github",
      icon: "github",
      href: contact.githubUrl,
      label: t("GITHUB_CTA"),
    },
    {
      id: "linkedin",
      icon: "linkedin",
      href: contact.linkedInUrl,
      label: t("LINKEDIN_CTA"),
    },
  ];
}
