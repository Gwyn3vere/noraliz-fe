import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/components/layouts/AuthLayout";

const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword"));

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

export const publicRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <LazyPage>
            <Login />
          </LazyPage>
        ),
      },
      {
        path: "/register",
        element: (
          <LazyPage>
            <Register />
          </LazyPage>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <LazyPage>
            <ForgotPassword />
          </LazyPage>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <LazyPage>
            <ResetPassword />
          </LazyPage>
        ),
      },
    ],
  },
];
