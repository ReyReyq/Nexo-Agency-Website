import { useEffect, useCallback } from "react";

/**
 * Hook to handle Escape key press for closing modals/overlays
 * @param onEscape - Callback function to execute when Escape is pressed
 * @param isActive - Whether the escape key listener should be active (default: true)
 */
export function useEscapeKey(onEscape: () => void, isActive: boolean = true) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape();
      }
    },
    [onEscape]
  );

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape, isActive]);
}

export default useEscapeKey;
