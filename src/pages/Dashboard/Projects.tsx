import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { dashboardStyles as styles } from "./Dashboard.styles";
import EmptySpace from "./EmptySpace";
import { images } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { CirclePlus, Ellipsis, Clock, Info, Book } from "lucide-react";
import { CopyIcon, TrashIcon, PenIcon, StackIcon } from "@phosphor-icons/react";
import type { ProjectSummary } from "@/types";
import { formatEditedTime } from "@/utils/format";
import Control from "./Control";
import { useProjects } from "@/components/hooks/useProjects";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useNavigate, Link } from "react-router-dom";

export default function Projects() {
  const { projects, error, removeProject, createNewProject } = useProjects();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateProject = async () => {
    const newProject = await createNewProject("Untitled Project");
    if (newProject) {
      navigate(`/builder/${newProject.id}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await removeProject(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return projects?.length === 0 ? (
    <EmptySpace
      icon={images.emptyProjects}
      title="Ready to build?"
      content='Your canvas is waiting. Click "Create new project" to turn your vision into reality.'
      button={
        <Button className={cn(styles.emptyButton, styles.inputSearch)} onClick={handleCreateProject}>
          <CirclePlus strokeWidth={3} />
          Create new project
        </Button>
      }
    />
  ) : (
    <>
      <div className={styles.contentContainer}>
        <div className="pt-[40px] pb-[20px] md:py-[40px]">
          <Control
            tabname="Projects"
            button={
              <Button className={styles.emptyButton} onClick={handleCreateProject}>
                <CirclePlus strokeWidth={3} />
                Create new project
              </Button>
            }
          />
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => setDeleteTarget({ id: project.id, name: project.name })}
            />
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => !isDeleting && setDeleteTarget(null)}
        title="Delete project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

interface ProjectCardProps {
  project: ProjectSummary;
  onDelete: () => void;
}

const ProjectCard = memo(function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <div className={styles.cardContainer}>
      {/* Thumbail */}
      <Link to={`/builder/${project.id}`}>
        <div className="group relative ">
          <div className={styles.cardThumb} />
          <div className={styles.cardHover}>
            <div className={styles.cardButton}>
              <StackIcon size={20} weight="fill" /> Open in Builder
            </div>
          </div>
        </div>
      </Link>
      {/* Project infomation */}
      <div className="px-2.5">
        <div className=" flex items-center justify-between my-1">
          <div className="text-[16px] font-bold truncate my-2">{project.name}</div>
          <Button className={styles.metaButton} onClick={() => setOptionsOpen((prev) => !prev)}>
            <Ellipsis size={24} strokeWidth={3} />
          </Button>
        </div>
        <div className=" w-full h-[1px] bg-[var(--color-dark)]/10" />

        {/* Metadata */}
        <div className={cn(styles.meta, optionsOpen ? "hidden" : "flex")}>
          <div className="flex items-center gap-2 truncate h-[40px]">
            <Clock size={15} strokeWidth={3} />
            {formatEditedTime(project.updatedAt)}
          </div>

          <div className="flex items-center gap-2 truncate h-[40px]">
            <Info size={15} strokeWidth={3} />
            {project.isPublic ? "Published" : "Draft"}
          </div>
        </div>

        {/* Controls */}
        <div className={cn(styles.controlButton, optionsOpen ? "flex" : "hidden")}>
          <div className="flex items-center gap-2 truncate">
            <Book size={15} strokeWidth={3} />
            {project.pageCount === 1 ? "page" : "pages"}: {project.pageCount}
          </div>

          <div className="flex items-center truncate">
            <Button className={styles.metaButton}>
              <CopyIcon size={20} weight="fill" />
            </Button>
            <Button className={styles.metaButton}>
              <PenIcon size={20} weight="fill" />
            </Button>
            <Button className={styles.metaButton} onClick={onDelete}>
              <TrashIcon size={20} weight="fill" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
