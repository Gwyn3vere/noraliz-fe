import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BuilderLayout from "@/components/layouts/BuilderLayout";
import { PageLoader } from "@/pages/Loading/PageLoader";

const Builder = lazy(() => import("../pages/Builder/Builder"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));

function PageLoading() {
  return <PageLoader />;
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>;
}

// ──────────────────────────────────
// Private Routes
// ──────────────────────────────────
export const privateRoutes: RouteObject[] = [
  {
    element: <BuilderLayout />,
    children: [
      {
        path: "/builder/:projectId",
        element: <Builder />,
      },
    ],
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
