// src/components/auth/UserDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Heart, 
  Bookmark, 
  LayoutDashboard, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  PenSquare
} from 'lucide-react';

export default function UserDropdown() {
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Mi Dashboard', href: '#', color: 'text-blue-600' },
    { icon: Bookmark, label: 'Posts Guardados', href: '#', color: 'text-purple-600' },
    { icon: Heart, label: 'Posts con Like', href: '#', color: 'text-red-600' },
    { icon: Settings, label: 'Configuración', href: '#', color: 'text-gray-600' },
    { icon: HelpCircle, label: 'Ayuda', href: '#', color: 'text-green-600' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 rounded-full transition-all p-1 pr-3"
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={userName}
            className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-gray-200">
            <User size={16} className="text-white" />
          </div>
        )}
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={userName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-md">
                    <User size={20} className="text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* BOTÓN PUBLICAR POST - SOLO ADMINS */}
            {isAdmin && (
              <div className="p-2 border-b border-gray-100">
                <button
                  onClick={() => {
                    navigate('/admin/posts');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <PenSquare size={18} />
                  <span className="text-sm font-bold">Publicar Post</span>
                </button>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors group"
              >
                <LogOut size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-red-600 group-hover:text-red-700">
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