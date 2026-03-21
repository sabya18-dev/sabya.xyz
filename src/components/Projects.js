import React, { useState } from 'react';

const Projects = ({ isDark }) => {
  const [hoveredProject, setHoveredProject] = useState(null);

  const projectsData = [
    {
      id: 1,
      title: 'AI Powered Resume Builder',
      description: 'Smart resume generator using AI to create professional, tailored resumes with real-time suggestions and AI optimization.',
      tech: ['React', 'Node.js', 'AI APIs', 'MongoDB'],
      image: '/images/ai poerd resume buider.jpeg',
      codeLink: '#',
      demoLink: '#',
    },
    {
      id: 2,
      title: 'Odisha Tourism Website',
      description: 'A comprehensive tourism platform showcasing Odisha culture, historical places, and integrated booking features for travelers.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      image: '/images/odishatourism.jpeg',
      codeLink: '#',
      demoLink: '#',
    },
    {
      id: 3,
      title: 'Emergency Request System',
      description: 'Real-time emergency request and response system that connects users with emergency services for quick assistance.',
      tech: ['MERN Stack', 'Real-time Updates', 'Maps API', 'Socket.io'],
      image: '/images/emergency.jpeg',
      codeLink: '#',
      demoLink: '#',
    },
  ];

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Here are some of my best projects that showcase my skills and experience
        </p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group relative h-96 cursor-pointer transition-all duration-300"
            >
              {/* 3D Card */}
              <div
                className="relative w-full h-full card-3d rounded-2xl overflow-hidden flex flex-col"
                style={{
                  transform: hoveredProject === index 
                    ? 'rotateY(5deg) rotateX(5deg) translateZ(30px)' 
                    : 'rotateY(0deg) rotateX(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {/* Project Image - Top Section */}
                <div
                  className="w-full h-48 bg-cover bg-center transition-transform duration-300 flex-shrink-0"
                  style={{
                    backgroundImage: `url('${project.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: hoveredProject === index ? 'scale(1.05)' : 'scale(1)',
                  }}
                ></div>

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
                  style={{
                    opacity: hoveredProject === index ? 0.6 : 0.4,
                  }}
                ></div>

                {/* Content */}
                <div className="relative flex-1 p-5 flex flex-col justify-center z-10 bg-gradient-to-b from-black/50 to-black/80">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p
                    className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-2 transition-all duration-300"
                    style={{
                      opacity: hoveredProject === index ? 1 : 0.8,
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-blue/20 border border-blue/50 text-blue-300 hover:bg-blue/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Border Glow Effect */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300"
                  style={{
                    borderColor: hoveredProject === index ? 'rgba(0, 102, 255, 0.5)' : 'rgba(0, 102, 255, 0)',
                    boxShadow: hoveredProject === index 
                      ? '0 0 30px rgba(0, 102, 255, 0.4)' 
                      : 'none',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="flex justify-center mt-16">
          <button
            className="btn-primary text-lg px-8 py-3 flex items-center gap-2 group"
          >
            View All Projects
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
