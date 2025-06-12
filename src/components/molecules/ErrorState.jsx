import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ title, message, onRetry, retryButtonText = 'Try Again', className = 'p-6 flex items-center justify-center min-h-96' }) => {
  return (
    &lt;div className={className}&gt;
      &lt;div className="text-center"&gt;
        &lt;ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" /&gt;
        &lt;h3 className="text-lg font-medium text-gray-900 mb-2"&gt;{title}&lt;/h3&gt;
        &lt;p className="text-gray-500 mb-4"&gt;{message}&lt;/p&gt;
        {onRetry &amp;&amp; (
          &lt;Button onClick={onRetry}&gt;
            {retryButtonText}
          &lt;/Button&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default ErrorState;