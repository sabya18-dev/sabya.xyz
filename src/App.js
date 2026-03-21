import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Loader from './components/Loader';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${isDark ? 'bg-dark text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Loader />
      <Navbar isDark={isDark} setIsDark={setIsDark} scrolled={scrolled} />
      <Hero />
      <About isDark={isDark} />
      <Skills isDark={isDark} />
      <Projects isDark={isDark} />
      <Contact isDark={isDark} />
      <Chatbot />
      <footer className="border-t border-blue/20 py-8 text-center text-gray-400">
        <p>&copy; 2024 Sabyasachi Samal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
