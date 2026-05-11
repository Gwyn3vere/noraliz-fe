import { useState, useEffect } from "react";
import { useProjectLoader } from "@/components/hooks/useProjectLoader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectLoader from "../Loading/ProjectLoader";
import LeftPanel from "./LeftPanel";

export default function Builder() {
  const { project, isLoading, error } = useProjectLoader();
  const [isLoaderReady, setIsLoaderReady] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);

  useEffect(() => {
    if (!isLoading && !error) {
      setIsApiDone(true);
    }
  }, [isLoading, error]);

  if (!isLoaderReady) {
    return <ProjectLoader onReady={() => setIsLoaderReady(true)} isWaiting={!isApiDone} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <LeftPanel />
      <Canvas />
      <RightPanel />
    </div>
  );
}

function Canvas() {
  return (
    <div className="flex-1 h-screen flex items-center justify-center">
      <div className="w-full h-[780px] mx-[40px] bg-white"></div>
    </div>
  );
}

function RightPanel() {
  return <div className="bg-[var(--color-light)] w-[260px] h-screen"></div>;
}
