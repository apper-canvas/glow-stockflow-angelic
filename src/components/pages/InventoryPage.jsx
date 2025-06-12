import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import Modal from '@/components/molecules/Modal';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import ErrorState from '@/components/molecules/ErrorState';
import ProductForm from '@/components/organisms/ProductForm';
import ProductListTable from '@/components/organisms/ProductListTable';
import * as productService from '@/services/api/productService';
import * as supplierService from '@/services/api/supplierService';

const InventoryPage = () =&gt; {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    description: '',
    quantity: 0,
    reorderPoint: 0,
    unitPrice: 0,
    supplierId: '',
    location: ''
  });

  useEffect(() =&gt; {
    loadData();
  }, []);

  const loadData = async () =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, suppliersData] = await Promise.all([
        productService.getAll(),
        supplierService.getAll()
      ]);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) =&gt; {
    e.preventDefault();
    try {
      await productService.create(newProduct);
      toast.success('Product added successfully');
      setShowAddModal(false);
      setNewProduct({
        sku: '',
        name: '',
        description: '',
        quantity: 0,
        reorderPoint: 0,
        unitPrice: 0,
        supplierId: '',
        location: ''
      });
      loadData();
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) =&gt; {
    try {
      await productService.update(productId, { quantity: parseInt(newQuantity) });
      toast.success('Stock quantity updated');
      loadData();
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleDeleteProduct = async (productId) =&gt; {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.delete(productId);
      toast.success('Product deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleNewProductChange = (field, value) =&gt; {
    setNewProduct(prev =&gt; ({ ...prev, [field]: value }));
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product =&gt; {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSupplier = !selectedSupplier || product.supplierId === selectedSupplier;
      return matchesSearch &amp;&amp; matchesSupplier;
    })
    .sort((a, b) =&gt; {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'unitPrice':
          comparison = a.unitPrice - b.unitPrice;
          break;
        case 'sku':
          comparison = a.sku.localeCompare(b.sku);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return &lt;LoadingIndicator numCards={0} numRows={5} /&gt;; // Only show table skeleton
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Inventory"
        message={error}
        onRetry={loadData}
      /&gt;
    );
  }

  return (
    &lt;div className="p-6 space-y-6 max-w-full overflow-hidden"&gt;
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"&gt;
        &lt;h1 className="text-2xl font-bold text-gray-900"&gt;Inventory Management&lt;/h1&gt;
        &lt;Button onClick={() =&gt; setShowAddModal(true)}&gt;
          &lt;ApperIcon name="Plus" size={16} className="mr-2" /&gt;
          Add Product
        &lt;/Button&gt;
      &lt;/div&gt;

      &lt;div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"&gt;
        &lt;div className="grid grid-cols-1 md:grid-cols-4 gap-4"&gt;
          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Search&lt;/label&gt;
            &lt;div className="relative"&gt;
              &lt;ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /&gt;
              &lt;Input
                type="text"
                value={searchTerm}
                onChange={(e) =&gt; setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          
          &lt;FormField
            label="Supplier"
            id="supplier-filter"
            type="select"
            value={selectedSupplier}
            onChange={(e) =&gt; setSelectedSupplier(e.target.value)}
          &gt;
            &lt;option value=""&gt;All Suppliers&lt;/option&gt;
            {suppliers.map(supplier =&gt; (
              &lt;option key={supplier.id} value={supplier.id}&gt;{supplier.name}&lt;/option&gt;
            ))}
          &lt;/FormField&gt;
          
          &lt;FormField
            label="Sort By"
            id="sort-by"
            type="select"
            value={sortBy}
            onChange={(e) =&gt; setSortBy(e.target.value)}
          &gt;
            &lt;option value="name"&gt;Name&lt;/option&gt;
            &lt;option value="sku"&gt;SKU&lt;/option&gt;
            &lt;option value="quantity"&gt;Quantity&lt;/option&gt;
            &lt;option value="unitPrice"&gt;Price&lt;/option&gt;
          &lt;/FormField&gt;
          
          &lt;FormField
            label="Order"
            id="sort-order"
            type="select"
            value={sortOrder}
            onChange={(e) =&gt; setSortOrder(e.target.value)}
          &gt;
            &lt;option value="asc"&gt;Ascending&lt;/option&gt;
            &lt;option value="desc"&gt;Descending&lt;/option&gt;
          &lt;/FormField&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"&gt;
        &lt;ProductListTable
          products={filteredProducts}
          searchTerm={searchTerm}
          selectedSupplier={selectedSupplier}
          onAddProduct={() =&gt; setShowAddModal(true)}
          onUpdateQuantity={handleUpdateQuantity}
          onDeleteProduct={handleDeleteProduct}
        /&gt;
      &lt;/div&gt;

      &lt;Modal
        isOpen={showAddModal}
        onClose={() =&gt; setShowAddModal(false)}
        title="Add New Product"
      &gt;
        &lt;ProductForm
          formData={newProduct}
          onFormChange={handleNewProductChange}
          onSubmit={handleAddProduct}
          onCancel={() =&gt; setShowAddModal(false)}
          suppliers={suppliers}
          formTitle="Add New Product"
          submitButtonText="Add Product"
        /&gt;
      &lt;/Modal&gt;
    &lt;/div&gt;
  );
};

export default InventoryPage;