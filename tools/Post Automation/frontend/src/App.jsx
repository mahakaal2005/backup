import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Agentation } from 'agentation';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Generator from './views/Generator';
import History from './views/History';
import Templates from './views/Templates';
import Settings from './views/Settings';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/history" element={<History />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
      {/* Agentation: Visual annotation tool for autonomous UI critique (dev only) */}
      {import.meta.env.DEV && <Agentation />}
    </Router>
  );
}

export default App;
