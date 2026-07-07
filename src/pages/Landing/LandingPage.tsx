import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Components from "./Components";
import Templates from "./Templates";
import Workflow from "./Workflow";
import Builders from "./Builders";
import Footer from "./Footer";
import { useAuthStore } from "@/stores/authStore";

function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen">
      <Navbar auth={isAuthenticated} />
      <Hero auth={isAuthenticated} />
      <Features />
      <Components />
      <Templates />
      <Workflow />
      <Builders />
      <Footer />
    </main>
  );
}

export default LandingPage;
