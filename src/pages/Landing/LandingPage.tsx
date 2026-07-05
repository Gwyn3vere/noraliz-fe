import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Components from "./Components";
import Templates from "./Templates";
import Workflow from "./Workflow";
import Builders from "./Builders";
import Footer from "./Footer";

function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
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
