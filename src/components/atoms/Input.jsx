import React from 'react';

const Input = ({ label, id, className = '', type = 'text', ...props }) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';
  
  // Filter out non-standard HTML props if necessary, though common in React to pass them
  const { label: omittedLabel, id: omittedId, ...rest } = props; // Keep id if it's for native input element

  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        className={`${baseClasses} ${className}`}
        {...rest}
      />
    );
  }

  if (type === 'select') {
    return (
      <select
        id={id}
        className={`${baseClasses} ${className}`}
        {...rest}
      >
        {props.children}
      </select>
    );
  }

  return (
    <input
      id={id}
      type={type}
      className={`${baseClasses} ${className}`}
      {...rest}
    />
  );
};

export default Input;