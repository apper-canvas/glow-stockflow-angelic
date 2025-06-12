import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import ErrorState from '@/components/molecules/ErrorState';
import ContactForm from '@/components/organisms/ContactForm';
import SupplierCardGrid from '@/components/organisms/SupplierCardGrid';
import * as supplierService from '@/services/api/supplierService';

const SuppliersPage = () =&gt; {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() =&gt; {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e) =&gt; {
    e.preventDefault();
    try {
      await supplierService.create(newSupplier);
      toast.success('Supplier added successfully');
      setShowAddModal(false);
      setNewSupplier({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
      });
      loadSuppliers();
    } catch (err) {
      toast.error('Failed to add supplier');
    }
  };

  const handleDeleteSupplier = async (supplierId) =&gt; {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await supplierService.delete(supplierId);
      toast.success('Supplier deleted successfully');
      loadSuppliers();
    } catch (err) {
      toast.error('Failed to delete supplier');
    }
  };

  const handleNewSupplierChange = (field, value) =&gt; {
    setNewSupplier(prev =&gt; ({ ...prev, [field]: value }));
  };

  const filteredSuppliers = suppliers.filter(supplier =&gt;
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return &lt;LoadingIndicator /&gt;;
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Suppliers"
        message={error}
        onRetry={loadSuppliers}
      /&gt;
    );
  }

  return (
    &lt;div className="p-6 space-y-6 max-w-full overflow-hidden"&gt;
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"&gt;
        &lt;h1 className="text-2xl font-bold text-gray-900"&gt;Suppliers&lt;/h1&gt;
        &lt;Button onClick={() =&gt; setShowAddModal(true)}&gt;
          &lt;ApperIcon name="Plus" size={16} className="mr-2" /&gt;
          Add Supplier
        &lt;/Button&gt;
      &lt;/div&gt;

      &lt;div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"&gt;
        &lt;div className="relative max-w-md"&gt;
          &lt;ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /&gt;
          &lt;Input
            type="text"
            value={searchTerm}
            onChange={(e) =&gt; setSearchTerm(e.target.value)}
            placeholder="Search suppliers..."
            className="pl-10"
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;SupplierCardGrid
        suppliers={filteredSuppliers}
        searchTerm={searchTerm}
        onAddSupplier={() =&gt; setShowAddModal(true)}
        onDeleteSupplier={handleDeleteSupplier}
        onViewSupplier={setSelectedSupplier}
      /&gt;

      &lt;Modal
        isOpen={showAddModal}
        onClose={() =&gt; setShowAddModal(false)}
        title="Add New Supplier"
      &gt;
        &lt;ContactForm
          formData={newSupplier}
          onFormChange={handleNewSupplierChange}
          onSubmit={handleAddSupplier}
          onCancel={() =&gt; setShowAddModal(false)}
          formTitle="Add New Supplier"
          submitButtonText="Add Supplier"
        /&gt;
      &lt;/Modal&gt;

      &lt;Modal
        isOpen={!!selectedSupplier}
        onClose={() =&gt; setSelectedSupplier(null)}
        title="Supplier Details"
      &gt;
        {selectedSupplier &amp;&amp; (
          &lt;div className="space-y-4"&gt;
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Company Name&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedSupplier.name}&lt;/p&gt;
            &lt;/div&gt;
            
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Contact Person&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedSupplier.contactPerson}&lt;/p&gt;
            &lt;/div&gt;
            
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Email&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedSupplier.email}&lt;/p&gt;
            &lt;/div&gt;
            
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Phone&lt;/label&gt;
              &lt;p className="text-gray-900 break-words"&gt;{selectedSupplier.phone}&lt;/p&gt;
            &lt;/div&gt;
            
            {selectedSupplier.address &amp;&amp; (
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Address&lt;/label&gt;
                &lt;p className="text-gray-900 break-words"&gt;{selectedSupplier.address}&lt;/p&gt;
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        )}
        &lt;div className="flex justify-end pt-6"&gt;
          &lt;Button variant="secondary" onClick={() =&gt; setSelectedSupplier(null)}&gt;
            Close
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/Modal&gt;
    &lt;/div&gt;
  );
};

export default SuppliersPage;