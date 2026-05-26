export const ALICODE_INTL_PROVIDER_ID = "alicode-intl";

export function isAlicodeIntlProvider(providerId) {
  return providerId === "alicode-intl";
}

export function getAlicodeIntlAuthActions() {
  return [];
}

export function getAlicodeIntlDefaultAuthType() {
  return "apikey";
}
