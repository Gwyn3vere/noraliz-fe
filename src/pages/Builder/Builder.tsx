import { useState, useEffect } from "react";
import { useProjectLoader } from "@/components/hooks/useProjectLoader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectLoader from "../Loading/ProjectLoader";

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
    <div className="flex flex-col h-screen bg-[var(--color-body-light)]">
      {/* Top Bar */}
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">
            ← Dashboard
          </Link>
          <span className="text-sm font-medium text-[var(--color-dark)]">{project?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button size="sm">Export</Button>
          <Button variant="ghost" size="sm" className="text-red-500">
            Save
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3">Sections</h3>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors">
              + Blank Section
            </div>
            <div className="p-3 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors">
              Hero Section
            </div>
            <div className="p-3 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors">
              Features Section
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] p-8">
            <p className="text-gray-400 text-center text-sm">
              This is your canvas. Start building by adding sections from the left panel.
            </p>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-72 border-l border-gray-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3">Properties</h3>
          <p className="text-xs text-gray-400">Select an element to edit its properties.</p>
        </aside>
      </div>
    </div>
  );
}
