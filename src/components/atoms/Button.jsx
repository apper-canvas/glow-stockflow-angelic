import React from 'react';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  let variantClasses;
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary text-white hover:bg-blue-700 focus:ring-primary';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-gray-300';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'text':
      variantClasses = 'text-primary hover:text-blue-700 focus:ring-primary-light';
      break;
    case 'icon': // For buttons that only contain an icon
      variantClasses = 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300';
      break;
    case 'ghost':
      variantClasses = 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-300';
      break;
    default:
      variantClasses = 'bg-primary text-white hover:bg-blue-700 focus:ring-primary';
  }

  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;