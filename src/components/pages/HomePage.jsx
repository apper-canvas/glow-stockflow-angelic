import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HomePage = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'View Dashboard',
      description: 'Monitor key metrics and alerts',
      icon: 'LayoutDashboard',
      color: 'bg-blue-500',
      path: '/dashboard'
    },
    {
      title: 'Check Inventory',
      description: 'Review stock levels and products',
      icon: 'Package',
      color: 'bg-green-500',
      path: '/inventory'
    },
    {
      title: 'Manage Orders',
      description: 'Process purchase and sales orders',
      icon: 'ShoppingCart',
      color: 'bg-purple-500',
      path: '/purchase-orders'
    },
    {
      title: 'Generate Invoice',
      description: 'Create and manage invoices',
      icon: 'FileText',
      color: 'bg-amber-500',
      path: '/invoices'
    }
  ];

  return (
    &lt;div className="min-h-full flex items-center justify-center p-6"&gt;
      &lt;div className="max-w-4xl w-full"&gt;
        &lt;motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        &gt;
          &lt;h1 className="text-4xl font-bold text-gray-900 mb-4"&gt;
            Welcome to StockFlow Pro
          &lt;/h1&gt;
          &lt;p className="text-xl text-gray-600 max-w-2xl mx-auto"&gt;
            Streamline your wholesale operations with comprehensive inventory management, 
            order processing, and real-time tracking capabilities.
          &lt;/p&gt;
        &lt;/motion.div&gt;

        &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-6"&gt;
          {quickActions.map((action, index) =&gt; (
            &lt;motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =&gt; navigate(action.path)}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200"
            &gt;
              &lt;div className="flex items-start space-x-4"&gt;
                &lt;div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}&gt;
                  &lt;ApperIcon name={action.icon} size={24} className="text-white" /&gt;
                &lt;/div&gt;
                &lt;div className="flex-1 min-w-0"&gt;
                  &lt;h3 className="text-lg font-semibold text-gray-900 mb-2"&gt;
                    {action.title}
                  &lt;/h3&gt;
                  &lt;p className="text-gray-600 break-words"&gt;
                    {action.description}
                  &lt;/p&gt;
                &lt;/div&gt;
                &lt;ApperIcon name="ArrowRight" size={20} className="text-gray-400 flex-shrink-0" /&gt;
              &lt;/div&gt;
            &lt;/motion.div&gt;
          ))}
        &lt;/div&gt;

        &lt;motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        &gt;
          &lt;div className="inline-flex items-center space-x-2 text-sm text-gray-500"&gt;
            &lt;ApperIcon name="Shield" size={16} /&gt;
            &lt;span&gt;Secure • Reliable • Efficient&lt;/span&gt;
          &lt;/div&gt;
        &lt;/motion.div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default HomePage;