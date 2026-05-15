import { useState, useCallback, useEffect, useRef } from "react";

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

export function useCanvasInteraction(initialZoom = 100, disabled?: boolean) {
  const [zoom, setZoom] = useState(initialZoom);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleFit = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      if (e.button !== 0) return;
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },
    [disabled],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      if (!isPanning) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [isPanning, disabled],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Sự kiện wheel để zoom (Ctrl+Scroll) hoặc pan dọc (Scroll thường)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Zoom
        e.preventDefault();
        setZoom((prev) => {
          const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
          return Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM);
        });
      } else {
        // Pan dọc
        e.preventDefault();
        setPanOffset((prev) => ({
          x: prev.x,
          y: prev.y - e.deltaY,
        }));
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  return {
    zoom,
    panOffset,
    isPanning,
    canvasRef,
    handleZoomIn,
    handleZoomOut,
    handleFit,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
