import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const product = products[Number(id)];
  
  if (!product) {
    return <div>Product not found</div>;
  }

  // Get all products of the same service type for comparison
  const relatedProducts = Object.values(products).filter(
    p => p.serviceType === product.serviceType
  ).sort((a, b) => {
    const tierOrder = { Basic: 1, Advanced: 2, Pro: 3 };
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Basic': return '#4CAF50';
      case 'Advanced': return '#2196F3';
      case 'Pro': return '#9C27B0';
      default: return '#000';
    }
    };

    return (
    <div className="product-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
      <FaArrowLeft /> Back to Products
      </button>

      <div className="product-header">
      <h1>{product.name}</h1>
      <span className="tier-badge" style={{ backgroundColor: getTierColor(product.tier) }}>
        {product.tier}
      </span>
      </div>

      <div className="product-info">
      <p className="description">{product.description}</p>
      <div className="price-tag">${product.price.toFixed(2)}/month</div>
      </div>

      <div className="features-section">
      <h2>Features</h2>
      <ul className="features-list">
        {product.features.map((feature, index) => (
        <li key={index}>
          <FaCheck className="check-icon" /> {feature}
        </li>
        ))}
      </ul>
      </div>

      <div className="comparison-section">
      <h2>Compare {product.serviceType} Tiers</h2>
      <div className="comparison-grid">
        {relatedProducts.map(prod => (
        <div 
          key={prod.id} 
          className={`comparison-card ${prod.id === product.id ? 'current' : ''}`}
          style={{ borderColor: getTierColor(prod.tier) }}
        >
          <h3>{prod.tier}</h3>
          <div className="price">${prod.price.toFixed(2)}/month</div>
          <ul>
          {prod.features.map((feature, index) => (
            <li key={index}>
            <FaCheck /> {feature}
            </li>
          ))}
          </ul>
          {prod.id !== product.id && (
          <button 
            className="view-tier-btn"
            onClick={() => navigate(`/products/${prod.id}`)}
            style={{ backgroundColor: getTierColor(prod.tier) }}
          >
            View {prod.tier} Plan
          </button>
          )}
        </div>
        ))}
      </div>
      </div>
    </div>

  );
};

export default ProductDetails;