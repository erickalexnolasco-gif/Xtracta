import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, FileText, Share2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Importamos la conexión

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "resumen", title: "Resumen" },
    { id: "importancia", title: "Importancia del Cambio" },
    { id: "automatizacion", title: "Automatización" },
    { id: "conclusiones", title: "Conclusiones" }
  ];

  useEffect(() => {
    async function getPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          title, 
          summary,
          content, 
          image_url, 
          published_at, 
          read_time, 
          authors(name), 
          categories(name), 
          types(name)`)
        .eq('id', id) // Buscamos por el ID de la URL
        .single();

      if (error) {
        console.error('Error:', error.message);
      } else {
        setPost(data);
        document.title = `${data.title} - Xtracta`;
      }
      setLoading(false);
    }

    if (id) getPost();

    // Lógica de scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
      <Link to="/" className="text-blue-600 mt-4 block underline">Volver al blog</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <header className="py-5 border-b border-gray-100 mb-12 space-y-3">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm tracking-tight group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Blog
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-[1.1] tracking-tight max-w-6xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-[14px] font-medium text-gray-400">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-medium tracking-normal">
              {post.categories.name}
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-gray-900">{post.authors.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{post.types.name}</span>
            </div>
            <div className="items-center gap-2 border-l border-gray-200 pl-8 hidden md:flex">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-900">{post.read_time}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-12">
              <nav className="space-y-6">
                <p className="text-xl md:text-2xl font-light text-gray-900">En este artículo</p>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`}
                        className={`block text-base transition-all duration-300 ${
                          activeSection === section.id 
                          ? "text-blue-600 font-medium translate-x-1.5" 
                          : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-12">
            <div id="resumen" className="max-w-3xl">
              <p className="text-xl md:text-2xl text-gray-900 font-stretch-50% leading-relaxed text-justify">
                {post.summary}
              </p>
            </div>

            <div className="max-w-2xl">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 aspect-video">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            <article className="blog-content">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <div className="pt-16 mt-16 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  XT
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{post.author}</p>
                  <p className="text-xs text-gray-400 font-medium tracking-tight">Especialista Xtracta</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors text-sm font-bold uppercase tracking-widest">
                <Share2 size={18} /> Compartir
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}