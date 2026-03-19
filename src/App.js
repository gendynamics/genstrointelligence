import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Deliah from './components/Deliah';
import { SecureErrorBoundary } from './security/SecureErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Blueteam from './pages/Blueteam';
import Contact from './pages/Contact';
import Purpleteam from './pages/purpleteam';
import Quantum from './pages/Quantum';
import Redteam from './pages/Redteam';

function App() {
  return (
    <SecureErrorBoundary>
      <Router>
        <Navigation />
        <Deliah />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blueteam" element={<Blueteam />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/purpleteam" element={<Purpleteam />} />
          <Route path="/quantum" element={<Quantum />} />
          <Route path="/redteam" element={<Redteam />} />
        </Routes>
      </Router>
    </SecureErrorBoundary>
  );
}

export default App;