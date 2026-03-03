//src/components/category/BlogGrid.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Pagination from '../ui/Pagination';
import { Loader2 } from 'lucide-react';

// IMPORTAMOS LAS NUEVAS CARDS SOCIALES
import SocialFeaturedCard from './SocialFeaturedCard';
import SocialPostCard from './SocialPostCard';

interface BlogGridProps {
  selectedCategory: string;
  searchQuery: string;
}

export default function BlogGrid({ selectedCategory, searchQuery }: BlogGridProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select("id, title, summary, image_url, published_at, views, likes, shares, authors(name,username), categories(name)")
        .order('published_at', { ascending: false });

      if (error) {
        console.error('¡ERROR DE SUPABASE!', error); 
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "Todas" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-medium">Cargando feed social...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl text-slate-300 italic font-light">No hay actualizaciones por ahora.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {currentPosts.map((post, index) => {
              // La primera tarjeta de la página 1 es la destacada (2 columnas)
              if (index === 0 && currentPage === 1) {
                return <SocialFeaturedCard key={post.id} post={post} />;
              }
              // Las demás son normales (1 columna)
              return <SocialPostCard key={post.id} post={post} />;
            })}
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </>
      )}
    </section>
  );
}