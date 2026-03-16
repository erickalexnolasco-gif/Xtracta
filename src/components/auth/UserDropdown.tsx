// src/components/auth/UserDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export default function UserDropdown() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];
  const userEmail = user.email;

  // Configuración de items usando Material Symbols para consistencia
  const menuItems = [
    { icon: 'dashboard', label: 'Mi Dashboard', href: '#', color: 'text-blue-500' },
    { icon: 'bookmark', label: 'Posts Guardados', href: '#', color: 'text-indigo-500' },
    { icon: 'favorite', label: 'Posts con Like', href: '#', color: 'text-rose-500' },
    { icon: 'settings', label: 'Configuración', href: '#', color: 'text-slate-500' },
    { icon: 'help', label: 'Ayuda y Soporte', href: '#', color: 'text-emerald-500' },
  ];

  // Animaciones estilo "Spring" (Muelle) de macOS
  const dropdownVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.92,
      y: -10,
      filter: 'blur(10px)' 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.15 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER BUTTON: Estilo limpio de barra de estado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-1 py-1 pr-3 rounded-full hover:bg-black/5 transition-colors duration-200 active:scale-95"
      >
        <div className="relative">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={userName}
              className="w-8 h-8 rounded-full border border-black/10 object-cover shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1819FF] to-[#01E7FF] flex items-center justify-center border border-black/10">
              <span className="material-symbols-outlined text-white text-lg">person</span>
            </div>
          )}
          {/* Indicador de estado Apple */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <span className={`material-symbols-outlined text-[#86868b] text-base transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* DROPDOWN: Estilo Glassmorphism macOS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-3 w-72 bg-white/70 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 ring-1 ring-black/5 overflow-hidden z-[100]"
          >
            {/* USER PROFILE INFO */}
            <div className="p-5 flex flex-col items-center text-center border-b border-black/[0.03]">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="w-16 h-16 rounded-full shadow-xl border-2 border-white mb-3" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-slate-400">person</span>
                </div>
              )}
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight leading-tight">{userName}</h3>
              <p className="text-[12px] text-[#86868b] font-medium">{userEmail}</p>
            </div>

            {/* MENU LINKS */}
            <div className="p-1.5">
              {menuItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-[0.8rem] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`material-symbols-outlined ${item.color} group-hover:scale-110 transition-transform duration-300 !text-[22px]`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-semibold text-[#1d1d1f]">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* LOGOUT SECTION */}
            <div className="p-1.5 bg-black/[0.02] border-t border-black/[0.03]">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[0.8rem] hover:bg-red-500/10 transition-colors group"
              >
                <span className="material-symbols-outlined text-red-500 group-hover:scale-110 transition-transform duration-300 !text-[22px]">
                  logout
                </span>
                <span className="text-[13px] font-bold text-red-600">
                  Cerrar sesión
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}