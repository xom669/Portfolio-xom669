import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import Home from './pages/Home';
import Work from './pages/Work';
import Materials from './pages/Materials';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Scroll to top automatically when route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <BackgroundEffects />
      <Navbar />

      <main className="page-main-wrap min-h-[calc(100vh-220px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <Router>
        <MainLayout />
      </Router>
    </PortfolioProvider>
  );
}
