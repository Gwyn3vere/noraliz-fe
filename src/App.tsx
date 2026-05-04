import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "../src/routers";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
