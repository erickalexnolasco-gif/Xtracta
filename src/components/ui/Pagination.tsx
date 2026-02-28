//src/components/ui/Pagination.tsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Definimos qué información necesita este componente para funcionar
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Si solo hay una página, no mostramos nada (estilo Darwin)
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 py-10 flex-wrap">
      
      {/* Botón Primera */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-5 py-2 rounded-full border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-all disabled:opacity-30"
      >
        « Primera
      </button>

      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 rounded-full border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-all disabled:opacity-30"
      >
        ← Anterior
      </button>

      {/* Números de página */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-full font-semibold transition-all ${
              currentPage === i + 1 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
              : "text-gray-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        
        className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-30"
      >
        Siguiente →
      </button>

      {/* Botón Última */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        
        className="px-5 py-2 rounded-full border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-all disabled:opacity-30"
      >
        Última ({totalPages}) »
      </button>
    </div>
  );
}