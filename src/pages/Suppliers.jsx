import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as supplierService from '../services/api/supplierService';

const Suppliers = () => {
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

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
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

  const handleAddSupplier = async (e) => {
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

  const handleDeleteSupplier = async (supplierId) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await supplierService.delete(supplierId);
      toast.success('Supplier deleted successfully');
      loadSuppliers();
    } catch (err) {
      toast.error('Failed to delete supplier');
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Suppliers</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadSuppliers}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search suppliers..."
            className="pl-10 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Truck" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No Suppliers Found' : 'No Suppliers Yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first supplier to get started'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Supplier
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Truck" size={24} className="text-blue-600" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSupplier(supplier)}
                    className="text-primary hover:text-blue-700 transition-colors"
                  >
                    <ApperIcon name="Eye" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2 break-words">
                {supplier.name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="User" size={14} />
                  <span className="break-words">{supplier.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={14} />
                  <span className="break-words">{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={14} />
                  <span className="break-words">{supplier.phone}</span>
                </div>
                {supplier.address && (
                  <div className="flex items-start space-x-2">
                    <ApperIcon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="break-words">{supplier.address}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Add New Supplier</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Supplier Details</h3>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <p className="text-gray-900 break-words">{selectedSupplier.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <p className="text-gray-900 break-words">{selectedSupplier.contactPerson}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 break-words">{selectedSupplier.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900 break-words">{selectedSupplier.phone}</p>
              </div>
              
              {selectedSupplier.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900 break-words">{selectedSupplier.address}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-6">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;