import { createContext, useContext } from "react";

interface CanvasContextValue {
  panOffset: { x: number; y: number };
  zoom: number;
}

export const CanvasContext = createContext<CanvasContextValue>({
  panOffset: { x: 0, y: 0 },
  zoom: 100,
});

export const useCanvasContext = () => useContext(CanvasContext);
