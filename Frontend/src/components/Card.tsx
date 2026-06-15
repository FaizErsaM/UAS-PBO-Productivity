import React from 'react';

export const Card = ({ 
  children, 
  className = "",
  padding = "p-6"
}: { 
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) => {
  return (
    <div className={`bg-white dark:bg-navy-light dark:border-slate-800 rounded-[16px] shadow-soft border border-neutral-light ${padding} ${className}`}>
      {children}
    </div>
  );
};
