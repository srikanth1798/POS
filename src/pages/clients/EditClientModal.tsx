import { useState, useEffect } from 'react';
import './ClientManagement.css';
import { 
  Lock, 
  Grid, 
  Fingerprint, 
  Scan, 
  KeyRound,
  ShieldCheck 
} from 'lucide-react';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    name: string;
    email: string;
    phone: string;
    segment: string;
    totalAmount: number;
    billingCycle: "monthly" | "yearly";
    services: Array<{
      name: string;
      price: number;
      selected?: boolean;
      status?: 'ACTIVE' | 'INACTIVE';
    }>;
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
    payment: {
      method: string;
      billingAddress: string;
      gstNumber: string;
    };
    credentials: {
      username: string;
      password: string;
      forcePasswordChange: boolean;
      lastPasswordChange?: string;
      authMethods: {
        password: boolean;
        pattern: boolean;
        biometric: boolean;
        faceId: boolean;
        otp: boolean;
        securityKey: boolean;
      };
    };
    subscription: {
      startDate: string;
    };
  };
  onSave: (updatedClient: any) => void;
}

export const EditClientModal = ({ isOpen, onClose, client, onSave }: EditClientModalProps) => {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    segment: client.segment,
    totalAmount: client.totalAmount,
    billingCycle: client.billingCycle,
    outlet: {
      name: client.outlet.name,
      type: client.outlet.type,
      status: client.outlet.status,
      address: client.outlet.address,
      city: client.outlet.city,
      district: client.outlet.district,
      state: client.outlet.state,
      country: client.outlet.country,
      pincode: client.outlet.pincode
    },
    payment: {
      method: client.payment.method,
      billingAddress: client.payment.billingAddress,
      gstNumber: client.payment.gstNumber
    },
    services: [
      { 
        name: 'Table Management', 
        price: 199.99, 
        selected: client.services.some(s => s.name === 'Table Management'),
        status: client.services.find(s => s.name === 'Table Management')?.status || 'INACTIVE'
      },
      { 
        name: 'Inventory Management', 
        price: 299.99, 
        selected: client.services.some(s => s.name === 'Inventory Management'),
        status: client.services.find(s => s.name === 'Inventory Management')?.status || 'INACTIVE'
      },
      { 
        name: 'Billing Management', 
        price: 249.99, 
        selected: client.services.some(s => s.name === 'Billing Management'),
        status: client.services.find(s => s.name === 'Billing Management')?.status || 'INACTIVE'
      },
      { 
        name: 'Employee Management', 
        price: 149.99, 
        selected: client.services.some(s => s.name === 'Employee Management'),
        status: client.services.find(s => s.name === 'Employee Management')?.status || 'INACTIVE'
      },
      { 
        name: 'Order Management', 
        price: 179.99, 
        selected: client.services.some(s => s.name === 'Order Management'),
        status: client.services.find(s => s.name === 'Order Management')?.status || 'INACTIVE'
      },
      { 
        name: 'Menu Management', 
        price: 129.99, 
        selected: client.services.some(s => s.name === 'Menu Management'),
        status: client.services.find(s => s.name === 'Menu Management')?.status || 'INACTIVE'
      }
    ],
    credentials: {
      username: client.credentials?.username || '',
      password: '',
      forcePasswordChange: client.credentials?.forcePasswordChange || false,
      lastPasswordChange: client.credentials?.lastPasswordChange,
      authMethods: client.credentials?.authMethods || {
        password: true,
        pattern: false,
        biometric: false,
        faceId: false,
        otp: false,
        securityKey: false
      }
    },
    subscription: {
      startDate: client.subscription.startDate.split('T')[0]
    }
  });

  useEffect(() => {
    setFormData({
      ...formData,
      name: client.name,
      email: client.email,
      phone: client.phone,
      segment: client.segment,
      totalAmount: client.totalAmount,
      billingCycle: client.billingCycle,
      outlet: { ...client.outlet },
      payment: { ...client.payment },
      services: formData.services.map(service => ({
        ...service,
        selected: client.services.some(s => s.name === service.name),
        status: client.services.find(s => s.name === service.name)?.status || 'INACTIVE'
      }))
    });
  }, [client]);

  if (!isOpen) return null;

  const calculateEndDate = (startDate: string, billingCycle: "monthly" | "yearly") => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    if (billingCycle === 'yearly') {
      end.setFullYear(end.getFullYear() + 1);
    } else {
      end.setMonth(end.getMonth() + 1);
    }
    
    return end.toISOString();
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation (basic example)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate username
    if (!formData.credentials.username.trim()) {
      alert('Username is required');
      return;
    }

    // Validate new password if one was entered
    if (formData.credentials.password) {
      if (formData.credentials.password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }

      // Password strength validation
      const hasUpperCase = /[A-Z]/.test(formData.credentials.password);
      const hasLowerCase = /[a-z]/.test(formData.credentials.password);
      const hasNumbers = /\d/.test(formData.credentials.password);
      const hasSpecialChar = /[!@#$%^&*]/.test(formData.credentials.password);

      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        alert('Password must contain uppercase, lowercase, numbers, and special characters');
        return;
      }
    }

    // Update lastPasswordChange if password was changed
    const updatedCredentials = {
      ...formData.credentials,
      lastPasswordChange: formData.credentials.password 
        ? new Date().toISOString() 
        : formData.credentials.lastPasswordChange
    };

    const endDate = calculateEndDate(
      formData.subscription.startDate, 
      formData.billingCycle as "monthly" | "yearly"
    );

    // If validation passes, save the changes
    const updatedClient = {
      ...client,
      ...formData,
      status: formData.outlet.status,
      credentials: updatedCredentials,
      services: formData.services
        .filter(service => service.selected)
        .map(service => ({
          name: service.name,
          price: service.price,
          status: 'ACTIVE' as const,
          features: []
        })),
      totalAmount: formData.services
        .filter(service => service.selected)
        .reduce((total, service) => total + service.price, 0),
      subscription: {
        startDate: formData.subscription.startDate,
        endDate: endDate,
        duration: formData.billingCycle === 'yearly' ? '12 months' : '1 month',
        status: 'active' as const
      },
      payment: {
        ...formData.payment,
        lastPayment: {
          date: formData.subscription.startDate,
          amount: formData.totalAmount,
          status: 'paid' as const
        },
        nextBilling: new Date(new Date(formData.subscription.startDate).setMonth(new Date(formData.subscription.startDate).getMonth() + 1)).toISOString()
      }
    };

    onSave(updatedClient);
    onClose();
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content">
        <div className="edit-modal-header">
          <h2>Edit Client</h2>
          <button 
            className="close-edit-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="edit-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Segment</label>
                <select
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                >
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Outlet Details Section */}
          <div className="form-section">
            <h3>Outlet Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Outlet Name</label>
                <input
                  type="text"
                  value={formData.outlet.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, name: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.outlet.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, type: e.target.value as any }
                  })}
                >
                  <option value="retail">Retail</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="franchise">Franchise</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="status-toggle">
                  <button
                    type="button"
                    className={`toggle-button ${formData.outlet.status === 'active' ? 'active' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      outlet: { ...formData.outlet, status: 'active' }
                    })}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={`toggle-button ${formData.outlet.status === 'inactive' ? 'inactive' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      outlet: { ...formData.outlet, status: 'inactive' }
                    })}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.outlet.address}
                onChange={(e) => setFormData({
                  ...formData,
                  outlet: { ...formData.outlet, address: e.target.value }
                })}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.outlet.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, city: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>District</label>
                <input
                  type="text"
                  value={formData.outlet.district}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, district: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={formData.outlet.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, state: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={formData.outlet.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, country: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>PIN Code</label>
                <input
                  type="text"
                  value={formData.outlet.pincode}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, pincode: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="form-section">
            <h3>Payment Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Payment Method</label>
                <input
                  type="text"
                  value={formData.payment.method}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment: { ...formData.payment, method: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  value={formData.payment.gstNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment: { ...formData.payment, gstNumber: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Billing Address</label>
              <input
                type="text"
                value={formData.payment.billingAddress}
                onChange={(e) => setFormData({
                  ...formData,
                  payment: { ...formData.payment, billingAddress: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Services Section */}
          <div className="form-section">
            <h3>Services</h3>
            
            {/* Add billing cycle selector */}
            <div className="billing-cycle-selector">
              <label>Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({
                  ...formData,
                  billingCycle: e.target.value as "monthly" | "yearly"
                })}
                className="billing-cycle-select"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly (Save 20%)</option>
              </select>
            </div>

            <div className="services-grid">
              {formData.services.map((service, index) => (
                <div key={index} className="service-item">
                  <input
                    type="checkbox"
                    checked={service.selected}
                    onChange={() => {
                      const updatedServices = [...formData.services];
                      updatedServices[index].selected = !service.selected;
                      setFormData({ ...formData, services: updatedServices });
                    }}
                  />
                  <div className="service-details">
                    <span className="service-name">{service.name}</span>
                    <span className="service-price">
                      ${formData.billingCycle === 'yearly' 
                        ? (service.price * 12 * 0.8).toFixed(2) + '/year'  // 20% discount for yearly
                        : service.price.toFixed(2) + '/month'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="services-summary">
              <h4>Selected Services Summary</h4>
              {formData.services
                .filter(service => service.selected)
                .map((service, index) => (
                  <div key={index} className="summary-item">
                    <span>{service.name}</span>
                    <span>
                      ${formData.billingCycle === 'yearly'
                        ? (service.price * 12 * 0.8).toFixed(2) + '/year'
                        : service.price.toFixed(2) + '/month'
                      }
                    </span>
                  </div>
                ))}
              <div className="total-cost">
                <span>Total {formData.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Cost:</span>
                <span>
                  ${formData.services
                    .filter(service => service.selected)
                    .reduce((total, service) => {
                      const price = formData.billingCycle === 'yearly'
                        ? service.price * 12 * 0.8  // 20% discount for yearly
                        : service.price;
                      return total + price;
                    }, 0)
                    .toFixed(2)}
                  /{formData.billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>
            </div>
          </div>

          {/* Client Credentials Section */}
          <div className="form-section">
            <h3>Client Credentials</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.credentials.username}
                  placeholder="Enter username"
                  onChange={(e) => setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      username: e.target.value
                    }
                  })}
                />
                <small className="form-hint">Username must be unique</small>
              </div>

              <div className="form-group">
                <label>Reset Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.credentials.password}
                  onChange={(e) => setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      password: e.target.value
                    }
                  })}
                />
                <small className="form-hint">Leave empty to keep current password</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.credentials.forcePasswordChange}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: {
                        ...formData.credentials,
                        forcePasswordChange: e.target.checked
                      }
                    })}
                  />
                  Force password change on next login
                </label>
              </div>

              {formData.credentials.lastPasswordChange && (
                <div className="form-info">
                  Last password change: {new Date(formData.credentials.lastPasswordChange).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="auth-methods-section">
              <h4 className="auth-methods-title">Authentication Methods</h4>
              <div className="auth-methods-grid">
                <div className="auth-method-item">
                  <div className="auth-method-content">
                    <span className="auth-method-icon">
                      <Lock size={20} />
                    </span>
                    <span className="auth-method-label">Password</span>
                    {formData.credentials.authMethods.password && (
                      <span className="required-badge">Required</span>
                    )}
                  </div>
                  <div className="auth-method-toggle">
                    <input
                      type="checkbox"
                      checked={formData.credentials.authMethods.password}
                      disabled={true}
                      onChange={() => {}}
                    />
                  </div>
                </div>

                <div className="auth-method-item">
                  <div className="auth-method-content">
                    <span className="auth-method-icon">
                      <Grid size={20} />
                    </span>
                    <span className="auth-method-label">Pattern Lock</span>
                  </div>
                  <div className="auth-method-toggle">
                    <input
                      type="checkbox"
                      checked={formData.credentials.authMethods.pattern}
                      onChange={(e) => setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          authMethods: {
                            ...formData.credentials.authMethods,
                            pattern: e.target.checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="auth-method-item">
                  <div className="auth-method-content">
                    <span className="auth-method-icon">
                      <Fingerprint size={20} />
                    </span>
                    <span className="auth-method-label">Biometric</span>
                  </div>
                  <div className="auth-method-toggle">
                    <input
                      type="checkbox"
                      checked={formData.credentials.authMethods.biometric}
                      onChange={(e) => setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          authMethods: {
                            ...formData.credentials.authMethods,
                            biometric: e.target.checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="auth-method-item">
                  <div className="auth-method-content">
                    <span className="auth-method-icon">
                      <Scan size={20} />
                    </span>
                    <span className="auth-method-label">Face ID</span>
                  </div>
                  <div className="auth-method-toggle">
                    <input
                      type="checkbox"
                      checked={formData.credentials.authMethods.faceId}
                      onChange={(e) => setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          authMethods: {
                            ...formData.credentials.authMethods,
                            faceId: e.target.checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="auth-method-item">
                  <div className="auth-method-content">
                    <span className="auth-method-icon">
                      <ShieldCheck size={20} />
                    </span>
                    <span className="auth-method-label">OTP</span>
                  </div>
                  <div className="auth-method-toggle">
                    <input
                      type="checkbox"
                      checked={formData.credentials.authMethods.otp}
                      onChange={(e) => setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          authMethods: {
                            ...formData.credentials.authMethods,
                            otp: e.target.checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="auth-method-item">
                  <div className="auth-method-content">
                    <span className="auth-method-icon">
                      <KeyRound size={20} />
                    </span>
                    <span className="auth-method-label">Security Key</span>
                  </div>
                  <div className="auth-method-toggle">
                    <input
                      type="checkbox"
                      checked={formData.credentials.authMethods.securityKey}
                      onChange={(e) => setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials,
                          authMethods: {
                            ...formData.credentials.authMethods,
                            securityKey: e.target.checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details Section */}
          <div className="form-section">
            <h3>Subscription Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.subscription.startDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    subscription: {
                      ...formData.subscription,
                      startDate: e.target.value
                    }
                  })}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={calculateEndDate(formData.subscription.startDate, formData.billingCycle).split('T')[0]}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="edit-modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button 
            className="save-button"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 