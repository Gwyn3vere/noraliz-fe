import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <h1 className="text-3xl font-bold text-orange-600">Hello NORALIZ!</h1>
        <Button>Click me</Button>
        <Input placeholder="Type something..." />
      </section>
    </>
  );
}

export default App;
