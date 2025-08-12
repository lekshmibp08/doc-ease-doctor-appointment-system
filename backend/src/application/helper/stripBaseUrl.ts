
const COMMON_STORAGE_URL = process.env.COMMON_STORAGE_URL || "";
const GOOGLE_IMAGE_BASE_URL = process.env.GOOGLE_IMAGE_BASE_URL || "";

export const stripBaseUrl = (url?: string): string => {
  if (!url) return '';

  if (url.startsWith(COMMON_STORAGE_URL)) {
    const stripped = `cl:${url.replace(COMMON_STORAGE_URL, "")}`;
    console.log(stripped);
    return stripped
  }

  if (url.startsWith(GOOGLE_IMAGE_BASE_URL)) {
    return `go:${url.replace(GOOGLE_IMAGE_BASE_URL, "")}`;
  }

  return url;
};
