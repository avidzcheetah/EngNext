import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  const hoverClass = hover ? 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1' : '';
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100/60 transition-all duration-300 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;