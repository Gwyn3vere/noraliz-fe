import { useState, useCallback, useRef } from "react";
import type { MenuItem } from "@/types";

const HOVER_OPEN_DELAY = 200; // Delay mở menu khi hover vào category
const HOVER_CLOSE_DELAY = 150; // Delay đóng menu khi rời khỏi category hoặc menu

export function useBlockMenu() {
  const [pinnedCategory, setPinnedCategory] = useState<MenuItem | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<MenuItem | null>(null);

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeBlockMenu = pinnedCategory || hoveredCategory;

  // ===== CLICK: Ghim menu =====
  const handlePinCategory = useCallback((category: MenuItem) => {
    // Hủy tất cả timer
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);

    setPinnedCategory(category);
    setHoveredCategory(null);
  }, []);

  // ===== HOVER vào category con =====
  const handleHoverCategory = useCallback(
    (category: MenuItem) => {
      if (pinnedCategory) return;

      // Hủy timer đóng menu (nếu có) – quan trọng để giữ menu mở
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }

      // Hủy timer mở menu cũ (nếu đang chờ mở category khác)
      if (openTimerRef.current) clearTimeout(openTimerRef.current);

      // Đặt timer mở menu mới
      openTimerRef.current = setTimeout(() => {
        setHoveredCategory(category);
        openTimerRef.current = null;
      }, HOVER_OPEN_DELAY);
    },
    [pinnedCategory],
  );

  // ===== RỜI chuột khỏi category con =====
  const handleLeaveCategory = useCallback(() => {
    if (pinnedCategory) return;

    // Hủy timer mở menu nếu đang chờ
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    // Đặt timer đóng menu (có thể bị hủy nếu chuột vào menu hoặc category khác)
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCategory(null);
      leaveTimerRef.current = null;
    }, HOVER_CLOSE_DELAY);
  }, [pinnedCategory]);

  // ===== Chuột VÀO Menu =====
  const handleEnterMenu = useCallback(() => {
    // Hủy timer đóng menu (nếu có) – giữ menu mở khi chuột vào menu
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  // ===== Chuột RỜI Menu =====
  const handleLeaveMenu = useCallback(() => {
    if (pinnedCategory) return;

    // Đặt timer đóng menu (có thể bị hủy nếu chuột vào category con)
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCategory(null);
      leaveTimerRef.current = null;
    }, HOVER_CLOSE_DELAY);
  }, [pinnedCategory]);

  // ===== ĐÓNG menu hoàn toàn (click nút X hoặc backdrop) =====
  const handleCloseBlockMenu = useCallback(() => {
    // Hủy tất cả timer để tránh chúng thay đổi state sau khi đã đóng
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setPinnedCategory(null);
    setHoveredCategory(null);
  }, []);

  return {
    activeBlockMenu,
    pinnedCategory,
    handlePinCategory,
    handleHoverCategory,
    handleLeaveCategory,
    handleEnterMenu,
    handleLeaveMenu,
    handleCloseBlockMenu,
  };
}
