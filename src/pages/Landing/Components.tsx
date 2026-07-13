import { cn } from "@/lib/utils";
import { landingStyles as styles } from "./Landing.styles";
import { Link } from "react-router-dom";
import { images } from "@/assets/images";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import {
  headingVariants,
  descVariants,
  ctaVariants,
  badgeContainerVariants,
  badgeVariants,
  componentRowVariants,
  componentCardVariants,
  moreVariants,
} from "@/motions/sectionMotion";

const COMPONENTS = [
  { id: 1, serial: "01", name: "container", thumbnail: images.cpnContainer, desc: "Structure at your fingertips." },
  { id: 2, serial: "02", name: "buttons", thumbnail: images.cpnButtons, desc: "Clickable. Customizable. All yours." },
  { id: 3, serial: "03", name: "text", thumbnail: images.cpnText, desc: "Typography that fits every idea." },
  { id: 4, serial: "04", name: "image", thumbnail: images.cpnImage, desc: "Brin visuals to life." },
  { id: 5, serial: "05", name: "columns", thumbnail: images.cpnColumn, desc: "Layout made simple." },
  { id: 6, serial: "06", name: "spacer", thumbnail: images.cpnSpacer, desc: "Control the space." },
];

function Components() {
  const firstRow = COMPONENTS.slice(0, 2);
  const secondRow = COMPONENTS.slice(2);

  return (
    <section id="components" className={cn("relative max-w-[1420px] px-2.5 py-[50px] md:mx-auto ")}>
      {/* Head title CTA */}
      <div className="absolute w-full flex justify-between">
        <div className="space-y-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={headingVariants}
            className={cn("text-[80px] font-black uppercase leading-20")}
          >
            <div>Build</div>
            <div>From</div>
            <div>Primitives</div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={descVariants}
            className={cn("text-[20px] font-medium ")}
          >
            Start with the essentials. <br /> Create anything.
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ctaVariants}>
            <Link to="" className={cn("relative z-10", "inline-flex items-center gap-2", styles.ctaButton)}>
              Explore all components
              <ArrowUpRightIcon size={20} weight="bold" />
              <motion.img
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: -30,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                src={images.Sparkle}
                alt="Sparkle"
                className={cn("w-[35px] h-[35px]", "absolute -right-15 -top-15", "animate-sparkle")}
              />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-[20px] h-[20px] rounded-full bg-[var(--color-primary)]" />
          <div className="text-[16px] font-medium uppercase [writing-mode:vertical-rl]">Core building blocks</div>
          <div className="relative h-64 w-6">
            <div className="absolute left-1/2 top-0 h-56 w-px -translate-x-1/2 bg-black" />
            <div className="absolute bottom-8 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-black" />
          </div>
        </motion.div>
      </div>

      {/* Component cards */}
      <div className="relative space-y-10 mt-20">
        <div className="relative flex justify-end mr-50">
          <motion.img
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            src={images.doodleArrow2}
            alt="doodle arrow"
          />
          <motion.div
            variants={badgeContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className={cn("text-[12px] text-[var(--color-light)] font-medium", "flex flex-col items-center gap-5")}
          >
            <motion.div
              variants={badgeVariants}
              className={cn(
                "px-[20px] py-1.5 inline-block",
                "rounded-full bg-[var(--color-success)]",
                "shadow-[var(--shadow-brutalism-xs)]",
              )}
            >
              Powerful
            </motion.div>

            <div className="flex gap-5">
              <motion.div
                variants={badgeVariants}
                className={cn(
                  "px-[20px] py-1.5 inline-block",
                  "rounded-full bg-[#FBBC05]",
                  "shadow-[var(--shadow-brutalism-xs)]",
                )}
              >
                Flexible
              </motion.div>
              <motion.div
                variants={badgeVariants}
                className={cn(
                  "px-[20px] py-1.5 inline-block",
                  "rounded-full bg-[#9E20FF]",
                  "shadow-[var(--shadow-brutalism-xs)]",
                  "-rotate-23",
                )}
              >
                Reusable
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Row 1 */}
        <motion.div
          variants={componentRowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex justify-end items-end gap-10 mr-20 -rotate-3"
        >
          {firstRow.map((cpn) => (
            <CompponentCards key={cpn.id} {...cpn} />
          ))}
        </motion.div>

        {/* Row 2 */}
        <motion.div
          variants={componentRowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex justify-end items-end gap-10 -rotate-3"
        >
          {secondRow.map((cpn) => (
            <CompponentCards key={cpn.id} {...cpn} />
          ))}
        </motion.div>

        <motion.img
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          src={images.doodleArrow3}
          alt="doodle arrow"
          className="absolute top-1/2 left-10"
        />

        <motion.div
          variants={moreVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className={cn(
            "relative",
            "font-antonio font-bold uppercase",
            "text-[33px] bg-[var(--color-primary)]",
            "inline-flex px-3 float-right",
            "mr-10",
          )}
        >
          and more...
          <motion.img
            initial={{
              opacity: 0,
              scale: 0,
              rotate: -30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            src={images.Sparkle}
            alt="Sparkle"
            className={cn("w-[25px] h-[25px]", "absolute -right-10 -bottom-10", "animate-sparkle")}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Components;

interface componentCardProps {
  serial: string;
  name: string;
  thumbnail: string;
  desc: string;
}

function CompponentCards({ serial, name, thumbnail, desc }: componentCardProps) {
  return (
    <motion.div
      variants={componentCardVariants}
      className={cn(
        "relative",
        "bg-[var(--color-light)] p-10",
        "w-auto h-auto rounded-[10px]",
        "border border-[var(--color-dark)]",
        "shadow-[var(--shadow-brutalism-lg)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-2",
        "hover:scale-[1.02]",
        "hover:-rotate-1",
      )}
    >
      <div
        className={cn(
          "absolute -top-5 px-3 py-2",
          "bg-[var(--color-dark)] uppercase",
          "text-[var(--color-light)] text-[16px] font-bold",
        )}
      >
        <span className="font-antonio">{serial}</span> <span>{name}</span>
      </div>

      <img src={thumbnail} alt="component" />

      <div className="text-[16px] font-medium max-w-[180px] mt-[14px]">{desc}</div>
    </motion.div>
  );
}
