const DEFAULT_CONTACT_EMAIL = "nando_carvalhoo@hotmail.com";
const DEFAULT_GITHUB_URL = "https://github.com/FernandoLCarvalho";
const DEFAULT_LINKEDIN_URL = "https://www.linkedin.com/in/fernandolcarvalho/";

function publicEnvValue(value: string | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

export const contact = {
  email:
    publicEnvValue(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ??
    DEFAULT_CONTACT_EMAIL,
  githubUrl:
    publicEnvValue(process.env.NEXT_PUBLIC_GITHUB_URL) ?? DEFAULT_GITHUB_URL,
  linkedInUrl:
    publicEnvValue(process.env.NEXT_PUBLIC_LINKEDIN_URL) ??
    DEFAULT_LINKEDIN_URL,
  whatsAppPhoneNumber: publicEnvValue(process.env.NEXT_PUBLIC_PHONE_NUMBER),
};
