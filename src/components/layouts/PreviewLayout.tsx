import { Outlet } from "react-router-dom";

export default function PreviewLayout() {
  return (
    <main className="w-full min-h-screen relative">
      <Outlet />
    </main>
  );
}
