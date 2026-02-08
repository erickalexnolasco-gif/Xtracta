import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import logo from '../../assets/logo.png';

interface NavbarProps {
  onReset?: () => void;
}

export default function Navbar({ onReset }: NavbarProps) {
  const navLinks = [
    { name: 'Catálogos', path: '#' },
    { name: 'Categorías', path: '/' },
    { name: 'Herramientas', path: '/herramientas/convertidor-xml' },
    { name: 'Nosotros', path: '#' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-3 h-18 flex items-center justify-between max-w-7xl relative">
        
        <Link to="/" onClick={onReset} className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Xtracta" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              /* Cambiado a font-medium para que se vea delgado pero claro */
              className="text-sm font-medium text-gray-700 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="shrink-0">
          <button
            className="group flex items-center gap-2 bg-blue-600 border border-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all duration-300"
            style={{ transform: 'translateY(0)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Bell className="w-4 h-4 text-white group-hover:text-blue-600 animate-ring" />
            Suscríbete
          </button>
        </div>
      </div>
    </nav>
  );
}