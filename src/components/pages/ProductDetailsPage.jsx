import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductDetailsPanel from '@/components/organisms/ProductDetailsPanel';
import * as productService from '@/services/api/productService';
import * as supplierService from '@/services/api/supplierService';

const ProductDetailsPage = () =&gt; {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() =&gt; {
    loadProduct(id);
  }, [id]);

  const loadProduct = async (productId) =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const productData = await productService.getById(productId);
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

  return (
    &lt;ProductDetailsPanel
      product={product}
      supplier={supplier}
      loading={loading}
      error={error}
      productId={id}
      loadProduct={loadProduct}
    /&gt;
  );
};

export default ProductDetailsPage;