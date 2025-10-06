import React from 'react';

const Scene = ({ 
  title, 
  content, 
  isActive, 
  backgroundImage,
}) => {
  return (
    <div
      className={`scene absolute inset-0 transition-opacity duration-1000 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative h-full flex flex-col items-center justify-center p-8 bg-black bg-opacity-40">
        <div 
          className={`text-content ${
            isActive ? 'animate-in' : ''
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center drop-shadow-lg">
            {title}
          </h2>
          <div className="text-xl md:text-2xl text-white text-center max-w-3xl drop-shadow-md">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene;
