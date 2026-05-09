import api from "./api";

export async function loginApi(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function registerApi(email: string, password: string, fullName: string) {
  const response = await api.post("/auth/register", { email, password, fullName });
  return response.data;
}

export async function refreshTokenApi() {
  const response = await api.post("/auth/refresh");
  return response.data;
}

export async function logoutApi() {
  await api.post("/auth/logout");
}

export async function forgotPasswordApi(email: string) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPasswordApi(token: string, newPassword: string) {
  const response = await api.post("/auth/reset-password", { token, newPassword });
  return response.data;
}
