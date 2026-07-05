import type { Variants } from "framer-motion";

export const headingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const descVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const cardsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.35,
    },
  },
};

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const componentRowVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const componentCardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    rotate: -7,
    rotateX: -10,
  },

  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    rotateX: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const ctaVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const badgeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
    rotate: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const badgeContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

export const moreVariants: Variants = {
  hidden: {
    opacity: 0,
    rotate: -8,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    rotate: -3,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const templateLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -120,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const templateCenterVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const templateRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 120,
    rotate: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
