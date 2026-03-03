//src/components/category/SocialPostCard.tsx
import { Link } from 'react-router-dom';
import { 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye 
} from 'lucide-react';

interface SocialPostCardProps {
  post: {
    id: string;
    title: string;
    summary: string;
    image_url: string;
    published_at: string;
    views?: number;
    likes?: number;
    shares?: number;
    authors: {
      name: string;
      username: string;
    };
    categories: {
      name: string;
    };
  };
}

export default function SocialPostCard({ post }: SocialPostCardProps) {
  
  // ==================== LÓGICA DE TIEMPO RELATIVO ====================
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInMs = now.getTime() - published.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return "Hace un momento";
    if (diffInHours < 24) return `Hace ${diffInHours} h`;
    if (diffInDays < 7) return `Hace ${diffInDays} d`;
    
    return published.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Formatear números grandes (1.2K, 3.5M, etc.)
  const formatNumber = (num: number = 0) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // ==================== COMPONENTE VERIFICADO (INSTAGRAM STYLE) ====================
  const InstagramVerified = () => (
    <svg 
      viewBox="0 0 40 40" 
      className="size-3.5 fill-blue-500 shrink-0" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" 
        fillRule="evenodd"
      />
    </svg>
  );

  return (
    <article className="social-card bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 group">
      
      {/* HEADER: AUTOR */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full border border-slate-100 overflow-hidden shrink-0 bg-slate-50">
            <img 
              src={`https://i.pravatar.cc/150?u=${post.authors.name}`} 
              alt={post.authors.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900 leading-none">{post.authors.name}</h4>
              <InstagramVerified />
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1 tracking-tight">
              @{post.authors.username?.toLowerCase().replace(/\s+/g, '')} • {getRelativeTime(post.published_at)}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* TÍTULO Y CONTENIDO */}
      <Link to={`/post/${post.id}`} className="group/content block">
        <h3 className="text-slate-900 text-lg lg:text-xl font-bold leading-[1.1] mb-2 group-hover/content:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-600 text-base line-clamp-3 mb-3 font-normal leading-[1.3]">
          {post.summary}
        </p>
        
        {post.image_url && (
          <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-slate-50 shadow-inner">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover/content:scale-105 transition-transform duration-700" 
            />
          </div>
        )}
      </Link>

      {/* HASHTAG CATEGORÍA */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-blue-600 text-sm font-bold tracking-wider hover:underline cursor-pointer">
          #{post.categories.name.replace(/\s+/g, '')}
        </span>
      </div>

      {/* FOOTER: ACCIONES CON MÉTRICAS REALES */}
      <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group/btn">
            <Heart size={18} className="group-hover/btn:fill-red-500/10" /> 
            <span className="text-xs font-bold text-slate-500">{formatNumber(post.likes || 0)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group/btn">
            <MessageCircle size={18} className="group-hover/btn:fill-blue-500/10" /> 
            <span className="text-xs font-bold text-slate-500">12</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
            <Share2 size={18} /> 
            <span className="text-xs font-bold text-slate-500">{formatNumber(post.shares || 0)}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-slate-500">
          <Eye size={18} />
          <span className="text-xs font-bold tracking-widest">{formatNumber(post.views || 0)} Vistas</span>
        </div>
      </div>
    </article>
  );
}