// src/components/category/CategoryBar.tsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, Heart } from 'lucide-react'; // 👈 Agregamos Heart
import { useAuth } from '../../contexts/AuthContext'; // 👈 Importamos useAuth

interface Category {
  id: number | string; // 👈 Permitimos string para el ID especial
  name: string;
}

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const { user } = useAuth(); // 👈 Obtenemos el usuario
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          setCategories([
            { id: 1, name: 'SAT' },
            { id: 2, name: 'Nómina' },
            { id: 3, name: 'Impuestos' },
          ]);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      }
        setLoading(false);
      
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftFade(scrollLeft > 10);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [categories]);

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

  // 👇 LÓGICA DEL BOTÓN "MIS FAVORITOS"
  const baseCategories: Category[] = [{ id: 0, name: 'Todas' }];
  
  // Si el usuario está logueado, metemos la opción de favoritos
  if (user) {
    baseCategories.push({ id: 'favoritos', name: 'Likes' });
  }

  const allCategories = [...baseCategories, ...categories];

  return (
    <div className="w-full mb-12 relative">
      {showLeftFade && (
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
      )}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={scrollRef}
        className="flex items-center justify-start gap-2 md:gap-4 overflow-x-auto md:px-1 py-4 no-scrollbar scroll-smooth px-1"
      >
        {allCategories.map((cat, index) => {
          const isActive = cat.name === selectedCategory;
          const isFavorites = cat.name === 'Likes';

          return (
            <motion.button
              key={cat.id}
              data-category={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-1.5 text-sm md:text-base font-semibold whitespace-nowrap px-6 py-2 rounded-full 
                transition-all duration-300 ease-out shrink-0
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'text-blue-600 bg-transparent border border-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110'
                }
              `}
            >
              {/* 👇 Si es el botón de favoritos, le ponemos el ícono */}
              {isFavorites && <Heart className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />}
              {cat.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}