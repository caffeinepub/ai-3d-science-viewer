import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "smartboard_mode";

function detectSmartBoard(): boolean {
  // Auto-detect: large screen with touch support
  const hasTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  const isLargeScreen = window.innerWidth >= 1600;
  return hasTouch && isLargeScreen;
}

export function useSmartBoard() {
  const [isSmartBoard, setIsSmartBoard] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "true";
    return detectSmartBoard();
  });

  // Re-evaluate on resize if no manual override
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return; // manual override exists, skip auto-detect
    const onResize = () => setIsSmartBoard(detectSmartBoard());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSmartBoard = useCallback(() => {
    setIsSmartBoard((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { isSmartBoard, toggleSmartBoard };
}
