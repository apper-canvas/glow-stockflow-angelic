import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () =&gt; {
  const navigate = useNavigate();

  return (
    &lt;div className="min-h-full flex items-center justify-center p-6"&gt;
      &lt;motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      &gt;
        &lt;motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
        &gt;
          &lt;ApperIcon name="AlertTriangle" size={48} className="text-red-500" /&gt;
        &lt;/motion.div&gt;
        
        &lt;h1 className="text-6xl font-bold text-gray-900 mb-4"&gt;404&lt;/h1&gt;
        &lt;h2 className="text-2xl font-semibold text-gray-700 mb-4"&gt;Page Not Found&lt;/h2&gt;
        &lt;p className="text-gray-500 mb-8"&gt;
          The page you're looking for doesn't exist or has been moved.
        &lt;/p&gt;
        
        &lt;div className="space-y-4"&gt;
          &lt;Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =&gt; navigate('/dashboard')}
            className="w-full"
          &gt;
            Go to Dashboard
          &lt;/Button&gt;
          
          &lt;Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =&gt; navigate(-1)}
            variant="secondary"
            className="w-full"
          &gt;
            Go Back
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/motion.div&gt;
    &lt;/div&gt;
  );
};

export default NotFoundPage;