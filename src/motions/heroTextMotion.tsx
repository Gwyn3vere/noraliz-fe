import type { Variants } from "framer-motion";

export const heroTextVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(10px)",
  },

  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
