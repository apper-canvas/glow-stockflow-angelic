import React from 'react';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';

const SupplierCardGrid = ({ suppliers, searchTerm, onAddSupplier, onDeleteSupplier, onViewSupplier }) => {
  if (suppliers.length === 0) {
    return (
      &lt;EmptyState
        icon="Truck"
        title={searchTerm ? 'No Suppliers Found' : 'No Suppliers Yet'}
        description={searchTerm ? 'Try adjusting your search terms' : 'Add your first supplier to get started'}
        buttonText="Add Supplier"
        onButtonClick={onAddSupplier}
      /&gt;
    );
  }

  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
      {suppliers.map((supplier, index) => (
        &lt;Card
          key={supplier.id}
          animate
          delay={index * 0.1}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewSupplier(supplier)}
        &gt;
          &lt;div className="flex items-start justify-between mb-4"&gt;
            &lt;div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"&gt;
              &lt;ApperIcon name="Truck" size={24} className="text-blue-600" /&gt;
            &lt;/div&gt;
            &lt;div className="flex space-x-2"&gt;
              &lt;Button variant="text" onClick={(e) => { e.stopPropagation(); onViewSupplier(supplier); }}&gt;
                &lt;ApperIcon name="Eye" size={16} /&gt;
              &lt;/Button&gt;
              &lt;Button variant="text" className="text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); onDeleteSupplier(supplier.id); }}&gt;
                &lt;ApperIcon name="Trash2" size={16} /&gt;
              &lt;/Button&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;h3 className="text-lg font-medium text-gray-900 mb-2 break-words"&gt;
            {supplier.name}
          &lt;/h3&gt;
          
          &lt;div className="space-y-2 text-sm text-gray-600"&gt;
            &lt;div className="flex items-center space-x-2"&gt;
              &lt;ApperIcon name="User" size={14} /&gt;
              &lt;span className="break-words"&gt;{supplier.contactPerson}&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex items-center space-x-2"&gt;
              &lt;ApperIcon name="Mail" size={14} /&gt;
              &lt;span className="break-words"&gt;{supplier.email}&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex items-center space-x-2"&gt;
              &lt;ApperIcon name="Phone" size={14} /&gt;
              &lt;span className="break-words"&gt;{supplier.phone}&lt;/span&gt;
            &lt;/div&gt;
            {supplier.address &amp;&amp; (
              &lt;div className="flex items-start space-x-2"&gt;
                &lt;ApperIcon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" /&gt;
                &lt;span className="break-words"&gt;{supplier.address}&lt;/span&gt;
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        &lt;/Card&gt;
      ))}
    &lt;/div&gt;
  );
};

export default SupplierCardGrid;