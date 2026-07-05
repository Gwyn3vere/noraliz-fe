import { cn } from "@/lib/utils";
import { images } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cardStackVariant } from "@/motions/cardStackMotion";
import { heroTextVariant } from "@/motions/heroTextMotion";
import { ctaVariant, ctaButtonVariant } from "@/motions/heroCTAMotion";

const CARDS = [
  {
    id: 1,
    thumbnail: "https://i.pinimg.com/736x/45/e0/75/45e0752b921a1c741b576a95a670cc90.jpg",
    tag: {
      text: "Landing Page",
      x: 20,
      y: 270,
      bg: "#ffd60c",
      delay: 1.5,
      pointer: {
        x: "30%",
        y: "top",
      },
    },
  },
  { id: 2, thumbnail: "https://i.pinimg.com/1200x/fb/48/ed/fb48ed47ab2a0119a80eaab286f7ef84.jpg" },
  { id: 3, thumbnail: "https://i.pinimg.com/736x/b4/75/74/b47574f6a9be9c21b30b53aae56e0660.jpg" },
  { id: 4, thumbnail: "https://i.pinimg.com/736x/e4/31/af/e431af80829a0c085e1719cc63e26b29.jpg" },
  { id: 5, thumbnail: "https://i.pinimg.com/736x/7e/b2/85/7eb285584081bc2e268c81a2d4176449.jpg" },
  { id: 6, thumbnail: "https://i.pinimg.com/736x/48/b2/d5/48b2d5e780948f5bed0daabd032ac9ec.jpg" },
  {
    id: 7,
    thumbnail: "https://i.pinimg.com/1200x/07/3e/5c/073e5c907f6c9b92f13a9b7aacbc62da.jpg",
    tag: {
      text: "Portfolio",
      x: 60,
      y: -60,
      bg: "#016a4c",
      delay: 1.5,
      pointer: {
        x: "30%",
        y: "bottom",
      },
    },
  },
];

const CARD_TRANSFORMS = [
  { rotate: -10, y: 60, initialY: 400, delay: 10 },
  { rotate: -8, y: 0, initialY: 400, delay: 13 },
  { rotate: -5, y: 25, initialY: 400, delay: 9 },
  { rotate: 0, y: 0, initialY: 400, delay: 11 },
  { rotate: 5, y: -3, initialY: 400, delay: 7 },
  { rotate: 8, y: 40, initialY: 400, delay: 15 },
  { rotate: 10, y: 40, initialY: 400, delay: 13 },
];

function Hero() {
  return (
    <section
      className={cn(
        "h-screen max-w-[1420px] px-2.5 md:mx-auto",
        "flex flex-col items-center justify-center gap-[30px]",
      )}
    >
      {/* Hero text shadow */}
      <div className="relative inline-block">
        <motion.h1
          variants={heroTextVariant}
          initial="hidden"
          animate="visible"
          className={cn(
            "font-black italic uppercase",
            "text-[60px] md:text-[100px] xl:text-[150px]",
            "text-[var(--color-light)]",
            "[-webkit-text-stroke:1px_black]",
            "hero-text-shadow",
            "font-general",
          )}
        >
          Explore
        </motion.h1>
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
          alt="doodle"
          className={cn("absolute top-1/2 -right-30 -translate-y-[50%]")}
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
          alt="doodle"
          className={cn("absolute top-10 -right-40 -translate-y-[50%]", "w-8 h-8", "animate-sparkle")}
        />
      </div>

      {/* Card gallary */}
      <div className="flex relative">
        {CARDS.map((card, index) => {
          return (
            <motion.div
              key={card.id}
              className={cn(
                "relative",
                "w-[250px] h-[250px] rounded-[20px]",
                "bg-[var(--color-light)]",
                index !== 0 && "-ml-18",
                "shadow-lg",
                "transition-all duration-300 ease-out hover:-translate-y-5 hover:scale-105",
              )}
              variants={cardStackVariant(
                CARD_TRANSFORMS[index].rotate,
                CARD_TRANSFORMS[index].y,
                CARD_TRANSFORMS[index].delay,
                CARD_TRANSFORMS[index].initialY,
              )}
              initial="hidden"
              animate="visible"
            >
              <img src={card.thumbnail} alt="thumbnail" className="w-full h-full object-cover rounded-[20px]" />

              {card.tag && (
                <div
                  className={cn("absolute px-4 py-1 rounded-full text-white bg-black shadow-md")}
                  style={{
                    left: card.tag.x,
                    top: card.tag.y,
                    background: card.tag.bg,
                  }}
                >
                  @{card.tag.text}
                  <div
                    className="absolute w-4 h-4 rotate-0 rounded-[3px]"
                    style={{
                      backgroundColor: card.tag.bg,

                      left: card.tag.pointer.x,
                      transform: "translateX(-50%) rotate(45deg)",

                      ...(card.tag.pointer.y === "bottom" ? { bottom: -8 } : { top: -8 }),
                    }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}

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
          alt="doodle"
          className={cn("absolute top-10 -left-15 -translate-y-[50%]", "animate-sparkle")}
        />
      </div>

      {/* CTA Button */}
      <div className={cn("relative mt-15", "flex flex-col items-center justify-center gap-[30px]")}>
        <motion.div
          variants={ctaVariant}
          initial="hidden"
          animate="visible"
          className={cn("text-[16px] lg:text-[20px] font-medium text-center")}
        >
          <p>The visual workspace for building modern web experiences.</p>
          <p>From your first component to your next big product.</p>
        </motion.div>

        <motion.div variants={ctaButtonVariant} initial="hidden" animate="visible">
          <Button
            className={cn(
              "w-auto h-[50px] px-6",
              "bg-[var(--color-primary)] !rounded-full",
              "border border-[var(--color-dark)]",
              "shadow-[var(--shadow-brutalism-xs)]",
              "text-[var(--color-light)] text-[16px] !font-bold",
            )}
          >
            Get Started
          </Button>
        </motion.div>

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
          alt="doodle"
          className={cn("absolute top-20 -left-10 -translate-y-[50%]", "w-5 h-5", "animate-sparkle")}
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
          alt="doodle"
          className={cn("absolute top-10 -right-30 -translate-y-[50%]", "animate-sparkle")}
        />
      </div>
    </section>
  );
}

export default Hero;
