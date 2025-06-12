import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import ErrorState from '@/components/molecules/ErrorState';
import ContactForm from '@/components/organisms/ContactForm';
import CustomerCardGrid from '@/components/organisms/CustomerCardGrid';
import * as customerService from '@/services/api/customerService';

const CustomersPage = () =&gt; {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() =&gt; {
    loadCustomers();
  }, []);

  const loadCustomers = async () =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) =&gt; {
    e.preventDefault();
    try {
      await customerService.create(newCustomer);
      toast.success('Customer added successfully');
      setShowAddModal(false);
      setNewCustomer({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
      });
      loadCustomers();
    } catch (err) {
      toast.error('Failed to add customer');
    }
  };

  const handleDeleteCustomer = async (customerId) =&gt; {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await customerService.delete(customerId);
      toast.success('Customer deleted successfully');
      loadCustomers();
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

  const handleNewCustomerChange = (field, value) =&gt; {
    setNewCustomer(prev =&gt; ({ ...prev, [field]: value }));
  };

  const filteredCustomers = customers.filter(customer =&gt;
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return &lt;LoadingIndicator /&gt;;
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Customers"
        message={error}
        onRetry={loadCustomers}
      /&gt;
    );
  }

  return (
    &lt;div className="p-6 space-y-6 max-w-full overflow-hidden"&gt;
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"&gt;
        &lt;h1 className="text-2xl font-bold text-gray-900"&gt;Customers&lt;/h1&gt;
        &lt;Button onClick={() =&gt; setShowAddModal(true)}&gt;
          &lt;ApperIcon name="Plus" size={16} className="mr-2" /&gt;
          Add Customer
        &lt;/Button&gt;
      &lt;/div&gt;

      &lt;div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"&gt;
        &lt;div className="relative max-w-md"&gt;
          &lt;ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /&gt;
          &lt;Input
            type="text"
            value={searchTerm}
            onChange={(e) =&gt; setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="pl-10"
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;CustomerCardGrid
        customers={filteredCustomers}
        searchTerm={searchTerm}
        onAddCustomer={() =&gt; setShowAddModal(true)}
        onDeleteCustomer={handleDeleteCustomer}
        onViewCustomer={setSelectedCustomer}
      /&gt;

      &lt;Modal
        isOpen={showAddModal}
        onClose={() =&gt; setShowAddModal(false)}
        title="Add New Customer"
      &gt;
        &lt;ContactForm
          formData={newCustomer}
          onFormChange={handleNewCustomerChange}
          onSubmit={handleAddCustomer}
          onCancel={() =&gt; setShowAddModal(false)}
          formTitle="Add New Customer"
          submitButtonText="Add Customer"
        /&gt;
      &lt;/Modal&gt;

      &lt;Modal
        isOpen={!!selectedCustomer}
        onClose={() =&gt; setSelectedCustomer(null)}
        title="Customer Details"
      &gt;
        {selectedCustomer &amp;&amp; (
          &lt;div className="space-y-4"&gt;
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Company Name&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedCustomer.companyName}&lt;/p&gt;
            &lt;/div&gt;
            
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Contact Person&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedCustomer.contactPerson}&lt;/p&gt;
            &lt;/div&gt;
            
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Email&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedCustomer.email}&lt;/p&gt;
            &lt;/div&gt;
            
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Phone&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedCustomer.phone}&lt;/p&gt;
            &lt;/div&gt;
            
            {selectedCustomer.address &amp;&amp; (
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Address&lt;/label&gt;
                &lt;p className="text-gray-900 break-words"&gt;{selectedCustomer.address}&lt;/p&gt;
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        )}
        &lt;div className="flex justify-end pt-6"&gt;
          &lt;Button variant="secondary" onClick={() =&gt; setSelectedCustomer(null)}&gt;
            Close
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/Modal&gt;
    &lt;/div&gt;
  );
};

export default CustomersPage;