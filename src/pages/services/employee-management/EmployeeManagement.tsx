import { useState } from 'react';
import {
  FaUsersCog,
  FaChartLine,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaBell,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import './EmployeeManagement.css';

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
    title: 'Staff Management',
    description: 'Comprehensive employee data and profile management',
    icon: <FaUsersCog />,
    adminFeatures: ['Employee profiles', 'Role management', 'Access control']
  },
  {
    id: 2,
    title: 'Performance Tracking',
    description: 'Monitor and analyze employee performance metrics',
    icon: <FaChartLine />,
    adminFeatures: ['KPI tracking', 'Performance reviews', 'Goal setting']
  },
  {
    id: 3,
    title: 'Scheduling',
    description: 'Advanced shift planning and schedule management',
    icon: <FaCalendarAlt />,
    adminFeatures: ['Shift planning', 'Leave management', 'Availability tracking']
  },
  {
    id: 4,
    title: 'Time & Attendance',
    description: 'Track employee attendance and working hours',
    icon: <FaClock />,
    adminFeatures: ['Time tracking', 'Overtime monitoring', 'Attendance reports']
  },
  {
    id: 5,
    title: 'Task Management',
    description: 'Assign and track employee tasks and responsibilities',
    icon: <FaClipboardList />,
    adminFeatures: ['Task assignment', 'Progress tracking', 'Workload management']
  },
  {
    id: 6,
    title: 'Notifications',
    description: 'Alert system for important employee-related updates',
    icon: <FaBell />,
    adminFeatures: ['Schedule alerts', 'Task reminders', 'Important announcements']
  }
];

const EmployeeManagement = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [featuresList, setFeaturesList] = useState<Feature[]>(features);
  const [showAddFeatureModal, setShowAddFeatureModal] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    adminFeatures: ['']
  });

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    const feature: Feature = {
      id: featuresList.length + 1,
      title: newFeature.title,
      description: newFeature.description,
      icon: <FaUsersCog />,
      adminFeatures: newFeature.adminFeatures.filter(f => f.trim() !== '')
    };

    setFeaturesList([...featuresList, feature]);
    setShowAddFeatureModal(false);
    setNewFeature({ title: '', description: '', adminFeatures: [''] });
  };

  return (
    <div className="employee-management">
      <div className="header">
        <div className="header-content">
          <h1>Employee Management System</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch />
              <input type="text" placeholder="Search employees..." />
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
          <h2>Employee Management Features</h2>
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
                <button className="edit-btn">
                  <FaEdit />
                </button>
                <button className="delete-btn">
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
                    <h4>Features:</h4>
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
          <h3>Total Employees</h3>
          <p className="stat-value">156</p>
        </div>
        <div className="stat-card">
          <h3>Active Shifts</h3>
          <p className="stat-value">24</p>
        </div>
        <div className="stat-card">
          <h3>Attendance Rate</h3>
          <p className="stat-value">95%</p>
        </div>
        <div className="stat-card">
          <h3>Open Positions</h3>
          <p className="stat-value">8</p>
        </div>
      </div>

      {showAddFeatureModal && (
        <div className="modal-overlay" onClick={() => setShowAddFeatureModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add New Feature</h2>
            <form onSubmit={handleAddFeature}>
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
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Add Feature</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddFeatureModal(false)}
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

export default EmployeeManagement; 