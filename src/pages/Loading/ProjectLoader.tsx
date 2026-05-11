import { useEffect, useRef, useState } from "react";
import { loaderStyles as styles } from "@/pages/Loading/Loader.styles";
import { cn } from "@/lib/utils";

interface ProjectLoaderProps {
  onReady: () => void;
  isWaiting: boolean;
}

const TYPING_TEXT = "Crafting a seamless customization workspace.";
const CRAWL_DURATION = 2000; // 2s để crawl từ 0 → 20%
const STAGGER_POINT = 0.2; // Dừng tại 20%
const SPRINT_DURATION = 600; // 600ms nước rút từ 20% → 100%

type Phase = "crawl" | "stagger" | "sprint";

export default function ProjectLoader({ onReady, isWaiting }: ProjectLoaderProps) {
  const [fillPercent, setFillPercent] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("crawl");
  const sprintStartRef = useRef<number>(0);
  const isWaitingRef = useRef(isWaiting);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCalledReadyRef = useRef(false);

  // Đồng bộ isWaiting → ref, không trigger re-render
  useEffect(() => {
    isWaitingRef.current = isWaiting;
  }, [isWaiting]);

  useEffect(() => {
    startTimeRef.current = performance.now();
    phaseRef.current = "crawl";

    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const apiDone = !isWaitingRef.current;

      // ── Typing text: luôn chạy tuyến tính trong CRAWL_DURATION ──
      const typingProgress = Math.min(elapsed / CRAWL_DURATION, 1);
      setDisplayedText(TYPING_TEXT.slice(0, Math.floor(typingProgress * TYPING_TEXT.length)));

      // ── State machine cho fill ──
      let fillProgress = 0;

      if (phaseRef.current === "crawl") {
        fillProgress = typingProgress * STAGGER_POINT;

        // Chuyển sang stagger khi đã đạt 20% (typing xong)
        if (typingProgress >= 1) {
          phaseRef.current = "stagger";
          fillProgress = STAGGER_POINT;
        }
      }

      if (phaseRef.current === "stagger") {
        fillProgress = STAGGER_POINT;

        // Chuyển sang sprint khi API đã xong
        if (apiDone) {
          phaseRef.current = "sprint";
          sprintStartRef.current = now;
        }
      }

      if (phaseRef.current === "sprint") {
        const sprintElapsed = now - sprintStartRef.current;
        const sprintProgress = Math.min(sprintElapsed / SPRINT_DURATION, 1);
        // Ease-out cubic để cảm giác tự nhiên hơn
        const eased = 1 - Math.pow(1 - sprintProgress, 3);
        fillProgress = STAGGER_POINT + eased * (1 - STAGGER_POINT);

        if (sprintProgress >= 1) {
          fillProgress = 1;
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }

      setFillPercent(Math.round(fillProgress * 100));
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Fade out khi fill đạt 100%
  useEffect(() => {
    if (fillPercent >= 100 && !isWaiting && !hasCalledReadyRef.current) {
      hasCalledReadyRef.current = true;
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(onReady, 500);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [fillPercent, isWaiting, onReady]);

  return (
    <div className={cn(styles.container, "transition-opacity duration-500", isFadingOut ? "opacity-0" : "opacity-100")}>
      <div className="flex flex-col items-center">
        <div className="bg-[var(--color-dark)]/5 inline-flex items-center gap-2 py-3 px-4 rounded-full border border-[var(--color-dark)]/10">
          <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="font-medium">System Active</span>
        </div>

        <div className={styles.brandWrapper}>
          <span className={styles.brandDark}>NORALIZ</span>
          <span className={styles.brandOrange} style={{ width: `${fillPercent}%` }}>
            NORALIZ
          </span>
        </div>

        <p className="text-sm text-gray-500 h-5">
          {displayedText}
          {fillPercent < 100 && (
            <span className="inline-block w-0.5 h-4 bg-[var(--color-primary)] ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}
