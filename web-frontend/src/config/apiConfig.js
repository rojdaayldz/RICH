export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5227";

export const apiPath = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};
