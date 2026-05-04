import { Navigate, Outlet } from "react-router-dom";

export function AuthGuard() {
  // Tạm thời kiểm tra localStorage (sau này sẽ dùng Zustand store)
  const isAuthenticated = localStorage.getItem("accessToken") !== null;

  if (!isAuthenticated) {
    // Chưa đăng nhập → redirect về login
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập → render các route con
  return <Outlet />;
}
