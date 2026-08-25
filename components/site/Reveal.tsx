"use client";

import { useEffect, useRef, useState } from "react";

/** Entrada suave por IntersectionObserver — sem lib, e obediente a reduced-motion. */
export default function Reveal({
  children,
  atraso = 0,
  className = "",
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dentro, setDentro] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // já rolou para além do elemento: mostra na hora em vez de ficar invisível
    if (el.getBoundingClientRect().bottom < 0) {
      setDentro(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDentro(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-in={dentro}
      style={{ transitionDelay: `${atraso}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
