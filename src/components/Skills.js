import React, { useState } from 'react';
import { FaHtml5, FaCss3, FaJs, FaReact, FaNode, FaBootstrap, FaJava } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiTailwindcss } from 'react-icons/si';
import { HiCode } from 'react-icons/hi';

const Skills = ({ isDark }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skillsData = [
    { name: 'HTML', icon: <FaHtml5 className="text-4xl" />, color: '#FF5722' },
    { name: 'CSS', icon: <FaCss3 className="text-4xl" />, color: '#2196F3' },
    { name: 'JavaScript', icon: <FaJs className="text-4xl" />, color: '#FFC107' },
    { name: 'React', icon: <FaReact className="text-4xl" />, color: '#61DAFB' },
    { name: 'Node.js', icon: <FaNode className="text-4xl" />, color: '#68A063' },
    { name: 'Express.js', icon: <SiExpress className="text-4xl" />, color: '#000000' },
    { name: 'MongoDB', icon: <SiMongodb className="text-4xl" />, color: '#13AA52' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-4xl" />, color: '#06B6D4' },
    { name: 'Bootstrap', icon: <FaBootstrap className="text-4xl" />, color: '#7952B3' },
    { name: 'Java', icon: <FaJava className="text-4xl" />, color: '#007396' },
    { name: 'C', icon: <HiCode className="text-4xl" />, color: '#00599C' },
  ];

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Technical <span className="text-gradient">Skills</span>
        </h2>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Here are some of the technologies and tools I'm proficient in
        </p>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredSkill(index)}
              onMouseLeave={() => setHoveredSkill(null)}
              className={`group perspective cursor-pointer transition-all duration-300 ${
                hoveredSkill === index ? 'scale-110' : ''
              }`}
            >
              <div
                className="glass-dark h-32 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden hover:glow transition-all duration-300"
                style={{
                  transform: hoveredSkill === index ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" style={{ 
                  boxShadow: `0 0 30px ${skill.color}40` 
                }}></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-white mb-3 group-hover:scale-110 group-hover:text-blue transition-all duration-300" style={{ color: hoveredSkill === index ? skill.color : 'white' }}>
                    {skill.icon}
                  </div>
                  <p className="font-semibold text-sm">{skill.name}</p>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue/50 transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Skills;
