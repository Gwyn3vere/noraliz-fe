import type { Variants } from "framer-motion";

export const ctaVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      delay: 1.8,
    },
  },
};

export const ctaButtonVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      delay: 2,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};
