import { Link } from 'react-router-dom';
import { MoreHorizontal, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

export default function SocialPostCard({ post }: { post: any }) {
  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col p-6 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full border border-slate-100 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${post.authors.name}`} alt={post.authors.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.authors.name}</h4>
            <p className="text-xs text-slate-400 font-medium">{new Date(post.published_at).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Título y Contenido */}
      <Link to={`/post/${post.id}`} className="group block">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-snug mb-3 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {post.summary}
        </p>
        {post.image_url && (
          <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-slate-50 dark:border-slate-800">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        )}
      </Link>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-blue-600 text-xs font-bold">#{post.categories.name}</span>
        <span className="text-blue-600 text-xs font-bold">#Xtracta</span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
            <Heart size={16} /> <span className="text-xs font-bold">85</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
            <MessageCircle size={16} /> <span className="text-xs font-bold">12</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
            <Share2 size={16} /> <span className="text-xs font-bold">9</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Eye size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">340 vistas</span>
        </div>
      </div>
    </article>
  );
}