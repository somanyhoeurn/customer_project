// Use proxy in browser to avoid CORS; backend URL for server-side
export const API_URL =
  typeof window === "undefined"
    ? "http://localhost:8080/api/v1"
    : "/api/backend";
