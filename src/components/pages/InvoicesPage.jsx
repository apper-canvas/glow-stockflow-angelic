import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Modal from '@/components/molecules/Modal';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import ErrorState from '@/components/molecules/ErrorState';
import AlertMessage from '@/components/molecules/AlertMessage';
import InvoiceCardGrid from '@/components/organisms/InvoiceCardGrid';
import * as invoiceService from '@/services/api/invoiceService';
import * as salesOrderService from '@/services/api/salesOrderService';
import * as customerService from '@/services/api/customerService';

const InvoicesPage = () =&gt; {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  useEffect(() =&gt; {
    loadData();
  }, []);

  const loadData = async () =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const [invoicesData, ordersData, customersData] = await Promise.all([
        invoiceService.getAll(),
        salesOrderService.getAll(),
        customerService.getAll()
      ]);
      setInvoices(invoicesData);
      setSalesOrders(ordersData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e) =&gt; {
    e.preventDefault();
    
    if (!selectedOrderId) {
      toast.error('Please select a sales order');
      return;
    }

    try {
      const order = salesOrders.find(order =&gt; order.id === selectedOrderId);
      if (!order) {
        toast.error('Selected order not found');
        return;
      }

      const invoiceData = {
        salesOrderId: order.id,
        customerId: order.customerId,
        totalAmount: order.totalAmount,
        status: 'pending'
      };

      await invoiceService.create(invoiceData);
      toast.success('Invoice created successfully');
      setShowCreateModal(false);
      setSelectedOrderId('');
      loadData();
    } catch (err) {
      toast.error('Failed to create invoice');
    }
  };

  const handleUpdateStatus = async (invoiceId, newStatus) =&gt; {
    try {
      await invoiceService.update(invoiceId, { status: newStatus });
      toast.success(`Invoice status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update invoice status');
    }
  };

  const handlePrintInvoice = (invoice) =&gt; {
    const printWindow = window.open('', '_blank');
    const customer = customers.find(c =&gt; c.id === invoice.customerId);
    const salesOrder = salesOrders.find(o =&gt; o.id === invoice.salesOrderId);

    const printContent = `
      &lt;html&gt;
        &lt;head&gt;
          &lt;title&gt;Invoice ${invoice.invoiceNumber}&lt;/title&gt;
          &lt;style&gt;
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .customer-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
            @media print { button { display: none; } }
          &lt;/style&gt;
        &lt;/head&gt;
        &lt;body&gt;
          &lt;div class="header"&gt;
            &lt;h1&gt;StockFlow Pro&lt;/h1&gt;
            &lt;h2&gt;INVOICE&lt;/h2&gt;
          &lt;/div&gt;
          
          &lt;div class="invoice-details"&gt;
            &lt;p&gt;&lt;strong&gt;Invoice Number:&lt;/strong&gt; ${invoice.invoiceNumber}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Invoice Date:&lt;/strong&gt; ${new Date(invoice.issueDate).toLocaleDateString()}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Due Date:&lt;/strong&gt; ${new Date(invoice.dueDate).toLocaleDateString()}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Status:&lt;/strong&gt; ${invoice.status.toUpperCase()}&lt;/p&gt;
          &lt;/div&gt;
          
          &lt;div class="customer-details"&gt;
            &lt;h3&gt;Bill To:&lt;/h3&gt;
            &lt;p&gt;&lt;strong&gt;${customer?.companyName || 'Unknown Customer'}&lt;/strong&gt;&lt;/p&gt;
            &lt;p&gt;${customer?.contactPerson || ''}&lt;/p&gt;
            &lt;p&gt;${customer?.email || ''}&lt;/p&gt;
            &lt;p&gt;${customer?.phone || ''}&lt;/p&gt;
            &lt;p&gt;${customer?.address || ''}&lt;/p&gt;
          &lt;/div&gt;
          
          &lt;table&gt;
            &lt;thead&gt;
              &lt;tr&gt;
                &lt;th&gt;Description&lt;/th&gt;
                &lt;th&gt;Quantity&lt;/th&gt;
                &lt;th&gt;Unit Price&lt;/th&gt;
                &lt;th&gt;Total&lt;/th&gt;
              &lt;/tr&gt;
            &lt;/thead&gt;
            &lt;tbody&gt;
              ${salesOrder?.items?.map(item =&gt; `
                &lt;tr&gt;
                  &lt;td&gt;Sales Order Item&lt;/td&gt;
                  &lt;td&gt;${item.quantity}&lt;/td&gt;
                  &lt;td&gt;$${item.unitPrice?.toFixed(2) || '0.00'}&lt;/td&gt;
                  &lt;td&gt;$${((item.quantity * item.unitPrice) || 0).toFixed(2)}&lt;/td&gt;
                &lt;/tr&gt;
              `).join('') || '<tr>&lt;td colspan="4"&gt;No items found&lt;/td&gt;&lt;/tr&gt;'}
            &lt;/tbody&gt;
          &lt;/table&gt;
          
          &lt;div class="total"&gt;
            &lt;p&gt;Total Amount: $${invoice.totalAmount?.toFixed(2) || '0.00'}&lt;/p&gt;
          &lt;/div&gt;
          
          &lt;div style="margin-top: 50px; text-align: center;"&gt;
            &lt;button onclick="window.print()"&gt;Print Invoice&lt;/button&gt;
            &lt;button onclick="window.close()"&gt;Close&lt;/button&gt;
          &lt;/div&gt;
        &lt;/body&gt;
      &lt;/html&gt;
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getCustomerName = (customerId) =&gt; {
    const customer = customers.find(c =&gt; c.id === customerId);
    return customer ? customer.companyName : 'Unknown Customer';
  };

  const getOrderNumber = (orderId) =&gt; {
    const order = salesOrders.find(o =&gt; o.id === orderId);
    return order ? order.orderNumber : 'Unknown Order';
  };

  const availableOrders = salesOrders.filter(order =&gt; 
    order.status === 'delivered' &amp;&amp; 
    !invoices.some(invoice =&gt; invoice.salesOrderId === order.id)
  );

  if (loading) {
    return &lt;LoadingIndicator /&gt;;
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Invoices"
        message={error}
        onRetry={loadData}
      /&gt;
    );
  }

  return (
    &lt;div className="p-6 space-y-6 max-w-full overflow-hidden"&gt;
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"&gt;
        &lt;h1 className="text-2xl font-bold text-gray-900"&gt;Invoices&lt;/h1&gt;
        &lt;Button
          onClick={() =&gt; setShowCreateModal(true)}
          disabled={availableOrders.length === 0}
        &gt;
          &lt;ApperIcon name="Plus" size={16} className="mr-2" /&gt;
          Generate Invoice
        &lt;/Button&gt;
      &lt;/div&gt;

      {availableOrders.length === 0 &amp;&amp; invoices.length === 0 &amp;&amp; (
        &lt;AlertMessage
          type="warning"
          title="No Delivered Orders"
          message="Invoices can only be generated from delivered sales orders. Create and deliver sales orders first."
        /&gt;
      )}

      &lt;InvoiceCardGrid
        invoices={invoices}
        availableOrdersLength={availableOrders.length}
        getCustomerName={getCustomerName}
        getOrderNumber={getOrderNumber}
        onGenerateInvoice={() =&gt; setShowCreateModal(true)}
        onUpdateStatus={handleUpdateStatus}
        onViewInvoice={setSelectedInvoice}
        onPrintInvoice={handlePrintInvoice}
      /&gt;

      &lt;Modal
        isOpen={showCreateModal}
        onClose={() =&gt; setShowCreateModal(false)}
        title="Generate Invoice"
      &gt;
        &lt;form onSubmit={handleCreateInvoice} className="space-y-4"&gt;
          &lt;FormField
            label="Select Delivered Sales Order"
            id="selectedOrderId"
            type="select"
            required
            value={selectedOrderId}
            onChange={(e) =&gt; setSelectedOrderId(e.target.value)}
          &gt;
            &lt;option value=""&gt;Choose an order...&lt;/option&gt;
            {availableOrders.map(order =&gt; (
              &lt;option key={order.id} value={order.id}&gt;
                {order.orderNumber} - {getCustomerName(order.customerId)} - ${order.totalAmount?.toLocaleString() || '0'}
              &lt;/option&gt;
            ))}
          &lt;/FormField&gt;
          
          {availableOrders.length === 0 &amp;&amp; (
            &lt;p className="text-sm text-gray-500 mt-2"&gt;
              No delivered orders available for invoicing
            &lt;/p&gt;
          )}
          
          &lt;div className="flex justify-end space-x-3 pt-4 border-t border-gray-200"&gt;
            &lt;Button type="button" variant="secondary" onClick={() =&gt; setShowCreateModal(false)}&gt;
              Cancel
            &lt;/Button&gt;
            &lt;Button type="submit" disabled={!selectedOrderId}&gt;
              Generate Invoice
            &lt;/Button&gt;
          &lt;/div&gt;
        &lt;/form&gt;
      &lt;/Modal&gt;

      &lt;Modal
        isOpen={!!selectedInvoice}
        onClose={() =&gt; setSelectedInvoice(null)}
        title="Invoice Details"
        size="lg"
      &gt;
        {selectedInvoice &amp;&amp; (
          &lt;div className="space-y-6"&gt;
            &lt;div className="grid grid-cols-2 gap-4"&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700"&gt;Invoice Number&lt;/label&gt;
                &lt;p className="text-gray-900 break-words"&gt;{selectedInvoice.invoiceNumber}&lt;/p&gt;
              &lt;/div&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700"&gt;Status&lt;/label&gt;
                &lt;span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  selectedInvoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedInvoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}&gt;
                  {selectedInvoice.status}
                &lt;/span&gt;
              &lt;/div&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700"&gt;Customer&lt;/label&gt;
                &lt;p className="text-gray-900 break-words"&gt;{getCustomerName(selectedInvoice.customerId)}&lt;/p&gt;
              &lt;/div&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700"&gt;Sales Order&lt;/label&gt;
                &lt;p className="text-gray-900 break-words"&gt;{getOrderNumber(selectedInvoice.salesOrderId)}&lt;/p&gt;
              &lt;/div&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700"&gt;Issue Date&lt;/label&gt;
                &lt;p className="text-gray-900"&gt;{new Date(selectedInvoice.issueDate).toLocaleDateString()}&lt;/p&gt;
              &lt;/div&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700"&gt;Due Date&lt;/label&gt;
                &lt;p className="text-gray-900"&gt;{new Date(selectedInvoice.dueDate).toLocaleDateString()}&lt;/p&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            &lt;div className="border-t border-gray-200 pt-4"&gt;
              &lt;div className="flex justify-between items-center"&gt;
                &lt;span className="text-lg font-medium text-gray-900"&gt;Total Amount&lt;/span&gt;
                &lt;span className="text-2xl font-bold text-gray-900"&gt;
                  ${selectedInvoice.totalAmount?.toFixed(2) || '0.00'}
                &lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            &lt;div className="flex justify-end space-x-3 pt-4 border-t border-gray-200"&gt;
              &lt;Button variant="secondary" onClick={() =&gt; handlePrintInvoice(selectedInvoice)}&gt;
                Print Invoice
              &lt;/Button&gt;
              &lt;Button onClick={() =&gt; setSelectedInvoice(null)}&gt;
                Close
              &lt;/Button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}
      &lt;/Modal&gt;
    &lt;/div&gt;
  );
};

export default InvoicesPage;