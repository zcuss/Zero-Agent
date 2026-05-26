import { importOpenaiAccessToken } from "./accesstoken";

export function getOpenaiApi() {
  return {
    importSession: importOpenaiAccessToken,
    importToken: null,
    startOAuth: null,
    pollOAuth: null,
  };
}
