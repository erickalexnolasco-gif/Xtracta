//src/components/category/BlogHeader.tsx
import { Search } from 'lucide-react';

export default function BlogHeader({ onSearch }: { onSearch: (val: string) => void }) {
  return (
    <div className="text-center pb-8 space-y-4">
      {/* Cambiado de font-black a font-bold y tracking-tight */}
      <h1 className="text-5xl md:text-7xl font-light text-gray-900 tracking-tight" style={{ fontFamily: 'MuseoModerno, sans-serif' }} >
        Xtracta<span className="text-blue-600 text-5xl font-normal" style={{ fontFamily: 'Helvetica Neue, sans-serif' }} > blog</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto font-normal">
        Pasión por la contabilidad inteligente y la tecnología.
      </p>

      <div className="max-w-2xl mx-auto pt-6 relative">
        <div className="relative flex items-center group">
            <Search className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="¿Qué quieres leer hoy?..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-white hover:bg-gray-100 text-gray-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200 font-medium"
            />
        </div>
      </div>
    </div>
  );
}