import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // Importamos la conexión
import Pagination from '../ui/Pagination';
import { FileText, Clock, Loader2 } from 'lucide-react';

interface BlogGridProps {
  selectedCategory: string;
  searchQuery: string;
}

export default function BlogGrid({ selectedCategory, searchQuery }: BlogGridProps) {
  const [posts, setPosts] = useState<any[]>([]); // Estado para los posts de Supabase
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Cargar datos desde Supabase
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
    // ESTO TE DIRÁ EL ERROR REAL EN LA CONSOLA DEL NAVEGADOR
    console.error('¡ERROR DE SUPABASE!', error); 
  } else {
    console.log('¡DATOS RECIBIDOS!', data);
    setPosts(data || []);
  }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Filtrado (ahora sobre el estado 'posts')
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-gray-500 font-medium">Sincronizando con la base de datos...</p>
    </div>
  );

  return (
    <section>
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl text-gray-300 italic font-light">No hay resultados.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {currentPosts.map((post, index) => {
              const isFeatured = index === 0 && currentPage === 1;

              return (
                <Link 
                  to={`/post/${post.id}`} 
                  key={post.id} 
                  className={`group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                    isFeatured ? "lg:col-span-3 lg:flex-row h-auto" : "h-full"
                  }`}
                >
                  <div className={`relative shrink-0 ${
                    isFeatured ? "lg:w-1/3 w-full h-64 lg:h-auto" : "w-full aspect-video"
                  }`}>
                    <img 
                      src={post.image_url || "https://via.placeholder.com/800x600"} 
                      alt={post.title} 
                      className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${
                        isFeatured ? "rounded-b-3xl lg:rounded-b-none lg:rounded-l-3xl" : "rounded-b-3xl"
                      }`}
                    />
                  </div>

                  <div className={`flex flex-col grow p-6 lg:p-10 space-y-4 ${
                    isFeatured ? "lg:w-2/3 justify-center" : ""
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-3 py-1.5 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className={`font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors ${
                        isFeatured ? "text-2xl md:text-4xl" : "text-lg"
                      }`}>
                        {post.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 font-medium">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-3 pt-4 border-t border-gray-50 ${isFeatured ? "mt-6" : "mt-auto"}`}>
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                           <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-gray-900 font-bold tracking-tight">
                        {post.author} <span className="text-gray-400 font-medium ml-1">– {new Date(post.published_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </section>
  );
}