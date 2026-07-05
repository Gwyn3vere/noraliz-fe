import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "../src/routers";
import { useAuthLoader } from "@/components/hooks/useAuthLoader";
import { useEffect } from "react";
import { initializeAuth } from "./services/api";
import { lenis } from "./utils/lenis";

function AppRoutes() {
  return useRoutes(routes);
}

function AppContent() {
  const isReady = useAuthLoader();

  if (!isReady) {
    return null;
  }

  return <AppRoutes />;
}

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);
  useEffect(() => {
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
