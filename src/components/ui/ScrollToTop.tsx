//src/components/ui/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // Obtenemos la ubicación actual (URL)
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que el pathname cambie (ej. de / a /post/1)
    // mandamos el scroll al inicio de forma instantánea
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente no renderiza nada visual
}