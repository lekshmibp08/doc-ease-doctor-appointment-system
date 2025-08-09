export const getFullImageUrl = (imagePath?: string): string => {
  const COMMON_STORAGE_URL = import.meta.env.VITE_COMMON_STORAGE_URL;
  const GOOGLE_IMAGE_BASE_URL = import.meta.env.VITE_GOOGLE_IMAGE_BASE_URL;

  if (!imagePath) return "/default-doctor.png";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  if (imagePath.startsWith("cl:")) {
    return COMMON_STORAGE_URL + imagePath.replace("cl:", "");
  }

  if (imagePath.startsWith("go:")) {
    return GOOGLE_IMAGE_BASE_URL + imagePath.replace("go:", "");
  }

  return imagePath;
};
