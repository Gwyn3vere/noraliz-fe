import axios from "axios";

const API_BASE = import.meta.env.VITE_REACT_APP_API_HOST || import.meta.env.VITE_REACT_APP_API_BASE;

const authApi = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function loginApi(email: string, password: string) {
  const response = await authApi.post("/auth/login", { email, password });
  return response.data;
}

export async function registerApi(email: string, password: string, fullName: string) {
  const response = await authApi.post("/auth/register", { email, password, fullName });
  return response.data;
}

export async function refreshTokenApi() {
  const response = await authApi.post("/auth/refresh");
  return response.data;
}

export async function logoutApi() {
  await authApi.post("/auth/logout");
}

export async function forgotPasswordApi(email: string) {
  const response = await authApi.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPasswordApi(token: string, newPassword: string) {
  const response = await authApi.post("/auth/reset-password", { token, newPassword });
  return response.data;
}
