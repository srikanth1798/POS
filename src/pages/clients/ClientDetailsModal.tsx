import { FaUser, FaCreditCard, FaBox, FaStore, FaClock } from 'react-icons/fa';
import './ClientManagement.css';
import { useEffect, useState } from 'react';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    segment: string;
    joinDate: string;
    totalAmount: number;
    billingCycle: 'monthly' | 'yearly';
    outlet: {
      name: string;
      type: 'retail' | 'restaurant' | 'warehouse' | 'franchise';
      status: 'active' | 'inactive';
      address: string;
      city: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    };
    subscription: {
      startDate: string;
      endDate: string;
      duration: string;
      status: 'active' | 'expired' | 'pending';
    };
    services: Array<{
      name: string;
      price: number;
      status: 'ACTIVE' | 'INACTIVE';
      features: string[];
    }>;
    payment: {
      method: string;
      gstNumber: string;
      lastPayment: {
        amount: number;
        status: string;
      };
      nextBilling: string;
    };
  };
}

export const ClientDetailsModal = ({ isOpen, onClose, client }: ClientDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActiveTab(activeTab);
  }, [client]);

  if (!isOpen) return null;

  return (
    <div className="details-modal-overlay">
      <div className="details-modal-content">
        <div className="details-modal-header">
          <div>
            <h2>{client.name}</h2>
            <div className="client-meta">
              <span>Client since {client.joinDate}</span>
              <span className="status-badge active">ACTIVE</span>
            </div>
          </div>
          <button 
            className="close-details-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="details-modal-body">
          <div className="details-sections">
            <div className="details-section">
              <h3>
                <span className="section-icon"><FaUser /></span>
                Client Details
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Name</label>
                  <div>{client.name}</div>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <div>{client.email}</div>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <div>{client.phone}</div>
                </div>
                <div className="detail-item">
                  <label>Segment</label>
                  <div className={`segment-pill ${client.segment.toLowerCase()}`}>
                    {client.segment}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Billing Cycle</label>
                  <div>{client.billingCycle}</div>
                </div>
                <div className="detail-item">
                  <label>Total Amount</label>
                  <div>${client.totalAmount}/{client.billingCycle}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>
                <span className="section-icon"><FaStore /></span>
                Outlet Details
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Outlet Name</label>
                  <div>{client.outlet.name}</div>
                </div>
                <div className="detail-item">
                  <label>Outlet Type</label>
                  <div className="outlet-type-badge">
                    {client.outlet.type.charAt(0).toUpperCase() + client.outlet.type.slice(1)}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Address</label>
                  <div>{client.outlet.address}</div>
                </div>
                <div className="detail-item">
                  <label>Country</label>
                  <div>{client.outlet.country}</div>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <div>{client.outlet.state}</div>
                </div>
                <div className="detail-item">
                  <label>District</label>
                  <div>{client.outlet.district}</div>
                </div>
                <div className="detail-item">
                  <label>City</label>
                  <div>{client.outlet.city}</div>
                </div>
                <div className="detail-item">
                  <label>PIN Code</label>
                  <div>{client.outlet.pincode}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>
                <span className="section-icon"><FaClock /></span>
                Subscription Details
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Status</label>
                  <div className={`status-badge ${client.subscription.status}`}>
                    {client.subscription.status.toUpperCase()}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Start Date</label>
                  <div>{new Date(client.subscription.startDate).toLocaleDateString()}</div>
                </div>
                <div className="detail-item">
                  <label>End Date</label>
                  <div>{new Date(client.subscription.endDate).toLocaleDateString()}</div>
                </div>
                <div className="detail-item">
                  <label>Duration</label>
                  <div>{client.subscription.duration}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>
                <span className="section-icon"><FaCreditCard /></span>
                Payment Details
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Payment Method</label>
                  <div>{client.payment.method}</div>
                </div>
                <div className="detail-item">
                  <label>GST Number</label>
                  <div>{client.payment.gstNumber}</div>
                </div>
                <div className="detail-item">
                  <label>Last Payment</label>
                  <div className="payment-info">
                    <span>${client.payment.lastPayment.amount}</span>
                    <span className={`status-badge ${client.payment.lastPayment.status}`}>
                      {client.payment.lastPayment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Next Billing</label>
                  <div>{new Date(client.payment.nextBilling).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>
                <span className="section-icon"><FaBox /></span>
                Services
              </h3>
              <div className="services-grid">
                {client.services.map((service, index) => (
                  <div key={index} className="service-card">
                    <div className="service-header">
                      <div className="service-name">{service.name}</div>
                      <div className="service-price">${service.price}/{client.billingCycle}</div>
                    </div>
                    <div className="service-status">
                      <span className={`status-badge ${service.status.toLowerCase()}`}>
                        {service.status}
                      </span>
                    </div>
                    {service.features && (
                      <div className="service-features">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="feature-item">• {feature}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="details-modal-footer">
          <button className="close-details-button" onClick={onClose}>
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}; 