import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Importaciones de Layout y Home
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import BlogHeader from './components/home/BlogHeader';
import CategoryBar from './components/home/CategoryBar';
import BlogGrid from './components/home/BlogGrid';
import PostDetail from './components/home/PostDetail';

// 1. IMPORTA TU NUEVA HERRAMIENTA
import XMLConverter from './components/tools/XMLConverter';

function TitleHandler() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') document.title = "Xtracta - Blog";
    if (location.pathname.includes('/herramientas')) document.title = "Xtracta - Convertidor XML";
  }, [location]);
  return null;
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const resetFilters = () => {
    setSelectedCategory("Todas");
    setSearchQuery("");
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <TitleHandler />
      
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar onReset={resetFilters} />
        
        <main className="container mx-auto px-4 pt-24 pb-20 max-w-6xl grow">
          <Routes>
            {/* RUTA DE INICIO */}
            <Route path="/" element={
              <>
                <BlogHeader onSearch={setSearchQuery} />
                <CategoryBar 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={setSelectedCategory} 
                />
                <BlogGrid 
                  selectedCategory={selectedCategory} 
                  searchQuery={searchQuery} 
                />
              </>
            } />

            {/* RUTA DE LECTURA */}
            <Route path="/post/:id" element={<PostDetail />} />

            {/* 2. NUEVA RUTA PARA EL CONVERTIDOR */}
            <Route path="/herramientas/convertidor-xml" element={<XMLConverter />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;