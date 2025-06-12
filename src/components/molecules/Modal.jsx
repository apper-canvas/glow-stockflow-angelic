import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Modal = ({ isOpen, onClose, title, children, className = '', size = 'md' }) => {
  if (!isOpen) return null;

  let maxWidthClass = 'max-w-md';
  if (size === 'lg') maxWidthClass = 'max-w-2xl';
  if (size === 'xl') maxWidthClass = 'max-w-4xl';

  return (
    &lt;AnimatePresence&gt;
      &lt;motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose} // Close modal when clicking outside
      &gt;
        &lt;motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        &gt;
          &lt;div className="p-6"&gt;
            &lt;div className="flex items-center justify-between mb-6"&gt;
              &lt;h3 className="text-lg font-medium text-gray-900"&gt;{title}&lt;/h3&gt;
              &lt;Button variant="icon" onClick={onClose}&gt;
                &lt;ApperIcon name="X" size={20} /&gt;
              &lt;/Button&gt;
            &lt;/div&gt;
            {children}
          &lt;/div&gt;
        &lt;/motion.div&gt;
      &lt;/motion.div&gt;
    &lt;/AnimatePresence&gt;
  );
};

export default Modal;