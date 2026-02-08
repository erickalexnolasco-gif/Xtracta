import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';

// Páginas (Pages)
import Landing from './pages/Landing';
import Category from './pages/Category';
import Post from './pages/Post'; // Cambia el nombre de PostDetail.tsx a Post.tsx en src/pages/

// Herramientas
import XMLConverter from './components/tools/XMLConverter';

function TitleHandler() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') document.title = "Xtracta - Home";
    if (location.pathname.includes('/category')) document.title = "Xtracta - Blog";
    if (location.pathname.includes('/post')) document.title = "Xtracta - Artículo";
    if (location.pathname.includes('/herramientas')) document.title = "Xtracta - Convertidor XML";
  }, [location]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TitleHandler />
      
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar /> 
        
        <main className="container mx-auto px-4 pt-24 pb-20 max-w-7xl grow">
          <Routes>
            {/* 1. LANDING PAGE REAL */}
            <Route path="/" element={<Category />} />

            {/* 1. LANDING PAGE REAL */}
            <Route path="/home" element={<Landing />} />

            {/* 2. PAGINA DE BLOG / CATEGORIAS */}
            <Route path="/category" element={<Category />} />

            {/* 3. DETALLE DEL POST */}
            <Route path="/post/:id" element={<Post />} />

            {/* 4. HERRAMIENTAS */}
            <Route path="/herramientas/convertidor-xml" element={<XMLConverter />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;