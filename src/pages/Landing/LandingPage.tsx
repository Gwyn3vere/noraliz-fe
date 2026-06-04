import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/login");
  }, 3000);
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <span className="font-display uppercase font-black text-[70px]">Noraliz</span>

      <div className="flex flex-col items-center justify-center">
        <p>Our public website is currently being built.</p>
        <p>You'll be redirected to the application in a few seconds.</p>
      </div>
    </div>
  );
}

export default LandingPage;
