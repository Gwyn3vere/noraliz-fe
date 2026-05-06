import { Outlet } from "react-router-dom";
// import { authLayoutStyles as styles } from "./AuthLayout.styles";
import Header from "@/components/shared/Header";

export default function DashboardLayout() {
  return (
    <main className="w-full h-full">
      <Header />
      <Outlet />
    </main>
  );
}
