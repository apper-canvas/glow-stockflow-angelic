import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ContactForm = ({ formData, onFormChange, onSubmit, onCancel, formTitle, submitButtonText = 'Save' }) => {
  const isCustomer = 'companyName' in formData; // Differentiate based on a unique field

  return (
    &lt;form onSubmit={onSubmit} className="space-y-4"&gt;
      &lt;FormField
        label={isCustomer ? "Company Name" : "Supplier Name"}
        id="name"
        type="text"
        required
        value={isCustomer ? formData.companyName : formData.name}
        onChange={(e) => onFormChange(isCustomer ? 'companyName' : 'name', e.target.value)}
      /&gt;
      
      &lt;FormField
        label="Contact Person"
        id="contactPerson"
        type="text"
        required
        value={formData.contactPerson}
        onChange={(e) => onFormChange('contactPerson', e.target.value)}
      /&gt;
      
      &lt;FormField
        label="Email"
        id="email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => onFormChange('email', e.target.value)}
      /&gt;
      
      &lt;FormField
        label="Phone"
        id="phone"
        type="tel"
        required
        value={formData.phone}
        onChange={(e) => onFormChange('phone', e.target.value)}
      /&gt;
      
      &lt;FormField
        label="Address"
        id="address"
        type="textarea"
        value={formData.address}
        onChange={(e) => onFormChange('address', e.target.value)}
        rows="3"
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

export default ContactForm;