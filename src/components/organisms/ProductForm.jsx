import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ProductForm = ({ formData, onFormChange, onSubmit, onCancel, suppliers, formTitle, submitButtonText = 'Save' }) => {
  return (
    &lt;form onSubmit={onSubmit} className="space-y-4"&gt;
      &lt;FormField
        label="SKU"
        id="sku"
        type="text"
        required
        value={formData.sku}
        onChange={(e) => onFormChange('sku', e.target.value)}
      /&gt;
      
      &lt;FormField
        label="Product Name"
        id="name"
        type="text"
        required
        value={formData.name}
        onChange={(e) => onFormChange('name', e.target.value)}
      /&gt;
      
      &lt;FormField
        label="Description"
        id="description"
        type="textarea"
        value={formData.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        rows="2"
      /&gt;
      
      &lt;div className="grid grid-cols-2 gap-4"&gt;
        &lt;FormField
          label="Quantity"
          id="quantity"
          type="number"
          required
          min="0"
          value={formData.quantity}
          onChange={(e) => onFormChange('quantity', parseInt(e.target.value) || 0)}
        /&gt;
        
        &lt;FormField
          label="Reorder Point"
          id="reorderPoint"
          type="number"
          required
          min="0"
          value={formData.reorderPoint}
          onChange={(e) => onFormChange('reorderPoint', parseInt(e.target.value) || 0)}
        /&gt;
      &lt;/div&gt;
      
      &lt;FormField
        label="Unit Price"
        id="unitPrice"
        type="number"
        required
        min="0"
        step="0.01"
        value={formData.unitPrice}
        onChange={(e) => onFormChange('unitPrice', parseFloat(e.target.value) || 0)}
      /&gt;
      
      &lt;FormField
        label="Supplier"
        id="supplierId"
        type="select"
        required
        value={formData.supplierId}
        onChange={(e) => onFormChange('supplierId', e.target.value)}
      &gt;
        &lt;option value=""&gt;Select Supplier&lt;/option&gt;
        {suppliers.map(supplier => (
          &lt;option key={supplier.id} value={supplier.id}&gt;{supplier.name}&lt;/option&gt;
        ))}
      &lt;/FormField&gt;
      
      &lt;FormField
        label="Location"
        id="location"
        type="text"
        value={formData.location}
        onChange={(e) => onFormChange('location', e.target.value)}
      /&gt;
      
      &lt;div className="flex justify-end space-x-3 pt-4"&gt;
        &lt;Button type="button" variant="secondary" onClick={onCancel}&gt;
          Cancel
        &lt;/Button&gt;
        &lt;Button type="submit" variant="primary"&gt;
          {submitButtonText}
        &lt;/Button&gt;
      &lt;/div&gt;
    &lt;/form&gt;
  );
};

export default ProductForm;