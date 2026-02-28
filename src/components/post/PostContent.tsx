// src/components/post/PostContent.tsx
import DOMPurify from 'dompurify';
import { Heart, Eye, MessageSquare } from 'lucide-react';  // 👈 ESTE IMPORT

interface PostContentProps {
  post: any;
}

export default function PostContent({ post }: PostContentProps) {
    return (
    <>
      {/* Introducción / Lead (texto grande antes de la imagen) */}
      {post.summary && (
        <p className="text-xl md:text-2xl text-[#424245] font-normal leading-normal mb-16 tracking-tight serif-body">
          {post.summary}
        </p>
      )}

      {/* Imagen destacada */}
      {post.image_url && (
        <figure className="mb-16 mx-.5 lg:mx-0">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="rounded-[2.5rem] w-full h-auto object-cover aspect-video"
          />
          <figcaption className="text-[13px] font-medium text-center mt-6 text-[#86868b] font-sans italic">
            {post.title}. © 2026 Xtracta
          </figcaption>
        </figure>
      )}

      {/* Contenido del artículo */}
      <article 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} 
    />

      {/* Footer con stats y tags - CON ICONOS LUCIDE */}
      <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group">
            <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>124 <span className="text-gray-400 font-normal">Likes</span></span>
          </button>
          <button className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group">
            <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span>18 <span className="text-gray-400 font-normal">Comentarios</span></span>
          </button>
          <button className="flex items-center gap-2.5 text-[15px] font-medium text-[#1d1d1f] group">
            <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span>2.4k <span className="text-gray-400 font-normal">Vistas</span></span>
          </button>
        </div>
        <div className="flex gap-4">
            <a className="text-[13px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors" href="#">
            #{post.categories?.name || 'Contabilidad'}
        </a>
        </div>
        </div>
    </>
    );
}