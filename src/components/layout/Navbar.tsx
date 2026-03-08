import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.svg';

interface NavbarProps {
  progress?: number;
}

export default function Navbar({ progress = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Cerrar menú al cambiar de página
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Bloqueo de scroll y blur del fondo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Blog', path: '/', status: 'active' },
    { name: 'Herramientas', path: '/herramientas/convertidor-xml', status: 'active' },
    { name: 'Catálogos', path: '#', status: 'soon' },
    { name: 'Nosotros', path: '#', status: 'soon' },
  ];

  return (
    <>
      {/* 1. OVERLAY (El desenfoque de la página) */}
      <div 
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-4">
          <div className="flex items-center justify-between h-12">
            
            {/* LOGO DINÁMICO (425px) */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img 
                src={logo} 
                alt="Xtracta" 
                className="h-6 w-auto hidden min-[426px]:block transition-all duration-500" 
              />
              <span 
                className="text-2xl font-light tracking-tight text-[#1d1d1f] block min-[426px]:hidden"
                style={{ fontFamily: 'MuseoModerno, sans-serif' }}
              >
                Xtracta
              </span>
            </Link>

            {/* NAVEGACIÓN DESKTOP (> 425px) con ESTILO AZUL */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                link.status === 'active' ? (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => `
                      px-4 py-1.5 text-sm font-semibold transition-all duration-300 rounded-full
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' // Estilo azul que pediste
                        : 'text-gray-600 hover:text-[#1d1d1f] hover:bg-black/5'}
                    `}
                  >
                    {link.name}
                  </NavLink>
                ) : (
                  <div key={link.name} className="px-4 py-1.5 text-sm font-semibold text-[#86868b] opacity-40 cursor-not-allowed flex items-center">
                    {link.name}
                    <span className="ml-1.5 text-[9px] bg-[#f5f5f7] px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Pronto</span>
                  </div>
                )
              ))}
            </div>

            {/* BOTONES DERECHA */}
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 bg-[#0071e3] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#0077ed] hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 group">
                <Bell size={16} className="group-hover:animate-ring" />
                <span>Suscríbete</span>
              </button>

              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 -mr-2 text-[#1d1d1f] hover:bg-black/5 rounded-full transition-all duration-300"
              >
                {isOpen ? <X size={20} className="rotate-90 transition-transform duration-300" /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* MENÚ MÓVIL (Con la animación sutil y compacta) */}
        <div className={`md:hidden absolute top-12 left-0 w-full bg-white border-b border-black/5 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <div key={link.name} className={`transition-all duration-500 delay-[${link.name.length * 10}ms] ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                  {link.status === 'active' ? (
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => `
                        flex items-center justify-between px-4 py-3 rounded-full text-base transition-all duration-300
                        ${isActive ? 'bg-[#f5f5f7] text-[#1d1d1f] font-medium' : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'}
                      `}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </NavLink>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-3 rounded-full text-base text-[#1d1d1f] opacity-50">
                      <span>{link.name}</span>
                      <span className="text-xs bg-[#e8e8ed] text-gray-700 px-2 py-1 rounded-full">Próximamente</span>
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            <div className={`mt-4 pt-4 border-t border-black/5 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <button className="w-full flex items-center justify-center gap-2 bg-[#0071e3] text-white px-4 py-3 rounded-full text-base font-medium hover:bg-[#0077ed] transition-all shadow-xl shadow-blue-200">
                <Bell size={20} />
                <span>Suscríbete al Newsletter</span>
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent">
          <div 
            className="h-full bg-[#0071e3] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>
    </>
  );
}