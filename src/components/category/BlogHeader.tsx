import { Search } from 'lucide-react';

export default function BlogHeader({ onSearch }: { onSearch: (val: string) => void }) {
  return (
    <div className="text-center pt-12 pb-8 space-y-4">
      {/* Cambiado de font-black a font-bold y tracking-tight */}
      <h1 className="text-5xl md:text-7xl font-semibold text-gray-900 tracking-tight">
        Nuestro Blog <span className="text-blue-600 font-semibold">Xtracta</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
        Pasión por la contabilidad inteligente y la tecnología.
      </p>

      <div className="max-w-2xl mx-auto pt-6 relative">
        <div className="relative flex items-center group">
            <Search className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="¿Qué quieres leer hoy?..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-gray-100/50 hover:bg-gray-100 text-gray-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200 font-medium"
            />
        </div>
      </div>
    </div>
  );
}