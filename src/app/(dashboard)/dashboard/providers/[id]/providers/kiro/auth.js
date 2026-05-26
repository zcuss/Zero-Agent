export const KIRO_PROVIDER_ID = "kiro";

export const KIRO_AUTH_METHODS = {
  awsBuilderId: "aws_builder_id",
  awsIdc: "aws_idc",
  socialGoogle: "social_google",
  socialGithub: "social_github",
  importToken: "import_token",
};

export function isKiroProvider(providerId) {
  return providerId === KIRO_PROVIDER_ID;
}

export function getKiroAuthMethods() {
  return [
    { id: KIRO_AUTH_METHODS.awsBuilderId, label: "AWS Builder ID", kind: "device_code" },
    { id: KIRO_AUTH_METHODS.awsIdc, label: "AWS IAM Identity Center", kind: "device_code" },
    { id: KIRO_AUTH_METHODS.socialGoogle, label: "Google Social Login", kind: "oauth_code" },
    { id: KIRO_AUTH_METHODS.socialGithub, label: "GitHub Social Login", kind: "oauth_code" },
    { id: KIRO_AUTH_METHODS.importToken, label: "Import Refresh Token", kind: "manual" },
  ];
}
