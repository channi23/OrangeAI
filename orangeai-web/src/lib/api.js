export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const apiUrl = (path) => `${API_BASE}${path}`;
