// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.svg';
import UserDropdown from '../auth/UserDropdown';

interface NavbarProps {
  progress?: number;
}

export default function Navbar({ progress = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de página
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  if (location.pathname !== prevLocation) {
    setPrevLocation(location.pathname);
    setIsOpen(false);
  }

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
    { name: 'Herramientas', path: '/herramientas/convertidor-xml', status: 'soon' }, // status ´soon´ porque no esta terminado
    { name: 'Catálogos', path: '#', status: 'soon' },
    { name: 'Nosotros', path: '#', status: 'soon' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? ' backdrop-blur-md ' : ' backdrop-blur-md '
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-4">
          <div className="flex items-center justify-between h-12">
            
            {/* LOGO DINÁMICO (425px) */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img 
                src={logo} 
                alt="Xtracta" 
                className="h-6 md:h-7 w-auto transition-all duration-500" 
              />
              <span 
                className="text-[28px] font-light tracking-tight text-[#1d1d1f] hidden lg:block"
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
                        ? 'bg-blue-50 text-blue-600'
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
              {/* BOTÓN SUSCRÍBETE - SOLO SI NO ESTÁ LOGUEADO */}
  {user ? (
                <UserDropdown />
              ) : (
    <button 
      onClick={signInWithGoogle} 
      className="hidden sm:flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold  hover:shadow-lg hover:shadow-gray-200 transition-all active:scale-95 group">
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span>Regístrate</span>
    </button>
  )}

              

              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 -mr-2 text-[#1d1d1f] hover:bg-black/5 rounded-full transition-all duration-300"
              >
                {isOpen ? <X size={20} className="rotate-90 transition-transform duration-300" /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent">
          <div 
            className="h-full bg-[#0071e3] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      {/* MENÚ MÓVIL CON ANIMACIONES */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop con animación */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel del menú con animación */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden fixed top-12 left-0 right-0 bg-white/95  backdrop-blur-xl z-40 border-b border-black/5"
            >
              <div className="max-w-6xl mx-auto px-4 py-4">
                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
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
                    </motion.div>
                  ))}
                </nav>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 pt-4 border-t border-black/5 space-y-3"
                >
                  {/* BOTÓN DE LOGIN EN MÓVIL */}
                  {user ? (
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-full">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {user.email?.split('@')[0]}
                        </span>
                      </div>
                      <button
                        onClick={signOut}
                        className="p-2 hover:bg-gray-200 rounded-full transition-all"
                      >
                        <LogOut size={16} className="text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={signInWithGoogle}
                      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-full py-3 px-4 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Regístrate con Google</span>
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}