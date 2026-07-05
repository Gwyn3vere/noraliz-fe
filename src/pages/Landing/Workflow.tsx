import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { images } from "@/assets/images";
// import { motion } from "framer-motion";
// import { headingVariants } from "@/motions/sectionMotion";

const WORKFLOW = [
  {
    id: 1,
    title: "Drag & drop",
    desc: "Choose a template or build from blocks.",
    position: { x: "-40%", y: "-20%" },
    doodle: { x: "100%", y: "", rotation: "rotate(125deg) scaleX(-1)" },
  },
  {
    id: 2,
    title: "Select",
    desc: "Select any element on the canvas.",
    position: { x: "115%", y: "-20%" },
    doodle: { x: "", y: "", rotation: "rotate(230deg)" },
  },
  {
    id: 3,
    title: "Style",
    desc: "Customize every detail visually.",
    position: { x: "-35%", y: "90%" },
    doodle: { x: "80%", y: "-50%", rotation: "rotate(50deg)" },
  },
  {
    id: 4,
    title: "Publish",
    desc: "Publish your website in a few click.",
    position: { x: "115%", y: "90%" },
    doodle: { x: "10%", y: "-60%", rotation: "rotate(300deg) scaleX(-1)" },
  },
];

function Workflow() {
  return (
    <section
      className={cn(
        "relative max-w-[1420px] px-2.5 py-[50px] md:mx-auto mt-50",
        "flex flex-col items-center justify-center gap-10",
      )}
    >
      {/* Head title */}
      <div className={cn("flex flex-col items-center gap-1")}>
        <div className={cn("flex flex-col items-center", "text-[80px] font-black uppercase leading-20")}>
          <h1>Master the</h1>
          <h1>Noraliz canvas</h1>
        </div>
        <div className={cn("font-caveat text-[16px]")}>
          Everything you need to create, customize and publish - faster.
        </div>
        <img src={images.Sparkle} alt="sparkle" className={cn("absolute right-100 top-10")} />
      </div>

      {/* Video */}
      <div className="relative">
        <div
          className={cn(
            "w-[800px] h-[500px] rounded-[10px]",
            "border border-[var(--color-dark)] shadow-[var(--shadow-brutalism-lg)]",
          )}
        ></div>
        {WORKFLOW.map((item, index) => (
          <WorkflowItem
            key={item.id}
            serial={String(index + 1)}
            title={item.title}
            desc={item.desc}
            position={item.position}
            doodle={item.doodle}
          />
        ))}
      </div>

      <div className="relative">
        <Link
          to=""
          className={cn(
            "relative z-10",
            "inline-flex items-center gap-2",
            "h-[40px] py-[10px] px-[20px] rounded-full",
            "border border-[var(--color-dark)]",
            "text-[16px] text-[var(--color-light)] font-bold",
            "bg-[var(--color-primary)]",
            "shadow-[var(--shadow-brutalism)]",
          )}
        >
          Try Noraliz now
        </Link>
        <img src={images.Sparkle} alt="sparkle" className={cn("absolute -right-10 -top-3 w-5 h-5")} />
      </div>
    </section>
  );
}

export default Workflow;

interface Position {
  x?: string;
  y?: string;
}

interface Doodle {
  x?: string;
  y?: string;
  rotation?: string;
}

interface WorkflowItemProps {
  serial: string;
  title: string;
  desc: string;
  position?: Position;
  doodle?: Doodle;
}

function WorkflowItem({ serial, title, desc, position, doodle }: WorkflowItemProps) {
  return (
    <div className={cn("absolute flex flex-col gap-2 w-auto")} style={{ left: position?.x, top: position?.y }}>
      <div className="relative">
        <div
          className={cn(
            "text-[25px] border border-[var(--color-dark)] rounded-[10px]",
            "flex items-center justify-center w-[50px] h-[50px] text-white font-bold",
            "bg-[var(--color-primary)] font-antonio",
          )}
        >
          0{serial}
        </div>
        <h3 className={cn("text-[30px] font-black uppercase")}>{title}</h3>
        <p className={cn("text-[16px] w-[200px]")}>{desc}</p>
        <img
          src={images.doodleArrow4}
          alt="doodle arrow"
          className="absolute"
          style={{ left: doodle?.x, top: doodle?.y, transform: doodle?.rotation }}
        />
      </div>
    </div>
  );
}
