import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <img 
      src="/logo.png" 
      alt="African Strikers Logo" 
      className={`object-contain mix-blend-screen ${className}`}
    />
  );
};
