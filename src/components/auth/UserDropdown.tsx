// src/components/auth/UserDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Ajuste técnico para el portal
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import AdminDashboard from '../../pages/AdminDashboard';

export default function UserDropdown() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    async function getProfileAndSync() {
      if (!user) return;
      
      // 1. Obtenemos el perfil y verificamos ADMIN desde la DB (Seguro)
      const { data, error } = await supabase
        .from('users')
        .select('is_admin, avatar_url')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setIsAdmin(data.is_admin);
        
        // 2. SCRIPT OCULTO: Si la foto de Google es distinta a la de la DB, actualizamos
        const googlePhoto = user.user_metadata?.avatar_url || user.user_metadata?.picture;
        if (googlePhoto && googlePhoto !== data.avatar_url) {
          await supabase.from('users').update({ avatar_url: googlePhoto }).eq('id', user.id);
        }
      }
    }
    getProfileAndSync();
  }, [user]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

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

  const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { 
      opacity: 1, scale: 1, y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 } 
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }
  };

  const avatarContent = (
    <div className="relative h-10 w-10 shrink-0 p-0.5 rounded-full bg-linear-to-tr via-blue-500 to-[#1819FF] from-[#01E7FF] shadow-sm">
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={userName} 
          className="h-full w-full rounded-full object-cover bg-white" 
        />
      ) : (
        <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-400">person</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex justify-end" ref={dropdownRef}>
      
      {/* TRIGGER EXTERNO */}
      <button
        onClick={toggleMenu}
        className={`relative z-10 active:scale-90 transition-all duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        {avatarContent}
      </button>

      {/* DROPDOWN MENU ENVOLVENTE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-0 w-70 bg-white/90 backdrop-blur-[20px] rounded-3xl shadow-macos border border-slate-100 overflow-hidden z-100 origin-top-right shadow-sm"
          >
            {/* Header Section */}
            <div className="p-2">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl bg-gray-50/50">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-sm font-bold text-gray-900 tracking-tight truncate">{userName}</span>
                  <span className="text-[12px] text-gray-400 font-medium truncate">{userEmail}</span>
                </div>
                <button onClick={toggleMenu} className="active:scale-90 transition-transform">
                  {avatarContent}
                </button>
              </div>
            </div>

            {/* Menu Body */}
            <div className="px-2 pb-3 space-y-0.5">
              
              {isAdmin && (
                <>
                  <button 
                    onClick={() => { setShowAdmin(true); setIsOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3 text-blue-600 group-hover:text-white">
                      <span className="material-symbols-rounded">add_circle</span>
                      <span className="text-[14px] font-semibold">Publicar post</span>
                    </div>
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                </>
              )}

              {/* Profile */}
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100/80 transition-colors group text-left">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-[14px] font-medium">Profile</span>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-[16px]">check</span>
              </button>

              {/* Community */}
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100/80 transition-colors group text-left">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                  <span className="material-symbols-outlined">group</span>
                  <span className="text-[14px] font-medium">Community</span>
                </div>
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-[14px] font-medium text-gray-600">+</span>
                </div>
              </button>

              {/* Subscription */}
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100/80 transition-colors group text-left">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="text-[14px] font-medium">Subscription</span>
                </div>
                <div className="bg-green-300/80 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-green-400">
                  <span className="material-symbols-rounded text-green-800 text-[12px]! font-bold!">bolt</span>
                  <span className="text-xs font-bold text-green-800 tracking-wider">PRO</span>
                </div>
              </button>

              {/* Settings */}
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100/80 transition-colors group text-left">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-[14px] font-medium">Settings</span>
                </div>
              </button>

              <div className="h-px bg-gray-100 my-1 mx-2"></div>

              {/* Help Center */}
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100/80 transition-colors group text-left">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                  <span className="material-symbols-outlined">info</span>
                  <span className="text-[14px] font-medium">Help center</span>
                </div>
              </button>

              {/* Sign Out */}
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group text-left"
              >
                <div className="flex items-center gap-3 text-red-500">
                  <span className="material-symbols-outlined">logout</span>
                  <span className="text-[14px] font-medium">Sign out</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* El Portal siempre debe estar activo y apuntar al body. 
        El AnimatePresence va ADENTRO del portal para que Framer Motion lo detecte bien.
      */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showAdmin && (
            <AdminDashboard key="admin-dashboard" onClose={() => setShowAdmin(false)} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}