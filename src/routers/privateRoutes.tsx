import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Builder = lazy(() => import("../pages/Builder/Builder"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>;
}

// ──────────────────────────────────
// Private Routes
// ──────────────────────────────────
export const privateRoutes: RouteObject[] = [
  {
    path: "/builder/:projectId?",
    element: (
      <LazyPage>
        <Builder />
      </LazyPage>
    ),
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <LazyPage>
            <Dashboard />
          </LazyPage>
        ),
      },
    ],
  },
];
