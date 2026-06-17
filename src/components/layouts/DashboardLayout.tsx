import { Outlet } from "react-router-dom";
// import { authLayoutStyles as styles } from "./AuthLayout.styles";
import Header from "@/components/shared/Header";

export default function DashboardLayout() {
  return (
    <main className="w-full min-h-screen relative overflow-hidden">
      <Header />
      <div className="relative z-5">
        <Outlet />
      </div>
    </main>
  );
}
