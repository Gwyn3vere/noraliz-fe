import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";
import { AuthGuard } from "./guards/AuthGuard";

// Lazy load trang 404
const NotFound = lazy(() => import("../pages/Errors/NotFound"));

function LazyNotFound() {
  return (
    <Suspense>
      <NotFound />
    </Suspense>
  );
}

export const routes: RouteObject[] = [
  // Public routes
  ...publicRoutes,

  // Private routes (bọc trong AuthGuard)
  {
    element: <AuthGuard />,
    children: privateRoutes,
  },

  // 404 - Catch all
  {
    path: "*",
    element: <LazyNotFound />,
  },
];
