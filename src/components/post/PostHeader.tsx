// src/components/post/PostHeader.tsx
import { Link } from 'react-router-dom';
import { 
  Clock, Bookmark, Share2, Twitter, Linkedin, 
  Facebook, MessageCircle, Link2, CheckCircle2 
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import copy from 'copy-to-clipboard';

interface PostHeaderProps {
  post: any;
  viewsCount: number;
}

export default function PostHeader({ post, viewsCount }: PostHeaderProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

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
      <div className="flex items-center gap-2 text-[13px] font-medium text-blue-600 mb-6 tracking-tight">
        <Link to="/" className="hover:underline">Blog</Link>
        <span className="text-gray-300">/</span>
        <span>{post.categories.name}</span>
      </div>

      <header className="mb-16">
        {/* Título */}
        <h1 className="text-[32px] md:text-[48px] lg:text-[64px] font-bold tracking-tight leading-[1.1] mb-12 max-w-6xl text-[#1d1d1f]">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-8 border-y border-gray-100 gap-8">
          
          {/* Autor - EXACTAMENTE COMO SocialFeaturedCard */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-50 shadow-md">
              <img 
                src={`https://i.pravatar.cc/150?u=${post.authors.name}`}
                alt={post.authors.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] lg:text-[15px] font-bold text-[#1d1d1f]">
                  {post.authors.name}
                </span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
              </div>
              <p className="text-[11px] lg:text-[13px] text-[#86868b] font-medium">
                @{post.authors.username?.toLowerCase().replace(" ", "")} • {new Date(post.published_at).toLocaleDateString('es-MX', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
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
                  onClick={() => setShowShareMenu(!showShareMenu)}
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
          </div>
        </div>
      </header>
    </>
  );
}