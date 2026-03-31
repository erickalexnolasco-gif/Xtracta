// src/components/post/PostContent.tsx
import DOMPurify from 'dompurify';
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import { usePostMetrics } from '../../hooks/usePostMetrics';
import { toast } from 'sonner';
import { useState } from 'react';
import LoginPrompt from '../auth/LoginPrompt';

interface PostContentProps {
  post: any;
}

export default function PostContent({ post }: PostContentProps) {
  const { metrics, isLiked, toggleLike, handleShare, isLoggedIn } = usePostMetrics(post.id);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const onLike = async () => {
    const success = await toggleLike();
    if (!success) {
      setShowLoginPrompt(true);
    }
  };

  const onComment = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    // Aquí iría la lógica de comentarios
    toast.info('Función de comentarios próximamente');
  };

  const onShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('¡Link copiado!');
      handleShare();
    } catch (error) {
      toast.error('Error al copiar link');
    }
  };

  return (
    <>
      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />

      {/* Lead/Intro grande ANTES de la imagen */}
      {post.summary && (
        <p className="text-[17px] md:text-2xl text-gray-500 font-medium leading-[1.4] mb-8 md:mb-16 tracking-tight">
          {post.summary}
        </p>
      )}

      {/* Imagen destacada con caption */}
      {post.image_url && (
        <figure className="mb-8 sm:mb-12 md:mb-16">
          <img 
            alt={post.title}
            className="rounded-2xl w-full h-auto object-cover aspect-video shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/6" 
            src={post.image_url}
          />
          <figcaption className="text-[13px] text-center mt-6 text-[#86868b] font-sans italic">
            {post.title}. © 2024 Xtracta
          </figcaption>
        </figure>
      )}

      {/* Contenido del artículo */}
      <article 
        className="article-content"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(post.content)
        }} 
      />

      {/* Footer con stats y tags - CON DATOS REALES */}
      <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onLike}
            className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group hover:scale-105 transition-transform"
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                isLiked 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-400 group-hover:text-red-500'
              }`}
            />
            <span>{metrics.likes} <span className="text-gray-400 font-normal">Likes</span></span>
          </button>
          
          <button 
            onClick={onComment}
            className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span>18 <span className="text-gray-400 font-normal">Comentarios</span></span>
          </button>
          
          <div className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f]">
            <Eye className="w-5 h-5 text-gray-400" />
            <span>{metrics.views} <span className="text-gray-400 font-normal">Vistas</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onShare}
            className="flex items-center gap-2 text-[13px] font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {metrics.shares > 0 && <span>{metrics.shares}</span>}
          </button>
          
          <a className="text-[13px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors" href="#">
            #{post.categories?.name || 'Contabilidad'}
          </a>
          <a className="text-[13px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors" href="#">
            #Xtracta
          </a>
        </div>
      </div>
    </>
  );
}