import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const LowStockAlerts = ({ lowStockItems, onQuickReorder, onStockAdjustment }) => {
  return (
    &lt;Card animate delay={0.5}&gt;
      &lt;div className="flex items-center justify-between mb-4"&gt;
        &lt;h3 className="text-lg font-medium text-gray-900"&gt;Low Stock Alerts&lt;/h3&gt;
        &lt;ApperIcon name="AlertTriangle" size={20} className="text-red-600" /&gt;
      &lt;/div&gt;
      
      {lowStockItems.length === 0 ? (
        &lt;div className="text-center py-8"&gt;
          &lt;ApperIcon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" /&gt;
          &lt;h4 className="text-sm font-medium text-gray-900 mb-2"&gt;All Stock Levels Good&lt;/h4&gt;
          &lt;p className="text-sm text-gray-500"&gt;No items below reorder point&lt;/p&gt;
        &lt;/div&gt;
      ) : (
        &lt;div className="space-y-3 max-h-64 overflow-y-auto"&gt;
          {lowStockItems.map((item) =&gt; (
            &lt;div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"&gt;
              &lt;div className="flex-1 min-w-0"&gt;
                &lt;p className="text-sm font-medium text-gray-900 truncate"&gt;{item.name}&lt;/p&gt;
                &lt;p className="text-xs text-gray-500"&gt;
                  Current: {item.quantity} | Reorder Point: {item.reorderPoint}
                &lt;/p&gt;
              &lt;/div&gt;
              &lt;div className="flex items-center space-x-2 ml-4"&gt;
                &lt;Button
                  variant="primary"
                  className="px-3 py-1 text-xs"
                  onClick={() =&gt; onQuickReorder(item.id)}
                &gt;
                  Reorder
                &lt;/Button&gt;
                &lt;Button
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                  onClick={() =&gt; {
                    const newQuantity = prompt(`Enter new quantity for ${item.name}:`, item.quantity);
                    if (newQuantity &amp;&amp; !isNaN(newQuantity)) {
                      onStockAdjustment(item.id, parseInt(newQuantity));
                    }
                  }}
                &gt;
                  Adjust
                &lt;/Button&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          ))}
        &lt;/div&gt;
      )}
    &lt;/Card&gt;
  );
};

export default LowStockAlerts;