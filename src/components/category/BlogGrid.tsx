// src/components/category/BlogGrid.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Pagination from "../ui/Pagination";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // 👈 Importar Auth

// IMPORTAMOS LAS NUEVAS CARDS SOCIALES
import SocialFeaturedCard from "./SocialFeaturedCard";
import SocialPostCard from "./SocialPostCard";

interface BlogGridProps {
  selectedCategory: string;
  searchQuery: string;
}

export default function BlogGrid({
  selectedCategory,
  searchQuery,
}: BlogGridProps) {
  const { user } = useAuth(); // 👈 Obtenemos el usuario
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]); // 👈 Estado para guardar los IDs que le gustan al usuario
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Cargar Posts
  useEffect(() => {
    async function fetchPosts() {
      
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(
            "id, title, summary, image_url, published_at, views, likes, shares, authors(name,username,avatar), categories(name)",
          )
          .order("published_at", { ascending: false });
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.log(error);
        setPosts([]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // 👇 Cargar Likes del Usuario (Solo si está logueado)
  useEffect(() => {
    async function fetchLikedPosts() {
      if (!user) {
        setLikedPostIds([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        if (!error && data) {
          // Extraemos solo los IDs en un arreglo simple ["id1", "id2"]
          setLikedPostIds(data.map(like => like.post_id));
        }
      } catch (err) {
        console.error("Error al cargar favoritos", err);
      }
    }
    
    fetchLikedPosts();
  }, [user]);

  // 👇 Lógica de filtrado actualizada
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Si seleccionó "Mis Favoritos", ignoramos la categoría normal y filtramos por ID
    if (selectedCategory === "Likes") {
      const isLiked = likedPostIds.includes(post.id);
      return matchesSearch && isLiked;
    }

    // Comportamiento normal para el resto de categorías
    const matchesCategory = selectedCategory === "Todas" || post.categories?.name === selectedCategory;
    return matchesCategory && matchesSearch;
  });

  const [prevCategory, setPrevCategory] = useState(selectedCategory);
  const [prevSearch, setPrevSearch] = useState(searchQuery);

  if (selectedCategory !== prevCategory || searchQuery !== prevSearch) {
    setPrevCategory(selectedCategory);
    setPrevSearch(searchQuery);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Cargando feed social...</p>
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl text-slate-300 italic font-light">
            {/* 👇 Mensaje personalizado si no tiene favoritos */}
            {selectedCategory === "Likes" 
              ? "Aún no tienes posts guardados en favoritos." 
              : "No hay actualizaciones por ahora."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post, index) => {
              if (index === 0 && currentPage === 1) {
                return <SocialFeaturedCard key={post.id} post={post} />;
              }
              return <SocialPostCard key={post.id} post={post} />;
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </section>
  );
}