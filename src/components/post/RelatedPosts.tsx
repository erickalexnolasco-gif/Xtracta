// src/components/post/RelatedPosts.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SocialPostCard from '../category/SocialPostCard';
import { Loader2 } from 'lucide-react';

export default function RelatedPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, summary, image_url, published_at, read_time, authors(name, username), categories(name)')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (data) setPosts(data);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, []);

  if (loading) {
    return (
      <section className="mt-32">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="mt-32">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-[36px] font-bold tracking-tight text-[#1d1d1f]">Los más leídos</h2>
          <p className="text-[#86868b] font-medium mt-2">
            Tendencias y guías que definen el sector contable hoy.
          </p>
        </div>
        <Link 
          to="/" 
          className="text-blue-600 font-bold text-[15px] hover:underline mb-2"
        >
          Ver todo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post) => (
          <SocialPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}