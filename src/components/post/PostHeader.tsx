// src/components/post/PostHeader.tsx
import { Link } from 'react-router-dom';
import { 
  Clock, Bookmark, Share2, Twitter, ChevronLeft ,Linkedin, 
  Facebook, MessageCircle, Link2, Zap ,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import copy from 'copy-to-clipboard';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface PostHeaderProps {
  post: any;
}

const InstagramVerified = () => (
    <svg 
      viewBox="0 0 40 40" 
      className="size-3.25 md:size-3.75 fill-blue-500 shrink-0" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" 
        fillRule="evenodd"
      />
    </svg>
  );

export default function PostHeader({ post }: PostHeaderProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Función para incrementar shares en Supabase
  const incrementShares = async () => {
    try {
      await supabase.rpc('increment_metrics', {
        target_post_id: post.id,
        metric_name: 'shares'
      });
    } catch (error) {
      console.error('Error incrementing shares:', error);
    }
  };

  const handleShareButtonClick = () => {
    const wasOpen = showShareMenu;
    setShowShareMenu(!showShareMenu);
    
    // Incrementar shares SOLO al ABRIR el menú (no al cerrar)
    if (!wasOpen) {
      incrementShares();
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    if (platform === 'copy') {
      copy(url);
      toast.success('¡Link copiado!');
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-400 hover:text-blue-600 mb-4 md:mb-6 tracking-tight ">
        <Link to="/" className="flex items-center gap-1 group">
        <ChevronLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
        <span>Volver al Blog</span>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-blue-50/80 backdrop-blur-xl border border-blue-100 rounded-full mb-3 sm:mb-4">
          <Zap className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
          <span className="text-[10px] md:text-xs font-semibold text-blue-600 uppercase tracking-[0.12em]">{post.categories.name}</span>
      </motion.div>

      <header className="mb-8 md:mb-16">
        {/* Título */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-[32px] md:text-[48px] lg:text-[64px] font-bold tracking-tight leading-[1.1] mb-6 md:mb-10 max-w-6xl text-[#1d1d1f]">
          {post.title}
        </motion.h1>

        {/* Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-8 border-y border-gray-100 gap-8">
          
          {/* Autor */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-3 md:gap-5">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-50 shadow-md">
              <img 
                src={`https://i.pravatar.cc/150?u=${post.authors.name}`}
                alt={post.authors.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] lg:text-[15px] font-bold text-[#1d1d1f]">
                  {post.authors.name} </span>
                <InstagramVerified />
              </div>
              <p className="text-[11px] lg:text-[13px] text-[#86868b] font-medium">
                @{post.authors.username?.toLowerCase().replace(" ", "")} • {new Date(post.published_at).toLocaleDateString('es-MX', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </motion.div>

          {/* Acciones */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-3">
            {/* Badge de lectura */}
            <div className="flex items-center px-4 py-2 bg-[#f5f5f7] rounded-full text-[13px] font-medium text-[#1d1d1f]">
              <Clock className="w-4.5 h-4.5 mr-2" />
              {post.read_time}
            </div>
            
            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />
            
            {/* Botones */}
            <div className="flex gap-2">
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-all active:scale-95" 
                title="Guardar"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={handleShareButtonClick}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-all active:scale-95" 
                  title="Compartir"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {showShareMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowShareMenu(false)}
                    />
                    <div className="absolute top-full mt-3 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 space-y-1 z-20 min-w-50">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                        <span className="font-semibold text-sm">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                        <span className="font-semibold text-sm">LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                        <span className="font-semibold text-sm">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        <span className="font-semibold text-sm">WhatsApp</span>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <Link2 className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-sm">Copiar link</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </header>
    </>
  );
}