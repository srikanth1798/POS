import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import { useProducts, Product } from '../../context/ProductContext';

const serviceTypes = [
  "Order Management",
  "Employee Management",
  "Table Management",
  "Inventory Management",
  "Billing Management"
] as const;

const AllProducts = () => {
  const navigate = useNavigate();
  const { products, addProduct, deleteProduct } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: 'Order Management' as Product['serviceType'],
    features: [''],
    price: 0,
    description: '',
    status: 'active' as 'active' | 'inactive',
    tier: 'Basic' as 'Basic' | 'Advanced' | 'Pro'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };
    
    addProduct(newProduct);
    setShowModal(false);
    setFormData({
      name: '',
      serviceType: 'Order Management',
      features: [''],
      price: 0,
      description: '',
      status: 'active',
      tier: 'Basic'
    });
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="products-page">
      <div className="header">
        <div className="header-content">
          <h1> Products Management</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch />
              <input type="text" placeholder="Search products..." />
            </div>
            <button className="filter-btn">
              <FaFilter />
              Filters
            </button>
            <button 
              className="add-product-btn"
              onClick={() => setShowModal(true)}
            >
              <FaPlus /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products by Service Type */}
      {serviceTypes.map(serviceType => {
        const serviceProducts = Object.values(products).filter((p: Product) => p.serviceType === serviceType);
        if (serviceProducts.length === 0) return null;

        return (
          <div key={serviceType} className="service-section">
            <h2 className="service-title">{serviceType}</h2>
            <div className="products-grid">
              {serviceProducts.map((product: Product) => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setEditingProduct(product);
                        setFormData({
                          name: product.name,
                          serviceType: product.serviceType,
                          features: [...product.features, ''],
                          price: product.price,
                          description: product.description,
                            status: product.status,
                            tier: product.tier
                        });
                        setShowModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          deleteProduct(product.id);
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="product-content">
                    <h3>{product.name}</h3>
                    <div className="features-list">
                      <h4>Features:</h4>
                      <ul>
                        {product.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="description">{product.description}</p>
                    <div className="price-status">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className={`status ${product.status}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label>Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={e => setFormData({ ...formData, serviceType: e.target.value as Product['serviceType'] })}
                  required
                >
                  <option value="Order Management">Order Management</option>
                  <option value="Employee Management">Employee Management</option>
                  <option value="Table Management">Table Management</option>
                  <option value="Inventory Management">Inventory Management</option>
                  <option value="Billing Management">Billing Management</option>
                </select>
              </div>
              <div className="form-group">
                <label>Features</label>
                {formData.features.map((feature: string, index: number) => (
                  <div key={index} className="feature-input">
                    <input
                      type="text"
                      value={feature}
                      onChange={e => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter feature"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFeature(index)}
                      className="remove-feature"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={handleAddFeature}
                  className="add-feature"
                >
                  <FaPlus /> Add Feature
                </button>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
                <div className="form-group">
                <label>Tier</label>
                <select
                  value={formData.tier}
                  onChange={e => setFormData({ ...formData, tier: e.target.value as 'Basic' | 'Advanced' | 'Pro' })}
                  required
                >
                  <option value="Basic">Basic</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Pro">Pro</option>
                </select>
                </div>
                <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts; 