import React from 'react';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ title, value, icon, iconColor, animate = false, delay = 0 }) => {
  return (
    &lt;Card animate={animate} delay={delay}&gt;
      &lt;div className="flex items-center justify-between"&gt;
        &lt;div&gt;
          &lt;p className="text-sm text-gray-600"&gt;{title}&lt;/p&gt;
          &lt;p className="text-2xl font-semibold text-gray-900"&gt;
            {value}
          &lt;/p&gt;
        &lt;/div&gt;
        &lt;div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}&gt;
          &lt;ApperIcon name={icon} size={24} className="text-white" /&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/Card&gt;
  );
};

export default MetricCard;