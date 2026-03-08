// src/pages/Post.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'sonner';

// Componentes de Post
import PostHeader from '../components/post/PostHeader';
import PostContent from '../components/post/PostContent';
import TableOfContents from '../components/post/TableOfContents';
import RelatedPosts from '../components/post/RelatedPosts';
import CommentsSection from '../components/post/CommentsSection';

// Componentes UI
import ProgressBar from '../components/ui/ProgressBar';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Tabla de contenidos
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const headings = tempDiv.querySelectorAll('h2');
    return Array.from(headings).map((heading, index) => ({
      id: heading.id || `section-${index}`,
      title: heading.textContent || '',
    }));
  }, [post?.content]);

  // Fetch post
  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      setLoading(true);
      
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, title, summary, content, image_url, published_at, read_time, authors(name, username), categories(name), types(name)')
          .eq('id', id)
          .single();

        if (postError) throw postError;
        if (!postData) {
          navigate('/');
          return;
        }
        
        setPost(postData);
        document.title = `${postData.title} - Xtracta`;
        
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar el artículo');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, navigate]);

  // Asignar IDs a H2
  useEffect(() => {
    if (!post?.content) return;
    
    const timer = setTimeout(() => {
      const contentElement = document.querySelector('.article-content');
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll('h2');
      if (headings.length === 0) return;
      
      headings.forEach((heading, index) => {
        const id = `section-${index}`;
        heading.id = id;
        heading.style.scrollMarginTop = '120px';
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [post?.content]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowScrollTop(scrollTop > 600);

      if (tableOfContents.length > 0) {
        const scrollPosition = scrollTop + 250;
        for (let i = tableOfContents.length - 1; i >= 0; i--) {
          const element = document.getElementById(tableOfContents[i].id);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(tableOfContents[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-semibold">Cargando artículo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <h2 className="text-3xl font-bold text-gray-900">Artículo no encontrado</h2>
        <p className="text-gray-500 text-lg">El artículo que buscas no existe.</p>
      </div>
    );
  }

  // Render
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <ProgressBar progress={readingProgress} />

      <div className="bg-white min-h-screen">
        <div className="max-w-7xl container mx-auto px-3 pt-19 pb-20 grow">
          
          <PostHeader post={post} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <TableOfContents 
                  sections={tableOfContents} 
                  activeSection={activeSection} 
                />
              </div>
            </aside>

            <main className="lg:col-span-9">
              <PostContent post={post} />
              <CommentsSection />
            </main>
          </div>
          
          {/* RelatedPosts FUERA del grid, abajo de todo */}
          <RelatedPosts />
        </div>
      </div>

      <ScrollToTopButton show={showScrollTop} />
    </>
  );
}