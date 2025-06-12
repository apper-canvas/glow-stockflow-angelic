import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as productService from '../services/api/productService';
import * as supplierService from '../services/api/supplierService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productData = await productService.getById(id);
      setProduct(productData);
      
      if (productData.supplierId) {
        const supplierData = await supplierService.getById(productData.supplierId);
        setSupplier(supplierData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load product');
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-36"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested product could not be found'}</p>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 break-words">{product.name}</h1>
            <button
              onClick={() => navigate('/inventory')}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Inventory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Information</label>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">SKU:</span>
                    <span className="text-gray-900 font-medium break-words">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="text-gray-900 font-medium break-words">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Description:</span>
                    <span className="text-gray-900 break-words">{product.description || 'No description'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Information</label>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Stock:</span>
                    <span className={`font-medium ${
                      product.quantity <= product.reorderPoint ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.quantity}
                      {product.quantity <= product.reorderPoint && (
                        <ApperIcon name="AlertTriangle" size={16} className="inline ml-2 text-red-500" />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reorder Point:</span>
                    <span className="text-gray-900 font-medium">{product.reorderPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-900 break-words">{product.location || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unit Price:</span>
                    <span className="text-gray-900 font-medium">${product.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Value:</span>
                    <span className="text-gray-900 font-medium">
                      ${(product.quantity * product.unitPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {supplier && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Information</label>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Company:</span>
                      <span className="text-gray-900 font-medium break-words">{supplier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact:</span>
                      <span className="text-gray-900 break-words">{supplier.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 break-words">{supplier.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-900 break-words">{supplier.phone}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {product.quantity <= product.reorderPoint && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <ApperIcon name="AlertTriangle" size={20} className="text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                  <p className="text-sm text-red-700 mt-1">
                    This product is at or below its reorder point. Consider creating a purchase order to restock.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;