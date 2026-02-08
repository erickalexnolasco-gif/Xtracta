import { Link } from 'react-router-dom';
import { MoreHorizontal, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

export default function SocialFeaturedCard({ post }: { post: any }) {
  return (
    <article className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col p-6 transition-all hover:shadow-md">
      {/* Header: Autor */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full border border-slate-100 dark:border-slate-700 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${post.authors.name}`} alt={post.authors.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.authors.name}</h4>
            <p className="text-xs text-slate-400 font-medium">@{post.authors.username?.toLowerCase().replace(" ", "")} • {new Date(post.published_at).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Body: Contenido e Imagen */}
      <Link to={`/post/${post.id}`} className="flex flex-col lg:flex-row gap-8 mb-6 group">
        <div className="flex-1 space-y-4">
          <h2 className="text-slate-900 dark:text-white text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed line-clamp-3">
            {post.summary}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-blue-600 text-sm font-bold hover:underline cursor-pointer">#{post.categories.name}</span>
          </div>
        </div>
        {post.image_url && (
          <div className="lg:w-85 shrink-0 aspect-video lg:aspect-square rounded-xl overflow-hidden border border-slate-50 dark:border-slate-800 shadow-inner">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        )}
      </Link>

      {/* Footer: Interacciones */}
      <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
            <Heart size={18} /> <span className="text-xs font-bold">124</span>
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <MessageCircle size={18} /> <span className="text-xs font-bold">18</span>
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <Share2 size={18} /> <span className="text-xs font-bold">42</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Eye size={16} />
          <span className="text-[11px] font-bold  tracking-wide">1.2k vistas</span>
        </div>
      </div>
    </article>
  );
}