//src/components/category/CategoryBar.tsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          // Fallback categories if Supabase fails
          setCategories([
            { id: 1, name: 'SAT' },
            { id: 2, name: 'Nómina' },
            { id: 3, name: 'Impuestos' },
            { id: 4, name: 'Casos de Éxito' },
            { id: 5, name: 'Tecnología Contable' },
            { id: 6, name: 'Noticias' },
            { id: 7, name: 'Guías Prácticas' },
          ]);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Handle scroll indicators
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftFade(scrollLeft > 10);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [categories]);

  // Scroll selected into view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const selectedButton = container.querySelector(`[data-category="${selectedCategory}"]`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="w-full mb-12 flex justify-center py-4">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  const allCategories = [{ id: 0, name: 'Todas' }, ...categories];

  return (
    <div className="w-full mb-12 relative">
      {/* Left fade */}
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Right fade */}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto py-4 no-scrollbar scroll-smooth"
      >
        {allCategories.map((cat, index) => {
          const isActive = cat.name === selectedCategory;

          return (
            <motion.button
              key={cat.id}
              data-category={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`
                text-sm font-semibold whitespace-nowrap px-6 py-2 rounded-full 
                transition-all duration-300 ease-out shrink-0
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'text-gray-600 bg-transparent hover:bg-blue-600 hover:text-white hover:scale-110'
                }
              `}
            >
              {cat.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}