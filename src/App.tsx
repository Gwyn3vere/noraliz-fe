import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "../src/routers";
import { useAuthLoader } from "@/components/hooks/useAuthLoader";

function AppRoutes() {
  return useRoutes(routes);
}

function AppContent() {
  const isReady = useAuthLoader();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
