import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-dark z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="text-6xl font-bold text-gradient animate-pulse">SS</div>

        {/* Animated Loader */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-400 text-sm tracking-widest">LOADING</p>
      </div>
    </div>
  );
};

export default Loader;
