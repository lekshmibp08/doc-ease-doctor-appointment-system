
const COMMON_STORAGE_URL = process.env.COMMON_STORAGE_URL || "";
const GOOGLE_IMAGE_BASE_URL = process.env.GOOGLE_IMAGE_BASE_URL || "";

export const stripBaseUrl = (url?: string): string | undefined => {
  if (!url) return url;

  if (url.startsWith(COMMON_STORAGE_URL)) {
    return `cl:${url.replace(COMMON_STORAGE_URL, "")}`;
  }

  if (url.startsWith(GOOGLE_IMAGE_BASE_URL)) {
    return `go:${url.replace(GOOGLE_IMAGE_BASE_URL, "")}`;
  }

  return url;
};
