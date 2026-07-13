import { cn } from "@/lib/utils";
import { landingStyles as styles } from "./Landing.styles";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { images } from "@/assets/images";
import { motion } from "framer-motion";
import {
  headingVariants,
  descVariants,
  ctaVariants,
  templateLeftVariants,
  templateRightVariants,
  templateCenterVariants,
} from "@/motions/sectionMotion";

function Templates() {
  return (
    <section id="templates" className={cn("relative max-w-[1420px] px-2.5 py-[50px] md:mx-auto mt-50")}>
      <div className={cn("flex items-center justify-center gap-7")}>
        <motion.div
          variants={templateLeftVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="relative flex flex-col gap-5 mt-20"
        >
          <TemplateCard
            className="w-[340px] h-[370px] "
            rotation="-rotate-3"
            thumbnail="https://i.pinimg.com/736x/b9/f6/eb/b9f6ebcbf02b8dfbc5588a45029c71fa.jpg"
            tag="Portfolio"
            tagBg="#f2debb"
            positionX={20}
            positionY={-60}
          />
          <TemplateCard
            className="w-[340px] h-[270px]"
            rotation="-rotate-3"
            thumbnail="https://i.pinimg.com/736x/f2/03/15/f203151e906390e028fcb31de953b617.jpg"
          />
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
            className="absolute -left-30 bottom-20 w-20 h-20"
          />
        </motion.div>

        <div className="flex flex-col items-center gap-[20px]">
          <div className="relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={headingVariants}
              className={cn("text-[80px] font-black uppercase leading-20")}
            >
              Ready-made
            </motion.div>
            <div className="absolute -top-10 -right-60">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={descVariants}
                className={cn("relative font-caveat text-[16px]")}
              >
                Professionally designed starting points <br /> for every idea. <br /> Customize. Launch. Grow.
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
                src={images.vector2}
                alt="vector"
              />
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                src={images.doodleArrow1}
                alt="doodle arrow"
                className="absolute -right-15 top-0"
              />
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
                alt="sparkle"
                className={cn("absolute -right-25 -top-10", "animate-sparkle")}
              />
            </div>
          </div>
          <motion.div
            variants={templateCenterVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <TemplateCard
              className="w-[620px] h-[560px]"
              thumbnail="https://i.pinimg.com/736x/9d/0d/c9/9d0dc969f0ee87bd32716b01800aa034.jpg"
            />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ctaVariants}>
            <Link to="" className={cn("relative mt-2", "inline-flex items-center gap-2", styles.ctaButton)}>
              Explore the library
              <ArrowRightIcon size={20} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={templateRightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="flex flex-col gap-5 mt-20"
        >
          <TemplateCard
            className="w-[350px] h-[350px] "
            rotation="rotate-4"
            thumbnail="https://i.pinimg.com/736x/9a/96/df/9a96dfb5e341a540a89590ee199ab549.jpg"
          />
          <TemplateCard
            className="w-[360px] h-[290px] "
            rotation="rotate-2"
            thumbnail="https://i.pinimg.com/1200x/c8/59/53/c85953edaa01edc0db354249907778d7.jpg"
            tag="Brand"
            tagBg="#a42127"
            positionX={100}
            positionY={330}
            pointer={{ x: "30%", y: "top" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Templates;

interface Pointer {
  x?: string;
  y?: string;
}

interface TemplateCardProp {
  className?: string;
  rotation?: string;
  thumbnail?: string;
  tag?: string;
  tagBg?: string;
  positionX?: number;
  positionY?: number;
  pointer?: Pointer;
}

function TemplateCard({
  className,
  rotation,
  thumbnail,
  tag,
  tagBg,
  positionX,
  positionY,
  pointer = {
    x: "30%",
    y: "bottom",
  },
}: TemplateCardProp) {
  return (
    <div
      className={cn(
        "group relative",
        rotation,
        "cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-2",
        "hover:scale-[1.015]",
      )}
    >
      <div
        className={cn(
          className,
          "rounded-[10px] overflow-hidden",
          "border border-[var(--color-dark)]",
          "shadow-[var(--shadow-brutalism-lg)]",
        )}
      >
        <img
          src={thumbnail}
          alt="templates"
          className=" transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      {tag && (
        <div
          className={cn("absolute z-10 px-4 py-1 rounded-full text-white bg-black shadow-md")}
          style={{
            left: positionX,
            top: positionY,
            background: tagBg,
          }}
        >
          @{tag}
          <div
            className="absolute w-4 h-4 rotate-0 rounded-[3px]"
            style={{
              backgroundColor: tagBg,

              left: pointer.x,
              transform: "translateX(-50%) rotate(45deg)",

              ...(pointer.y === "bottom" ? { bottom: -8 } : { top: -8 }),
            }}
          />
        </div>
      )}
    </div>
  );
}
