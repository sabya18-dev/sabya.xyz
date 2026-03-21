import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const About = ({ isDark }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 10, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          About <span className="text-gradient">Me</span>
        </h2>

        <div 
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Content */}
          <div>
            <h3 className="text-3xl font-bold mb-6">Who am I?</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              I am a passionate Full Stack Developer and Java Developer with a strong interest in building scalable web applications. I also explore Artificial Intelligence and love integrating AI into real-world projects to create smart solutions.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              With expertise in modern web technologies and a keen eye for design, I create beautiful and functional digital experiences that help businesses grow and succeed in the digital landscape.
            </p>
          </div>

          {/* 3D Card with Profile Image */}
          <div
            className="perspective h-96 cursor-pointer relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue via-purple-500 to-cyan-500 rounded-2xl p-1 animate-spin opacity-50" style={{ animationDuration: '8s' }}>
              <div className="bg-dark rounded-2xl w-full h-full"></div>
            </div>

            {/* Image Card Container */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden transition-transform duration-300"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <img 
                src="/images/profile-card.jpeg" 
                alt="Sabyasachi Samal" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
