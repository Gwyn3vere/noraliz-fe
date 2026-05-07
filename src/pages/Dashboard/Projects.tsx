import { memo } from "react";
import { dashboardStyles as styles } from "./Dashboard.styles";
import EmptySpace from "./EmptySpace";
import { images } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { CirclePlus, Ellipsis, Clock, Info } from "lucide-react";
import { mockProjects } from "@/data/project";
import type { ProjectSummary } from "@/types";
import { formatEditedTime } from "@/utils/format";
import Control from "./Control";

export default function Projects() {
  return mockProjects.length === 0 ? (
    <EmptySpace
      icon={images.emptyProjects}
      title="Ready to build?"
      content='Your canvas is waiting. Click "Create new project" to turn your vision into reality.'
      button={
        <Button className={styles.emptyButton}>
          <CirclePlus strokeWidth={3} />
          Create new project
        </Button>
      }
    />
  ) : (
    <div className={styles.contentContainer}>
      <div className="pt-[40px] pb-[20px] md:py-[40px]">
        <Control />
      </div>
      <div className="grid gap-5 w-full grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: ProjectSummary;
}

const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardThumb} />
      <div className="space-y-2 px-2.5">
        <div className=" flex items-center justify-between">
          <div className="text-[20px] font-bold truncate">{project.name}</div>
          <Button className="w-[30px] h-[30px] bg-[var(--color-dark)]/10 !rounded-[10px]">
            <Ellipsis size={24} strokeWidth={3} />
          </Button>
        </div>
        <div className=" w-full h-[1px] bg-[var(--color-dark)]/10" />
        <div className="flex items-center gap-[20px] text-[13px] xl:text-[15px] text-[var(--color-dark)]/50 py-2">
          <div className="flex items-center gap-2 truncate">
            <Clock size={15} strokeWidth={3} />
            {formatEditedTime(project.updatedAt)}
          </div>

          {/* <div className="flex items-center gap-2">
            <Book size={15} strokeWidth={3} />
            Pages: {project.pageCount}
          </div> */}

          <div className="flex items-center gap-2 truncate">
            <Info size={15} strokeWidth={3} />
            {project.isPublic ? "Published" : "Draft"}
          </div>
        </div>
      </div>
    </div>
  );
});
