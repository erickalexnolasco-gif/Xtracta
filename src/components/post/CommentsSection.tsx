// src/components/post/CommentsSection.tsx
import { MessageCircle, Heart } from 'lucide-react';

// Datos ficticios de comentarios
const FAKE_COMMENTS = [
  {
    id: 1,
    author: 'Mariana Sosa',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAn5JfVznn-UQnIaOUA0E46BW2r4EMQGlBAxJBNaesqjV0G2I9xMpQYeWcvdqXrL0M7ZtFyEuti-3p9t3rImmM31AYgzkghrNUSrFHwEgKUUAYe7X4nF_TH7hvkPH8WjK9JTl8y6ENhHrAIzUHcCj0_Q3L37kv6MSsiFXLzsJDnKIh4_wUPdWZsGLajNomrdPQAtKGCyb7YCpTuSQ0ZDN28kqc0tfaattWEk9siO3uc7W5HvedlosG5sd31ciri8dSzzNYqovIxyA',
    time: 'hace 2 horas',
    content: 'Excelente resumen de las reformas. ¿Tienen algún recurso específico sobre la nueva versión de los CFDI de nómina? La transición ha sido algo confusa para mis clientes pymes.',
    likes: 12,
    replies: [
      {
        id: 11,
        author: 'Marisol Romero',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgPpkpeAdjKzP9yvj4jre5JEqWt9C-2nDkyfMLZ5Qx4J8ELZqSF3ftsKBj1T0uS-CG3w2G4QFsmKSuakrql7KMw61Fd_frpqcBuzOyKDEckzivLSpBZoMAjShjzLisUMKL4O7Wma20RwBuUGRvOak0IVIZANwvLF-s2LumKFNHDazxCjJReF-WFYkAiDiwBALtycDCXksIkuNR5GWgbsVw0sF2owNVSUExYnyXyw0uSPlWkCbBGFsogSH0RdVoVgVMV4ISS2p_ko',
        time: 'hace 1 hora',
        content: 'Mariana, el SAT publicó una guía de llenado actualizada el mes pasado. Te recomiendo revisar el Apéndice 5 específicamente para nómina.',
        likes: 3,
      },
      {
        id: 12,
        author: 'Elena Ruiz',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMcOw8wikatTPApEXGT9q8j5X6utmtPyOKl23JCP0Y3PKPOY_9ktYBExuo9SCvdDjyn3Vqd9097RWr3a79-JxwIU25fmrdsvcb_vVmAZdQRtw351PQJKdgeszYm4SnttItlUWaZxVmVWPD00hWBGmxK4eTx17mhWTfgmNRJ9CqTt8wxL2rwp39SqGdYGPJB0_T8J6DxYzEkaXkQawtEVvSKZc3N2NaS439K_r5ZpOmgWz4IjewmuPunWtnbRU-7P6YKh0-TNcUf4s',
        time: 'hace 45 min',
        content: 'Totalmente de acuerdo con Ricardo. Además, hay un webinar gratuito este jueves en el portal de la AMCP sobre ese tema.',
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    author: 'Carlos Valadez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuSHo3nEJ3sr2m7mq8ZJmChN01FBxG_A39BvA2cw1tJcXZVkxSJDDehLzlbNaQwqgnYqSN-aPyRoNHlTIrJn5oasHHwVDy7E32YOfY4fbkK2xfEwOQL3K2GpYkl-oCS9kw-pAovMaYhcssbbRyYlwsinJaackbgXta-9kKoQfqi_WDOLILLVW5FgTUWtbwQM8Ka382SRmeTKV3ECDooUEFijy1hJSLoMx8VSF69REMKGVOgswNQbwgvwes6YLG5bkulKD0XbXf9vI',
    time: 'hace 5 horas',
    content: '¿Cómo ven la implementación de la IA para las conciliaciones bancarias este año? He notado que el SAT ya está usando algoritmos muy precisos para detectar discrepancias en tiempo real.',
    likes: 8,
  },
  {
    id: 3,
    author: 'Sofía Méndez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoYdbUoGESDzx-w13xQsYndTQaVGAgc2XZQZPa-zFbC0YTSfBxbuoqjB0Rf3M6xCgMNakJEnUs7ufKp2G2buVN0wp5jXK30VnF3gGhh8DLhKjttWGbMXibeHtjtVkbEUGIBh2vd5bS9wGi0lwcX5czvj1129qvM9Cp6tjM56mV8RzxXhBczqjFznUnRiK35lpnXMXfppSKSyfbUdDRc8nciKuXHeW3PlFVwk94N4pjL0BNFlmaP1SDeB54tkd3m3H1tAmzpG8Icys',
    time: 'hace 8 horas',
    content: 'El artículo menciona que no basta con reaccionar a los vencimientos. Es vital educar al cliente para que entregue la documentación a tiempo. Sin eso, ninguna herramienta digital ayuda.',
    likes: 21,
    replies: [
      {
        id: 31,
        author: 'Marisol Romero',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgPpkpeAdjKzP9yvj4jre5JEqWt9C-2nDkyfMLZ5Qx4J8ELZqSF3ftsKBj1T0uS-CG3w2G4QFsmKSuakrql7KMw61Fd_frpqcBuzOyKDEckzivLSpBZoMAjShjzLisUMKL4O7Wma20RwBuUGRvOak0IVIZANwvLF-s2LumKFNHDazxCjJReF-WFYkAiDiwBALtycDCXksIkuNR5GWgbsVw0sF2owNVSUExYnyXyw0uSPlWkCbBGFsogSH0RdVoVgVMV4ISS2p_ko',
        time: 'hace 7 horas',
        content: 'Exactamente, Sofía. El mayor reto del contador hoy es ser un consultor que transforma la cultura administrativa de sus clientes.',
        likes: 15,
        isAuthor: true,
      },
    ],
  },
];

export default function CommentsSection() {
  return (
    <section className="mt-16 bg-[#fafafa] rounded-4xl p-8 md:p-12 border border-gray-100">
      <h3 className="text-2xl font-bold mb-10 text-[#1d1d1f]">Conversación</h3>

      {/* Input para nuevo comentario */}
      <div className="flex gap-6 mb-16">
        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="grow">
          <textarea
            className="w-full rounded-2xl p-5 text-[15px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400/50 transition-all outline-none resize-none placeholder:text-gray-400 bg-white/80 backdrop-blur-sm border border-gray-200/80"
            placeholder="Añade tu perspectiva a la conversación..."
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-[11px] text-gray-400 font-medium tracking-wide">
              Por favor, mantén un tono profesional.
            </p>
            <button className="bg-[#1d1d1f] text-white px-7 py-2.5 rounded-full text-[14px] font-bold hover:bg-black transition-all">
              Publicar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-12">
        {FAKE_COMMENTS.map((comment) => (
          <div key={comment.id} className="relative">
            {/* Línea vertical si tiene respuestas */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200" />
            )}

            {/* Comentario principal */}
            <div className="flex gap-6 relative z-10 bg-[#fafafa]">
              <div className="w-12 h-12 rounded-full border border-gray-200 shrink-0 overflow-hidden shadow-sm">
                <img
                  alt={comment.author}
                  className="w-full h-full object-cover"
                  src={comment.avatar}
                />
              </div>
              <div className="grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[15px] font-bold text-[#1d1d1f]">{comment.author}</span>
                  <span className="text-[12px] font-medium text-[#86868b]">{comment.time}</span>
                </div>
                <p className="text-[15px] text-[#424245] leading-relaxed mb-4">
                  {comment.content}
                </p>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    <MessageCircle className="w-4.5 h-4.5" />
                    Responder
                  </button>
                  <button className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-red-500 transition-colors group">
                    <Heart className="w-4.5 h-4.5 group-hover:fill-current" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Respuestas anidadas */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-16 mt-8 space-y-8">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4 relative z-10 bg-[#fafafa]">
                    <div className="w-10 h-10 rounded-full border border-gray-200 shrink-0 overflow-hidden">
                      <img
                        alt={reply.author}
                        className="w-full h-full object-cover"
                        src={reply.avatar}
                      />
                    </div>
                    <div className="grow">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[14px] font-bold text-[#1d1d1f]">{reply.author}</span>
                        {reply.author && (
                          <span className="bg-blue-600 text-[9px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                            Autor
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-[#86868b]">{reply.time}</span>
                      </div>
                      <p className="text-[14px] text-[#424245] leading-relaxed mb-3">
                        {reply.content}
                      </p>
                      <div className="flex items-center gap-5">
                        <button className="text-[12px] font-semibold text-gray-400 hover:text-blue-600 transition-colors">
                          Responder
                        </button>
                        <button className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-red-500 transition-colors group">
                          <Heart className="w-4 h-4" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Botón cargar más */}
        <div className="pt-10 flex justify-center">
          <button className="text-[14px] font-bold text-blue-600 px-8 py-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
            Cargar 15 comentarios más
          </button>
        </div>
      </div>
    </section>
  );
}