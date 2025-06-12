import React from 'react';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';

const InvoiceCardGrid = ({ invoices, availableOrdersLength, getCustomerName, getOrderNumber, onGenerateInvoice, onUpdateStatus, onViewInvoice, onPrintInvoice }) => {
  if (invoices.length === 0) {
    return (
      &lt;EmptyState
        icon="FileText"
        title="No Invoices Generated"
        description={
          availableOrdersLength &gt; 0
            ? 'Generate your first invoice from a delivered sales order'
            : 'Complete sales orders to generate invoices'
        }
        buttonText={availableOrdersLength &gt; 0 ? 'Generate Invoice' : undefined}
        onButtonClick={onGenerateInvoice}
      /&gt;
    );
  }

  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
      {invoices.map((invoice, index) => (
        &lt;Card
          key={invoice.id}
          animate
          delay={index * 0.1}
          className="hover:shadow-md transition-shadow"
        &gt;
          &lt;div className="flex items-start justify-between mb-4"&gt;
            &lt;div&gt;
              &lt;h3 className="text-lg font-medium text-gray-900 break-words"&gt;
                {invoice.invoiceNumber}
              &lt;/h3&gt;
              &lt;p className="text-sm text-gray-500 break-words"&gt;
                {getCustomerName(invoice.customerId)}
              &lt;/p&gt;
            &lt;/div&gt;
            &lt;span className={`px-3 py-1 text-xs font-medium rounded-full ${
              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}&gt;
              {invoice.status}
            &lt;/span&gt;
          &lt;/div&gt;

          &lt;div className="space-y-2 mb-4"&gt;
            &lt;div className="flex justify-between text-sm"&gt;
              &lt;span className="text-gray-500"&gt;Issue Date:&lt;/span&gt;
              &lt;span className="text-gray-900"&gt;
                {new Date(invoice.issueDate).toLocaleDateString()}
              &lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex justify-between text-sm"&gt;
              &lt;span className="text-gray-500"&gt;Due Date:&lt;/span&gt;
              &lt;span className="text-gray-900"&gt;
                {new Date(invoice.dueDate).toLocaleDateString()}
              &lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex justify-between text-sm"&gt;
              &lt;span className="text-gray-500"&gt;Order:&lt;/span&gt;
              &lt;span className="text-gray-900 break-words"&gt;
                {getOrderNumber(invoice.salesOrderId)}
              &lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex justify-between text-sm font-medium"&gt;
              &lt;span className="text-gray-900"&gt;Amount:&lt;/span&gt;
              &lt;span className="text-gray-900"&gt;
                ${invoice.totalAmount?.toLocaleString() || '0'}
              &lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;div className="flex items-center justify-between"&gt;
            &lt;div className="flex space-x-2"&gt;
              &lt;Button variant="text" className="text-sm" onClick={() => onViewInvoice(invoice)}&gt;
                View
              &lt;/Button&gt;
              &lt;Button variant="ghost" className="text-sm" onClick={() => onPrintInvoice(invoice)}&gt;
                Print
              &lt;/Button&gt;
            &lt;/div&gt;
            
            {invoice.status === 'pending' &amp;&amp; (
              &lt;div className="flex space-x-2"&gt;
                &lt;Button variant="secondary" className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onClick={() => onUpdateStatus(invoice.id, 'sent')}&gt;
                  Mark Sent
                &lt;/Button&gt;
              &lt;/div&gt;
            )}
            
            {invoice.status === 'sent' &amp;&amp; (
              &lt;Button variant="secondary" className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200" onClick={() => onUpdateStatus(invoice.id, 'paid')}&gt;
                Mark Paid
              &lt;/Button&gt;
            )}
          &lt;/div&gt;
        &lt;/Card&gt;
      ))}
    &lt;/div&gt;
  );
};

export default InvoiceCardGrid;