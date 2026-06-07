import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Agentation } from 'agentation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetails from './pages/ProjectDetails';
import ContactPage from './pages/ContactPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-primary min-h-screen text-text selection:bg-accent/30 selection:text-accent flex flex-col font-sans relative">
        {/* Global background — dot grid texture */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
        {/* Global background — soft gradient orbs */}
        <div className="fixed top-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-1/4 left-1/4 w-72 h-72 bg-kotlin/5 rounded-full blur-[100px] pointer-events-none z-0" />
        <Navbar />
        <main className="flex-grow pt-20 relative z-10">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
      {import.meta.env.DEV && <Agentation />}
    </Router>
  );
}

export default App;
