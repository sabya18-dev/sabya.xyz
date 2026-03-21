import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiArrowNarrowRight } from 'react-icons/hi';
import emailjs from '@emailjs/browser';

// Initialize Email.js with Public Key from environment variables
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

const Contact = ({ isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        message: formData.message,
      };

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }

    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-4xl" />,
      label: 'Email',
      value: 'sabyasachisamal28@gmail.com',
      link: 'mailto:sabyasachisamal28@gmail.com',
    },
    {
      icon: <FaPhone className="text-4xl" />,
      label: 'Phone',
      value: '+91 8249983482',
      link: 'tel:+918249983482',
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="text-3xl" />,
      label: 'GitHub',
      link: 'https://github.com/sabya18-dev',
    },
    {
      icon: <FaLinkedin className="text-3xl" />,
      label: 'LinkedIn',
      link: 'https://www.linkedin.com/in/sabyasachi-samal-993896303/',
    },
    {
      icon: <FaTwitter className="text-3xl" />,
      label: 'Twitter',
      link: 'https://x.com/amsavyasachi',
    },
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Get In <span className="text-gradient">Touch</span>
        </h2>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          I'm always open to new opportunities and collaborations. Feel free to reach out!
        </p>

        {/* Contact Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold mb-8">Let's work together</h3>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="glass-dark p-6 rounded-2xl group hover:glow transition-all duration-300 block"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-blue group-hover:scale-110 transition-transform duration-300">
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{method.label}</p>
                      <p className="text-lg font-semibold group-hover:text-blue transition-colors">
                        {method.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-gray-400 mb-4">Follow me on</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-dark p-4 rounded-full hover:glow transition-all duration-300 hover:scale-110 text-blue hover:text-cyan-400"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="glass-dark p-8 rounded-2xl relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue/10 to-purple-500/10 pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              {/* Name Input */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-dark/50 border border-blue/30 focus:border-blue focus:outline-none transition-all duration-300 placeholder-gray-500 hover:border-blue/50"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-dark/50 border border-blue/30 focus:border-blue focus:outline-none transition-all duration-300 placeholder-gray-500 hover:border-blue/50"
                  required
                />
              </div>

              {/* Message Input */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here..."
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-dark/50 border border-blue/30 focus:border-blue focus:outline-none transition-all duration-300 placeholder-gray-500 hover:border-blue/50 resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <HiArrowNarrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-center animate-slideUp">
                  ✓ Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-center animate-slideUp">
                  ✗ Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
