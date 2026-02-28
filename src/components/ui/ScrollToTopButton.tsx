// src/components/ui/ScrollToTopButton.tsx
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  show: boolean;
}

export default function ScrollToTopButton({ show }: ScrollToTopButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 hover:rotate-12"
      aria-label="Volver arriba"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}