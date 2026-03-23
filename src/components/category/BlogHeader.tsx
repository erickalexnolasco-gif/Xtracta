//src/components/category/BlogHeader.tsx
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogHeader({ onSearch }: { onSearch: (val: string) => void }) {
  return (
    <div className="text-center pb-8 space-y-2 md:space-y-4">
      {/* Cambiado de font-black a font-bold y tracking-tight */}
      <motion.h1 initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-light text-gray-900 tracking-tight" style={{ fontFamily: 'MuseoModerno, sans-serif' }} >Xtracta
        <span className="text-blue-600 text-4xl md:text-5xl font-normal"> blog</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} 
        className="text-md md:text-xl text-gray-400 max-w-2xl mx-auto font-normal">
        Pasión por la contabilidad inteligente y la tecnología.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }} className="max-w-2xl mx-auto px-6 md:px-0 pt-6 relative">
        <div className="relative flex items-center group">
            <Search className="absolute left-4 text-gray-400 group-hover:text-blue-600 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="¿Qué quieres leer hoy?..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-gray-100 hover:bg-white focus:bg-white text-gray-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200 md:text-md lg:text-lg font-normal md:font-medium"
            />
        </div>
      </motion.div>
    </div>
  );
}