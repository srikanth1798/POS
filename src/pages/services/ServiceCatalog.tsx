import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../../types/services';
import { FaPlus } from 'react-icons/fa';
import './services.css';

const initialServices: ServiceCard[] = [
  {
    id: 1,
    title: 'Order Management',
    description: 'Streamline your order processing and tracking with our comprehensive order management system',
    image: 'https://dynamics.folio3.com/blog/wp-content/uploads/2021/04/order-management-software.jpg'
  },
  {
    id: 2,
    title: 'Employee Management',
    description: 'Efficiently manage your staff schedules, performance, and attendance',
    image: 'https://leapmax.ai/wp-content/uploads/2024/10/employee-management-system.webp'
  },
  {
    id: 3,
    title: 'Table Management',
    description: 'Optimize your seating arrangements and reservations with smart table management',
    image: 'https://modisoft.com/wp-content/uploads/2023/11/Frame-151804-5-2.png'
  },
  {
    id: 4,
    title: 'Inventory Management',
    description: 'Keep track of your stock levels and automate your inventory processes',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG1O3oONERzol7-Wn_Fb66eQZ4KFUNorO__u4GosO8U1r-u6mko9t_2k3Szbugy_MVYJI&usqp=CAU'
  },
  {
    id: 5,
    title: 'Billing Management',
    description: 'Handle payments and generate invoices with our advanced billing system',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJ9cXIv2y5NTpiSMw2KsAAjHmO8FKGlvLNA&s'
  }
];

const ServiceCatalog = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    image: ''
  });

  const handleServiceClick = (serviceId: number) => {
    if (serviceId === 3) {
      navigate('/services/table-management');
    } else if (serviceId === 1) {
      navigate('/services/order-management');
    } else if (serviceId === 2) {
      navigate('/services/employee-management');
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const service: ServiceCard = {
      id: services.length + 1,
      ...newService
    };
    setServices([...services, service]);
    setShowModal(false);
    setNewService({ title: '', description: '', image: '' });
  };

  return (
    <div className="page-container">
      <div className="service-header">
        <h1>Service Management</h1>
        <button 
          className="add-service-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Service
        </button>
      </div>

      <div className="service-cards-grid">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="service-card"
            onClick={() => handleServiceClick(service.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-image">
              <img src={service.image} alt={service.title} />
            </div>
            <h2>{service.title}</h2>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add New Service</h2>
            <form onSubmit={handleAddService}>
              <div className="form-group">
                <label>Service Title</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={e => setNewService({ ...newService, title: e.target.value })}
                  required
                  placeholder="Enter service title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newService.description}
                  onChange={e => setNewService({ ...newService, description: e.target.value })}
                  required
                  placeholder="Enter service description"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newService.image}
                  onChange={e => setNewService({ ...newService, image: e.target.value })}
                  required
                  placeholder="Enter image URL"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Add Service</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setNewService({ title: '', description: '', image: '' });
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

export default ServiceCatalog; 