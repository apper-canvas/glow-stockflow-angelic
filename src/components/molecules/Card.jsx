import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = false, delay = 0, ...props }) => {
  const baseClasses = 'bg-white rounded-lg p-6 shadow-sm border border-gray-100';
  const combinedClasses = `${baseClasses} ${className}`;

  if (animate) {
    return (
      &lt;motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay }}
        className={combinedClasses}
        {...props}
      &gt;
        {children}
      &lt;/motion.div&gt;
    );
  }

  return (
    &lt;div className={combinedClasses} {...props}&gt;
      {children}
    &lt;/div&gt;
  );
};

export default Card;