import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiArrowNarrowRight } from 'react-icons/hi';

const ROLES = ['Full Stack Developer', 'Java Developer', 'AI Enthusiast'];

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    if (textIndex < ROLES[currentRole].length) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText + ROLES[currentRole][textIndex]);
        setTextIndex(textIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentRole((currentRole + 1) % ROLES.length);
        setDisplayText('');
        setTextIndex(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [textIndex, currentRole, displayText]);

  const handleScroll = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-darkBg to-dark z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Hey, I am<br />
            <span className="text-gradient">Sabyasachi Samal</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-semibold text-blue mb-6 h-12 flex items-center">
            {displayText}
            <span className="typing-text ml-2">|</span>
          </p>

          <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
            I help startups and individuals to build their brand with modern web solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => handleScroll('projects')}
              className="btn-primary flex items-center justify-center gap-3 group"
            >
              View Projects
              <HiArrowNarrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => handleScroll('contact')}
              className="btn-secondary"
            >
              Contact Me
            </button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com/sabya18-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-blue transition-colors hover:scale-110 transform duration-300"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/sabyasachi-samal-993896303/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-blue transition-colors hover:scale-110 transform duration-300"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://x.com/amsavyasachi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-blue transition-colors hover:scale-110 transform duration-300"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center">
          <div className="relative w-80 h-80">
            {/* Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue via-purple-500 to-cyan-500 rounded-full p-1 animate-spin opacity-50" style={{ animationDuration: '8s' }}>
              <div className="bg-dark rounded-full w-full h-full"></div>
            </div>
            
            {/* Image Container */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <img 
                src="/images/hero-image.jpeg" 
                alt="Sabyasachi Samal" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-blue rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
