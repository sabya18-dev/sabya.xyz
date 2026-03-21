import React from 'react';
import { useInView } from 'react-intersection-observer';

const About = ({ isDark }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

          {/* Animation Container */}
          <div className="flex justify-center items-center h-96">
            <div className="relative w-full max-w-sm h-full flex justify-center items-center">
              <img 
                src="/images/about-animation.gif" 
                alt="Success Animation" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
