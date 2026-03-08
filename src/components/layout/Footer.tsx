import { Link } from 'react-router-dom';
import { 
  Linkedin, Twitter, Instagram, Mail, 
  ArrowRight, ChevronRight, Zap 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ==================== SECCIÓN CTA: HYPER-PREMIUM ==================== */}
        <section className="relative mb-16 group">
          <div className="relative bg-[#050505] rounded-[3rem] p-10 md:p-20 overflow-hidden border border-white/5 shadow-2xl">
            
            {/* Luces de fondo dinámicas (Glows) */}
            <div className="absolute -top-24 -right-24 size-100 xl:size-150 bg-blue-600/40 blur-[140px] rounded-full group-hover:bg-blue-600/30 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 size-100 bg-indigo-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="max-w-3xl text-center lg:text-left">
                {/* Badge flotante mejorado */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8">
                  <Zap size={16} className="text-blue-400 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Potencia tu despacho hoy</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.02] mb-8" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
                  El futuro de tu despacho <br />
                  <span className="bg-linear-to-r from-[#01E7FF] to-[#1819FF] bg-clip-text text-transparent">comienza con Xtracta.</span>
                </h2>
                
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                  Automatiza lo técnico, domina lo estratégico. La plataforma que procesa miles de XML en segundos con precisión absoluta.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto shrink-0">
                <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                  Pruébalo gratis <ArrowRight size={20} />
                </button>
                <button className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  Agendar Demo
                </button>
              </div>
            </div>
          </div>
        </section>

{/* ==================== FOOTER COMPACTO (APPLE STYLE) ==================== */}
      <div className="bg-white border-t border-black/5 pt-16 pb-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            
            {/* BLOQUE 1: MARCA Y REDES SOCIALES */}
            <div className="md:col-span-5 space-y-6">
              <Link to="/" className="inline-block hover:opacity-70 transition-opacity">
                <span className="text-5xl font-light text-[#1d1d1f] tracking-tighter" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
                  Xtracta<span className="text-[#0071e3] font-bold">.</span>
                </span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
                La plataforma definitiva para contadores modernos en México. 
                Información técnica procesada para decisiones inteligentes.
              </p>
              
              {/* Redes Sociales abajo de la descripción */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {[
                  { Icon: Linkedin, label: 'LinkedIn' },
                  { Icon: Twitter, label: 'Twitter' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Mail, label: 'Email' }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-500 hover:bg-[#0071e3] hover:text-white transition-all duration-300 border border-black/3 shadow-sm"
                  >
                    <item.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* BLOQUE 2: PRODUCTO */}
            <div className="md:col-span-2 space-y-5">
              <h4 className="font-bold text-[#1d1d1f] text-xs uppercase tracking-[0.2em]">Productos</h4>
              <ul className="space-y-3">
                {['Convertidor XML', 'Validador SAT', 'API Fiscal'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 text-sm font-semibold hover:text-[#0071e3] transition-colors flex items-center group">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* BLOQUE 3: RECURSOS */}
            <div className="md:col-span-2 space-y-5">
              <h4 className="font-bold text-[#1d1d1f] text-xs uppercase tracking-[0.2em]">Recursos</h4>
              <ul className="space-y-3">
                {['Blog', 'Guías PDF', 'Newsletter'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 text-sm font-semibold hover:text-[#0071e3] transition-colors flex items-center group">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* BLOQUE 4: SOPORTE TÉCNICO */}
            <div className="md:col-span-3 space-y-5">
              <h4 className="font-bold text-[#1d1d1f] text-xs uppercase tracking-[0.2em]">Soporte</h4>
              <div className="p-4 bg-gray-100 rounded-2xl border border-black/3 shadow-sm">
                <p className="text-sm text-gray-500 font-semibold mb-3 tracking-tight">¿Necesitas ayuda técnica?</p>
                <a href="mailto:soporte@xtracta.mx" className="text-base font-medium text-[#0071e3] flex items-center gap-2 group">
                  hola@xtracta.mx
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-8 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#86868b] text-[11px] font-medium tracking-tight">
              © {currentYear} Xtracta. Hecho con pasión por la tecnología contable.
            </p>
            <div className="flex gap-8 text-[11px] font-bold text-[#86868b]">
              <a href="#" className="hover:text-[#1d1d1f] transition-colors tracking-tight">Privacidad</a>
              <a href="#" className="hover:text-[#1d1d1f] transition-colors tracking-tight">Términos</a>
              <a href="#" className="hover:text-[#1d1d1f] transition-colors tracking-tight">Cookies</a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}