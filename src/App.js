import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Deliah from './components/Deliah';
import Home from './pages/Home';
import Architecture from './pages/Architecture';
import About from './pages/About';
import AI from './pages/AI';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Blueteam from './pages/Blueteam';
import Redteam from './pages/Redteam';
import PurpleTeam from './pages/purpleteam';
import Quantum from './pages/Quantum';
import RnD from './pages/RnD';

function SlideRoutes() {
  const location = useLocation();

  return (
    <>
      <style>{`
        @keyframes service-slide-ltr {
          0% { transform: translateX(-6%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .service-slide {
          animation: service-slide-ltr 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
      `}</style>
      <div className="service-slide" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/quantum" element={<Quantum />} />
          <Route path="/redteam" element={<Redteam />} />
          <Route path="/blueteam" element={<Blueteam />} />
          <Route path="/purpleteam" element={<PurpleTeam />} />
          <Route path="/research" element={<RnD />} />
          <Route path="/rnd" element={<RnD />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <SlideRoutes />
      <Deliah />
    </Router>
  );
}

export default App;
