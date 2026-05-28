import { useParams, Link } from "react-router-dom";
import { usePreviewProject } from "@/components/hooks/usePreviewProject";
import { Button } from "@/components/ui/button";
import type { Section } from "@/types";
import { BlockPreview, buildStyle } from "./BlockPreview";

function SectionPreview({ section }: { section: Section }) {
  const styles = buildStyle(section.props?.styles as Record<string, string>);
  return (
    <section style={styles}>
      {section.blocks.map((block) => (
        <BlockPreview key={block.id} block={block} />
      ))}
    </section>
  );
}

export default function Preview() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading, error } = usePreviewProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading preview...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error || "Project not found"}</p>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const page = project.jsonData?.pages?.[0];
  if (!page) return <p>No page found.</p>;

  return (
    <div className="flow-root">
      {page.sections.map((section: Section) => (
        <SectionPreview key={section.id} section={section} />
      ))}
    </div>
  );
}
