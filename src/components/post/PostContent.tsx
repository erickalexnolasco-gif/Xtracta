// src/components/post/PostContent.tsx
import DOMPurify from 'dompurify';
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import { usePostMetrics } from '../../hooks/usePostMetrics';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';
import LoginPrompt from '../auth/LoginPrompt';

interface PostContentProps {
  post: any;
}

export default function PostContent({ post }: PostContentProps) {
  const { user } = useAuth();
  const { metrics, isLiked, toggleLike, handleShare } = usePostMetrics(post.id);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const onLike = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    toggleLike();
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
        message="Inicia sesión para dar like"
      />

      {/* Lead/Intro grande ANTES de la imagen */}
      {post.summary && (
        <p className="text-xl md:text-2xl text-gray-600 font-normal leading-[1.4] mb-16 tracking-tight serif-body">
          {post.summary}
        </p>
      )}

      {/* Imagen destacada con caption */}
      {post.image_url && (
        <figure className="mb-16 -mx-6 lg:mx-0">
          <img 
            alt={post.title}
            className="rounded-[2.5rem] w-full h-auto object-cover aspect-video shadow-2xl" 
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
            disabled={isLiked && !!user}
            className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isLiked 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-400 group-hover:text-red-500'
              }`}
            />
            <span>{metrics.likes} <span className="text-gray-400 font-normal">Likes</span></span>
          </button>
          
          <button className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group">
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