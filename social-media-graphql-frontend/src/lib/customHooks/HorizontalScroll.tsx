import { useRef, useEffect, RefObject } from "react";

export function useHorizontalScroll(): RefObject<HTMLDivElement> {
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        const scrollAmount = e.deltaY;
        el.scrollTo({
          left: el.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
}
