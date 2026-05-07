import { Outlet } from "react-router-dom";
// import { authLayoutStyles as styles } from "./AuthLayout.styles";
import Header from "@/components/shared/Header";

export default function DashboardLayout() {
  return (
    <main className="w-full min-h-screen relative overflow-hidden">
      <Header />
      {/* background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-120 h-120 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 w-120 h-120 rounded-full bg-[var(--color-dark)]/10 blur-3xl" />
      </div>
      <div className="relative z-5">
        <Outlet />
      </div>
    </main>
  );
}
