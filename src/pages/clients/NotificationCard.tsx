import './ClientManagement.css';
import { useEffect, useState } from 'react';
import { sendNotification } from '../../utils/notificationService';

interface NotificationCardProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    services: Array<{
      name: string;
      price: number;
      status: 'ACTIVE' | 'INACTIVE';
      features: string[];
    }>;
    subscription: {
      startDate: string;
      endDate: string;
      status: 'active' | 'expired' | 'pending';
      duration: string;
    };
    payment: {
      method: string;
      billingAddress: string;
      gstNumber: string;
      lastPayment: {
        date: string;
        amount: number;
        status: 'paid' | 'pending' | 'failed';
      };
      nextBilling: string;
    };
    credentials?: {
      username: string;
      lastPasswordChange?: string;
      forcePasswordChange: boolean;
      lastModifiedBy?: 'admin' | 'client';
      lastModifiedAt?: string;
    };
    billingCycle: string;
    totalAmount: number;
  };
  userRole?: 'admin' | 'client';
}

export const NotificationCard = ({ isOpen, onClose, client, userRole }: NotificationCardProps) => {
  console.log('NotificationCard props:', { isOpen, client });  // Debug log

  if (!isOpen) return null;

  const [showPopup, setShowPopup] = useState(false);

  const daysUntilExpiry = () => {
    try {
      const endDate = new Date(client.subscription.endDate);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log('Days until expiry:', days);  // Debug log
      return days;
    } catch (error) {
      console.error('Error calculating expiry:', error);
      return 0;
    }
  };

  useEffect(() => {
    const checkSubscription = () => {
      const remainingDays = daysUntilExpiry();
      
      // Send notifications at different intervals
      if (remainingDays <= 30) {
        // Send first reminder at 30 days
        sendNotification(client, 'email');
      }
      if (remainingDays <= 7) {
        // Send urgent reminder at 7 days
        sendNotification(client, 'sms');
        sendNotification(client, 'email');
      }
      if (remainingDays <= 1) {
        // Send final reminder
        sendNotification(client, 'sms');
      }
    };

    // Check subscription status daily
    const dailyCheck = setInterval(checkSubscription, 24 * 60 * 60 * 1000);

    // Initial check
    checkSubscription();

    return () => clearInterval(dailyCheck);
  }, [client]);

  const remainingDays = daysUntilExpiry();

  console.log('Notification Card Client Data:', client);

  const handleNotify = async () => {
    try {
      // Show popup immediately
      setShowPopup(true);
      
      // Create notification message based on subscription end date
      const endDate = new Date(client.subscription.endDate);
      const today = new Date();
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      const message = `Dear ${client.name},
Your subscription will expire in ${daysRemaining} days on ${endDate.toLocaleDateString()}. 
Billing cycle: ${client.billingCycle}
Total amount: $${client.totalAmount}

Please renew your subscription to ensure uninterrupted service.`;

      // Send notifications
      await sendNotification(client, 'email', message);

      // Auto hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Failed to send notifications');
    }
  };

  // Add function to check credential notifications
  const getCredentialNotifications = () => {
    const notifications = [];
    
    // Check for recent credential changes
    if (client.credentials?.lastModifiedAt) {
      const changeDate = new Date(client.credentials.lastModifiedAt);
      const today = new Date();
      const hoursSinceChange = Math.floor((today.getTime() - changeDate.getTime()) / (1000 * 60 * 60));
      
      if (hoursSinceChange < 24) { // Show notifications for changes in last 24 hours
        if (client.credentials.lastModifiedBy === 'admin') {
          notifications.push({
            type: 'info',
            message: userRole === 'admin' 
              ? `Admin has updated credentials for ${client.name}. Notification sent to client's email.`
              : `Your login credentials have been updated by administrator. Please check your email.`,
            date: client.credentials.lastModifiedAt
          });
        } else if (client.credentials.lastModifiedBy === 'client') {
          notifications.push({
            type: 'warning',
            message: userRole === 'admin'
              ? `${client.name} has modified their login credentials`
              : `You have successfully updated your login credentials`,
            date: client.credentials.lastModifiedAt
          });
        }
      }
    }

    // Check for forced password changes
    if (client.credentials?.forcePasswordChange) {
      notifications.push({
        type: 'warning',
        message: userRole === 'admin' 
          ? `${client.name} will be required to change password on next login`
          : 'You are required to change your password on next login',
        date: new Date().toISOString()
      });
    }

    // Check password age
    if (client.credentials?.lastPasswordChange) {
      const lastChange = new Date(client.credentials.lastPasswordChange);
      const today = new Date();
      const daysSinceChange = Math.floor((today.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceChange > 90) {
        notifications.push({
          type: 'warning',
          message: userRole === 'admin'
            ? `${client.name}'s password is ${daysSinceChange} days old and should be updated`
            : 'Your password should be updated (last changed over 90 days ago)',
          date: new Date().toISOString()
        });
      }
    }

    return notifications;
  };

  // Add this function to handle sending credential notifications
  const sendCredentialNotification = async (type: 'admin' | 'client') => {
    try {
      let recipient = null;

      if (type === 'admin') {
        recipient = client;
      } else {
        recipient = { email: 'admin@example.com' }; // Replace with actual admin email
      }

      // Send the notification
      await sendNotification(recipient, 'email');

      // Update notification status
      const notificationType = type === 'admin' ? 'client' : 'admin';
      alert(`Credential change notification sent to ${notificationType}`);

    } catch (error) {
      console.error('Error sending credential notification:', error);
      alert('Failed to send credential notification');
    }
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-card" onClick={e => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="notification-content">
          {/* Client Name Header */}
          <div className="client-header">
            <h3>{client.name}</h3>
            <span className="client-id">ID: {client.id}</span>
          </div>

          {/* Subscription Status */}
          <div className="notification-section unread">
            <h4>Subscription Information</h4>
            {remainingDays <= 30 && (
              <div className="warning-card">
                <div className="warning-header">
                  <span className="warning-icon">⚠️</span>
                  <span>Subscription Alert</span>
                </div>
                <p>Dear valued client, your subscription will expire in {remainingDays} days. 
                   Please renew to ensure uninterrupted service.</p>
                <button className="renew-button">Renew Now</button>
              </div>
            )}
            <div className="subscription-info">
              <div className="info-row">
                <span>Start Date:</span>
                <span>{client.subscription.startDate}</span>
              </div>
              <div className="info-row">
                <span>End Date:</span>
                <span>{client.subscription.endDate}</span>
              </div>
            </div>
            <div className="timestamp">2 hours ago</div>
          </div>

          {/* Active Services */}
          <div className="notification-section">
            <h4>Active Services</h4>
            <div className="services-list">
              {client.services
                .filter(service => service.status === 'ACTIVE')
                .map((service, index) => (
                  <div key={index} className="service-item">
                    <span>{service.name}</span>
                    <span>${service.price}/month</span>
                  </div>
                ))}
            </div>
            <div className="timestamp">1 day ago</div>
          </div>

          {/* Last Payment */}
          <div className="notification-section">
            <h4>Last Payment</h4>
            <div className="payment-info">
              <div>Amount: ${client.payment.lastPayment.amount}</div>
              <div>Date: {client.payment.lastPayment.date}</div>
              <div>Status: {client.payment.lastPayment.status}</div>
            </div>
          </div>

          {/* New Offers */}
          <div className="notification-section unread">
            <h4>New Offers</h4>
            <div className="offers-list">
              <div className="offer-item">
                <span className="offer-badge">New</span>
                <div className="offer-title">Bundle Discount</div>
                <p>Get 20% off on bundling Table & Order Management</p>
                <div className="timestamp">Just now</div>
              </div>
              <div className="offer-item">
                <span className="offer-badge">Limited Time</span>
                <div className="offer-title">Early Renewal Offer</div>
                <p>Renew now and get 2 months free on annual subscription</p>
              </div>
            </div>
          </div>

          <div className="notification-section">
            <h4>Contact Information</h4>
            <div className="contact-info">
              <div className="info-row">
                <span>Email:</span>
                <span>{client.email}</span>
              </div>
              <div className="info-row">
                <span>Phone:</span>
                <span>{client.phone}</span>
              </div>
              <div className="notify-actions">
                <button 
                  className="notify-button"
                  onClick={handleNotify}
                >
                  Send Notification
                </button>
                <div className="notification-preview">
                  <p>Message Preview:</p>
                  <div className="preview-content">
                    Dear {client.name},
                    Your subscription will expire in {Math.ceil((new Date(client.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days 
                    on {new Date(client.subscription.endDate).toLocaleDateString()}. 
                    Billing cycle: {client.billingCycle}
                    Total amount: ${client.totalAmount}

                    Please renew your subscription to ensure uninterrupted service.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credential Notifications */}
          <div className="notification-section">
            <div className="section-header">
              <h4>Credential Notifications</h4>
              {client.credentials?.lastModifiedAt && (
                <button 
                  className="resend-notification-btn"
                  onClick={() => sendCredentialNotification(
                    client.credentials?.lastModifiedBy === 'admin' ? 'admin' : 'client'
                  )}
                >
                  {userRole === 'admin' ? 'Resend to Client' : 'Notify Admin'}
                </button>
              )}
            </div>
            
            {getCredentialNotifications().map((notification, index) => (
              <div key={`cred-${index}`} className={`notification-item ${notification.type}`}>
                <div className="notification-content">
                  <div className="notification-header">
                    <span className="notification-badge">
                      {notification.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <span className="notification-time">
                      {new Date(notification.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showPopup && (
          <div className="notification-popup">
            <div className="popup-content">
              <span className="popup-icon">✓</span>
              <p>Notification sent successfully to {client.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 