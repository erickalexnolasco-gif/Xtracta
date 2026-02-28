//src/components/layout/Footer.tsx
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Grid Principal del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* BLOQUE 1: LOGO Y DESCRIPCIÓN */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              {/* Tu logo PNG */}
              <h2 className='text-5xl font-light w-auto object-contain' style={{ fontFamily: 'MuseoModerno, sans-serif' }}>Xtracta</h2>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm font-medium">
              La plataforma definitiva para contadores modernos en México. 
              Información técnica procesada para decisiones inteligentes.
            </p>
          </div>

          {/* BLOQUE 2: ENLACES DE RECURSOS */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-xs">
              Recursos
            </h4>
            <ul className="space-y-3 text-gray-500 font-semibold text-sm">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">Guías Fiscales 2026</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">Calculadoras ISR/IVA</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">Newsletter Semanal</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">Eventos y Webinars</a>
              </li>
            </ul>
          </div>

          {/* BLOQUE 3: REDES SOCIALES */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-xs">
              Comunidad
            </h4>
            <div className="flex flex-wrap gap-3">
              {/* Mapeamos los iconos para mantener el código limpio */}
              {[
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Mail, label: 'Email' }
              ].map((item, i) => (
                <a 
                  key={i} 
                  href="#" 
                  aria-label={item.label}
                  className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-200 transition-all duration-300"
                >
                  <item.Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* LÍNEA FINAL: COPYRIGHT Y LEGAL */}
        <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm font-bold tracking-tight">
            © 2026 Xtracta. Hecho con pasión por la tecnología contable.
          </p>
          <div className="flex gap-8 text-sm font-black text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}