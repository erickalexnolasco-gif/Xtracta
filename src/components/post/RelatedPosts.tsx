// src/components/post/RelatedPosts.tsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SocialPostCard from '../category/SocialPostCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RelatedPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Referencia para controlar el scroll del carrusel
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        // 👇 CAMBIO 1: Consulta idéntica a la de BlogGrid para asegurar que las métricas funcionen
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, summary, image_url, published_at, views, likes, shares, authors(name,username,avatar), categories(name)')
          .order('published_at', { ascending: false })
          .limit(6); // 👇 Aumentamos el límite a 6 para que haya elementos para deslizar

        if (error) throw error;
        if (data) setPosts(data);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, []);

  // Función para los botones del carrusel
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Cantidad de pixeles a desplazar
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="mt-20 md:mt-32 border-t border-gray-100 pt-16">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="mt-20 md:mt-32 border-t border-gray-100 pt-16 md:pt-24 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 md:mb-12">
        <div>
          <h2 className="text-3xl md:text-[36px] font-bold tracking-tight text-[#1d1d1f] leading-tight">
            Artículos relacionados
          </h2>
          <p className="text-[#86868b] font-medium mt-2 md:mt-3 text-sm md:text-base">
            Tendencias y guías que definen el sector contable hoy.
          </p>
        </div>
        
        {/* Controles del Carrusel (Botones + Enlace "Ver todo") */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 font-bold text-[14px] md:text-[15px] hover:text-blue-700 hover:underline transition-colors"
          >
            Ver todo <span className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* 👇 EL CARRUSEL 👇 */}
      {/* Usamos snap-x para que en móviles se sienta como un swiper nativo */}
      <div className="-mx-4 px-4 md:mx-0 md:px-0">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Oculta la barra de scroll en Firefox/IE
        >
          {posts.map((post) => (
            <div 
              key={post.id} 
              // En móvil la card ocupa el 85% de la pantalla, en tablet/desktop tiene ancho fijo
              className="snap-start shrink-0 w-[85vw] sm:w-87.5"
            >
              <SocialPostCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Opcional: Estilos para ocultar la barra de scroll en Chrome/Safari directamente aquí */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}