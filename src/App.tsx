import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "../src/routers";
import { useAuthLoader } from "@/components/hooks/useAuthLoader";
import { useEffect } from "react";
import { initializeAuth } from "./services/api";

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
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
