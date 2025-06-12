import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ icon, title, description, buttonText, onButtonClick }) => {
  return (
    &lt;div className="text-center py-12"&gt;
      &lt;ApperIcon name={icon} size={48} className="text-gray-300 mx-auto mb-4" /&gt;
      &lt;h3 className="text-lg font-medium text-gray-900 mb-2"&gt;
        {title}
      &lt;/h3&gt;
      &lt;p className="text-gray-500 mb-4"&gt;
        {description}
      &lt;/p&gt;
      {buttonText && onButtonClick && (
        &lt;Button onClick={onButtonClick}&gt;
          {buttonText}
        &lt;/Button&gt;
      )}
    &lt;/div&gt;
  );
};

export default EmptyState;