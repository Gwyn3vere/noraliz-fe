import { Outlet } from "react-router-dom";
import { authLayoutStyles as styles } from "./AuthLayout.styles";

export default function DashboardLayout() {
  return (
    <main className="w-full h-full">
      <Outlet />
    </main>
  );
}
