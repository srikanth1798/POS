import { useState } from 'react';
import {
  FaChartLine,
  FaClipboardList,
  FaUsersCog,
  FaBell,
  FaHistory,
  FaCog,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import './OrderManagement.css';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  adminFeatures: string[];
}

const features = [
  {
    id: 1,
    title: 'Real-time Analytics',
    description: 'Monitor order volumes, peak times, and revenue metrics across all locations',
    icon: <FaChartLine />,
    adminFeatures: ['Cross-location performance comparison', 'Revenue forecasting', 'Peak hour analysis']
  },
  {
    id: 2,
    title: 'Order Processing',
    description: 'Centralized order management system for all branches',
    icon: <FaClipboardList />,
    adminFeatures: ['Bulk order processing', 'Priority management', 'Custom order workflows']
  },
  {
    id: 3,
    title: 'Staff Management',
    description: 'Monitor and manage staff performance across all locations',
    icon: <FaUsersCog />,
    adminFeatures: ['Staff performance metrics', 'Workload distribution', 'Training needs identification']
  },
  {
    id: 4,
    title: 'Alert System',
    description: 'Customizable alerts for critical order management situations',
    icon: <FaBell />,
    adminFeatures: ['Custom alert thresholds', 'Emergency notifications', 'System health monitoring']
  },
  {
    id: 5,
    title: 'Order History',
    description: 'Comprehensive order tracking and history management',
    icon: <FaHistory />,
    adminFeatures: ['Advanced search capabilities', 'Audit trails', 'Data export options']
  },
  {
    id: 6,
    title: 'System Configuration',
    description: 'Centralized system settings and configuration management',
    icon: <FaCog />,
    adminFeatures: ['Global policy settings', 'Branch-specific configurations', 'Integration management']
  }
];

const OrderManagement = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [featuresList, setFeaturesList] = useState<Feature[]>(features);
  const [showAddFeatureModal, setShowAddFeatureModal] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    adminFeatures: ['']
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  const handleAdminFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newFeature.adminFeatures];
    updatedFeatures[index] = value;
    
    // Add new empty field if last field is being typed in
    if (index === updatedFeatures.length - 1 && value.trim() !== '') {
      updatedFeatures.push('');
    }
    
    setNewFeature({ ...newFeature, adminFeatures: updatedFeatures });
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setIsEditing(true);
    setNewFeature({
      title: feature.title,
      description: feature.description,
      adminFeatures: [...feature.adminFeatures, '']
    });
    setShowAddFeatureModal(true);
  };

  const handleDeleteFeature = (featureId: number) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      setFeaturesList(featuresList.filter(f => f.id !== featureId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingFeature) {
      // Update existing feature
      setFeaturesList(featuresList.map(f => 
        f.id === editingFeature.id 
          ? {
              ...f,
              title: newFeature.title,
              description: newFeature.description,
              adminFeatures: newFeature.adminFeatures.filter(f => f.trim() !== '')
            }
          : f
      ));
    } else {
      // Add new feature
      const feature: Feature = {
        id: featuresList.length + 1,
        title: newFeature.title,
        description: newFeature.description,
        icon: <FaCog />,
        adminFeatures: newFeature.adminFeatures.filter(f => f.trim() !== '')
      };
      setFeaturesList([...featuresList, feature]);
    }

    // Reset form
    setShowAddFeatureModal(false);
    setNewFeature({ title: '', description: '', adminFeatures: [''] });
    setIsEditing(false);
    setEditingFeature(null);
  };

  // @ts-ignore
  const handleAddFeature = (e: React.FormEvent) => {
    // ... function implementation ...
  };

  return (
    <div className="order-management">
      <div className="header">
        <div className="header-content">
          <h1>Order Management System</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch />
              <input type="text" placeholder="Search orders..." />
            </div>
            <button className="filter-btn">
              <FaFilter />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-header">
          <h2>Administrative Features & Controls</h2>
          <button 
            className="add-feature-btn"
            onClick={() => setShowAddFeatureModal(true)}
          >
            <FaPlus /> Add Feature
          </button>
        </div>
        <div className="features-grid">
          {featuresList.map(feature => (
            <div
              key={feature.id}
              className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
            >
              <div className="feature-actions">
                <button 
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditFeature(feature);
                  }}
                >
                  <FaEdit />
                </button>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFeature(feature.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
              <div 
                className="feature-content"
                onClick={() => setActiveFeature(feature.id === activeFeature ? null : feature.id)}
              >
                <div className="feature-header">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                </div>
                <p className="feature-description">{feature.description}</p>
                
                {activeFeature === feature.id && (
                  <div className="admin-features">
                    <h4>Super Admin Capabilities:</h4>
                    <ul>
                      {feature.adminFeatures.map((adminFeature, index) => (
                        <li key={index}>{adminFeature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <h3>Total Orders Today</h3>
          <p className="stat-value">1,234</p>
        </div>
        <div className="stat-card">
          <h3>Active Branches</h3>
          <p className="stat-value">25</p>
        </div>
        <div className="stat-card">
          <h3>Average Processing Time</h3>
          <p className="stat-value">12.5 min</p>
        </div>
        <div className="stat-card">
          <h3>System Health</h3>
          <p className="stat-value">98%</p>
        </div>
      </div>

      {/* Modal */}
      {showAddFeatureModal && (
        <div className="modal-overlay" onClick={() => setShowAddFeatureModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{isEditing ? 'Edit Feature' : 'Add New Feature'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Feature Title</label>
                <input
                  type="text"
                  value={newFeature.title}
                  onChange={e => setNewFeature({ ...newFeature, title: e.target.value })}
                  required
                  placeholder="Enter feature title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newFeature.description}
                  onChange={e => setNewFeature({ ...newFeature, description: e.target.value })}
                  required
                  placeholder="Enter feature description"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Admin Features</label>
                {newFeature.adminFeatures.map((feature, index) => (
                  <input
                    key={index}
                    type="text"
                    value={feature}
                    onChange={e => handleAdminFeatureChange(index, e.target.value)}
                    placeholder="Enter admin feature"
                    className="admin-feature-input"
                  />
                ))}
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {isEditing ? 'Update Feature' : 'Add Feature'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddFeatureModal(false);
                    setIsEditing(false);
                    setEditingFeature(null);
                    setNewFeature({ title: '', description: '', adminFeatures: [''] });
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

export default OrderManagement; 