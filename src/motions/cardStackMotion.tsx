import type { Variants } from "framer-motion";

export const cardStackVariant = (rotate: number, y: number, delay: number, initialY: number): Variants => ({
  hidden: {
    opacity: 0,
    y: initialY,
    rotate: 0,
  },

  visible: {
    opacity: 1,
    y,
    rotate,

    transition: {
      duration: 0.8,
      delay: delay * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});
