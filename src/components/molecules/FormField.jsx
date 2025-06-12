import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, type = 'text', children, className = '', ...inputProps }) => {
  return (
    <div className={className}>
      {label && &lt;Label htmlFor={id}&gt;{label}&lt;/Label&gt;}
      {type === 'select' ? (
        &lt;Input type="select" id={id} {...inputProps}&gt;
          {children}
        &lt;/Input&gt;
      ) : (
        &lt;Input type={type} id={id} {...inputProps} /&gt;
      )}
    </div>
  );
};

export default FormField;