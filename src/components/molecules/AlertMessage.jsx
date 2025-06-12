import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const AlertMessage = ({ message, type = 'info', title, className = '' }) => {
  let bgColorClass;
  let borderColorClass;
  let textColorClass;
  let iconName;
  let iconColorClass;

  switch (type) {
    case 'info':
      bgColorClass = 'bg-blue-50';
      borderColorClass = 'border-blue-200';
      textColorClass = 'text-blue-700';
      iconName = 'Info';
      iconColorClass = 'text-blue-600';
      break;
    case 'warning':
      bgColorClass = 'bg-amber-50';
      borderColorClass = 'border-amber-200';
      textColorClass = 'text-amber-700';
      iconName = 'Info'; // Or 'AlertTriangle'
      iconColorClass = 'text-amber-600';
      break;
    case 'error':
      bgColorClass = 'bg-red-50';
      borderColorClass = 'border-red-200';
      textColorClass = 'text-red-700';
      iconName = 'AlertTriangle';
      iconColorClass = 'text-red-600';
      break;
    case 'success':
      bgColorClass = 'bg-green-50';
      borderColorClass = 'border-green-200';
      textColorClass = 'text-green-700';
      iconName = 'CheckCircle';
      iconColorClass = 'text-green-600';
      break;
    default:
      bgColorClass = 'bg-gray-50';
      borderColorClass = 'border-gray-200';
      textColorClass = 'text-gray-700';
      iconName = 'Info';
      iconColorClass = 'text-gray-600';
  }

  return (
    &lt;div className={`${bgColorClass} ${borderColorClass} rounded-lg p-4 ${className}`}&gt;
      &lt;div className="flex items-start"&gt;
        &lt;ApperIcon name={iconName} size={20} className={`${iconColorClass} mr-3 mt-0.5 flex-shrink-0`} /&gt;
        &lt;div&gt;
          {title && &lt;h3 className={`text-sm font-medium ${textColorClass} mb-1`}&gt;{title}&lt;/h3&gt;}
          &lt;p className={`text-sm ${textColorClass} ${title ? 'mt-1' : ''}`}&gt;
            {message}
          &lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default AlertMessage;