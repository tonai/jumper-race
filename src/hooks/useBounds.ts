import { useEffect, useRef, useState } from "react";

export function useBounds() {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<DOMRect>();

  useEffect(() => {
    function resize() {
      setBounds(ref.current?.getBoundingClientRect());
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return { bounds, ref };
}
