import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { images } from "@/assets/images";
import { headingVariants, descVariants } from "@/motions/sectionMotion";

const BUILDERS = [
  {
    id: 1,
    thumbnail: "https://i.pinimg.com/736x/cd/26/9d/cd269d29ed0415170e7e0c853c6f22e4.jpg",
    position: { x: "200px", y: "0", rotate: "rotate(-8deg)" },
    bullist: {
      title: "Creators",
      list: ["Portfolio", "Personal Brand", "Blog"],
      background: "#34A853",
      x: "-230px",
      y: "100px",
      doodle: { x: "120px", y: "10px", rotation: "rotate(90deg) " },
    },
  },
  {
    id: 2,
    thumbnail: "https://i.pinimg.com/1200x/f4/db/59/f4db5988c8e98d86a92441f692ad7a1c.jpg",
    position: { x: "535px", y: "140px", rotate: "rotate(8deg)" },
    bullist: {
      title: "Startups",
      list: ["Landing Page", "MVP", "Product Launch"],
      background: "#9E20FF",
      x: "180px",
      y: "-150px",
      doodle: { x: "-100px", y: "30px", rotation: "rotate(240deg) scaleX(-1)" },
    },
  },
  {
    id: 3,
    thumbnail: "https://i.pinimg.com/1200x/92/5e/40/925e406e48435bf7a51394b325a8edf8.jpg",
    position: { x: "80px", y: "385px", rotate: "rotate(3deg)" },
    bullist: {
      title: "Agencies",
      list: ["Client Websites", "Marketing Pages", "Campaings"],
      background: "#ff6a00",
      x: "-250px",
      y: "30px",
      doodle: { x: "150px", y: "0", rotation: "rotate(70deg)" },
    },
  },
  {
    id: 4,
    thumbnail: "https://i.pinimg.com/736x/a5/68/73/a56873c88c600eda6922a10a72c7c3b2.jpg",
    position: { x: "440px", y: "525px", rotate: "rotate(-8deg)", zIndex: "-1" },
    bullist: {
      title: "Freelancers",
      list: ["Client Work", "Personal Site", "Online Store"],
      background: "#4285F4",
      x: "420px",
      y: "70px",
      doodle: { x: "-60px", y: "-80px", rotation: "rotate(300deg) scaleX(-1)" },
    },
  },
];

function Builder() {
  return (
    <section className={cn("max-w-[1420px] px-2.5 md:mx-auto mt-50", "relative flex h-[900px]")}>
      {/* Heading title */}{" "}
      <div className="space-y-5 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={headingVariants}
          className={cn("text-[80px] font-black uppercase leading-20 text-nowrap")}
        >
          <div>Who is it</div>
          <div>for?</div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={descVariants}
          className={cn("text-[20px] font-medium ")}
        >
          Different people. <br /> Different goals. <br /> Same powerful experience.
        </motion.div>
        <img src={images.Sparkle} alt="sparkle" className={cn("absolute left-100 top-0 w-6 h-6")} />
      </div>
      {/* Builder cards */}
      <div className="relative w-full">
        {BUILDERS.map((card) => (
          <BuildersCard key={card.id} thumbnail={card.thumbnail} position={card.position} bullist={card.bullist} />
        ))}
      </div>
      <img src={images.Sparkle} alt="sparkle" className={cn("absolute w-7 h-7", "right-[450px] top-[0px]")} />
      <img src={images.Sparkle} alt="sparkle" className={cn("absolute w-5 h-5", "left-[430px] top-[330px]")} />
      <img src={images.Sparkle} alt="sparkle" className={cn("absolute w-7 h-7", "left-[400px] bottom-[150px]")} />
      <img src={images.Sparkle} alt="sparkle" className={cn("absolute w-8 h-8", "right-[150px] bottom-[40px]")} />
    </section>
  );
}

export default Builder;

interface Position {
  x?: string;
  y?: string;
  rotate?: string;
  zIndex?: string;
}

interface Doodle {
  x?: string;
  y?: string;
  rotation?: string;
}

interface Bullist {
  title?: string;
  background?: string;
  list?: string[];
  x?: string;
  y?: string;
  doodle?: Doodle;
}

interface BuildersCardProps {
  thumbnail?: string;
  position?: Position;
  bullist?: Bullist;
}

function BuildersCard({ thumbnail, position, bullist }: BuildersCardProps) {
  return (
    <div className="absolute" style={{ left: position?.x, top: position?.y, zIndex: position?.zIndex }}>
      <div className="relative">
        <div
          className={cn(
            " w-[350px] h-[350px] rounded-[10px]",
            "border border-[var(--color-dark)] shadow-[var(--shadow-brutalism)]",
          )}
          style={{ transform: position?.rotate }}
        >
          <img src={thumbnail} alt="thumbnail" className="w-full h-full rounded-[10px] object-cover object-top" />
        </div>

        <div className="absolute" style={{ left: bullist?.x, top: bullist?.y }}>
          <div className="relative">
            <div
              className={cn("inline-block px-[20px] py-2.5 rounded-full", "shadow-[var(--shadow-brutalism-xs)]")}
              style={{ background: bullist?.background }}
            >
              <div className={cn("uppercase text-[12px] font-bold text-white")}>Creators</div>
            </div>

            <div className={cn("mt-2")}>
              <ul className="font-caveat text-[20px] list-disc pl-5">
                {bullist?.list?.map((item, index) => (
                  <li key={index} className="text-nowrap">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <img
              src={images.doodleArrow4}
              alt="doodle arrow"
              className="absolute w-20 h-20"
              style={{ left: bullist?.doodle?.x, top: bullist?.doodle?.y, transform: bullist?.doodle?.rotation }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
