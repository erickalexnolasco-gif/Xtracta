//src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layout
import GoogleOneTap from './components/auth/GoogleOneTap';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';

// Páginas (Pages)
import Landing from './pages/Landing';
import Category from './pages/Category';
import Post from './pages/Post';

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
  const location = useLocation();
  const isPostPage = location.pathname.includes('/post/');

  return (
    <>
      <ScrollToTop />
      <TitleHandler />
      <GoogleOneTap />
      
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar /> 
        
        {isPostPage ? (
          // Post SIN container ni padding
          <Routes>
            <Route path="/post/:id" element={<Post />} />
          </Routes>
        ) : (
          // Resto de páginas CON container y padding
          <main className="container mx-auto px-3 pt-24 pb-20 max-w-7xl grow">
            <Routes>
              <Route path="/" element={<Category />} />
              <Route path="/home" element={<Landing />} />
              <Route path="/category" element={<Category />} />
              <Route path="/herramientas/convertidor-xml" element={<XMLConverter />} />
            </Routes>
          </main>
        )}

        <Footer />
      </div>
    </>
  );
}

// Wrapper para poder usar useLocation dentro del componente
function AppWrapper() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;