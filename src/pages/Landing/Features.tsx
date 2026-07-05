import { cn } from "@/lib/utils";
import { images } from "@/assets/images";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { headingVariants, descVariants, cardsContainerVariants, cardVariants } from "@/motions/sectionMotion";

const FEATURES = [
  { id: 1, serial: "01", title: "Drag & Drop", shortDesc: "Build layouts visually with an intuitive  canvas." },
  {
    id: 2,
    serial: "02",
    title: "Visual Editor",
    shortDesc: "Customize every detail typography, spacing, colors, effects and more.",
  },
  { id: 3, serial: "03", title: "Reusable Components", shortDesc: "Build layouts visually with an intuitive  canvas." },
  {
    id: 4,
    serial: "04",
    title: "Responsive Design",
    shortDesc: "Design for every screen size. Your site will look perfect on any device.",
  },
  {
    id: 5,
    serial: "05",
    title: "Ready-Made Templates",
    shortDesc: "Kickstart your project with beautiful templates crafted for real-world use case.",
  },
];

function Features() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="bg-[var(--color-light)]"
    >
      <div className="max-w-[1420px] px-2.5 py-[50px] md:mx-auto">
        {/* Head title */}
        <div className="flex items-end justify-between mb-[20px]">
          <motion.div variants={headingVariants} className={cn("text-[80px] font-black uppercase leading-20")}>
            <div>Build</div>
            <div>for creators</div>
          </motion.div>

          <motion.div variants={descVariants}>
            <p className={cn("font-caveat text-[16px] max-w-[230px]")}>
              Everything you need to design, build and lunch stunning websites faster.
            </p>
            <img src={images.vector1} alt="vector" className="ml-auto" />
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          variants={cardsContainerVariants}
          className={cn("flex items-center justify-between divide-x divide-[var(--color-dark)]/20")}
        >
          {FEATURES.map((feat) => {
            return (
              <FeatureCard key={feat.id} serial={feat.serial} title={feat.title} shortDesc={feat.shortDesc} link="" />
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Features;

interface FeatureCardProps {
  serial: string;
  title: string;
  shortDesc: string;
  link?: string;
}

function FeatureCard({ serial, title, shortDesc, link }: FeatureCardProps) {
  return (
    <motion.div variants={cardVariants} className={cn("grid grid-rows-[auto_1fr_1fr_auto]")}>
      <h1 className={cn("font-antonio font-bold text-[150px] leading-45")}>{serial}</h1>
      <h3 className={cn("font-bold text-[25px] uppercase max-w-[200px] h-[75px] mb-[30px]")}>{title}</h3>
      <p className={cn("font-medium text-[16px] max-w-[230px]")}>{shortDesc}</p>
      <Link
        to={link}
        className={cn(
          "group inline-flex items-center gap-5",
          "text-[16px] font-medium text-[var(--color-primary)]",
          "transition-colors duration-300 hover:text-[var(--color-dark)]",
        )}
      >
        <span>Learn more</span>

        <ArrowRightIcon size={20} className="transition-transform duration-300 ease-out group-hover:translate-x-2" />
      </Link>
    </motion.div>
  );
}
