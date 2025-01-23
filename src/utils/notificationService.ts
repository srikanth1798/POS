export interface Client {
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
    password: string;
    forcePasswordChange: boolean;
    lastPasswordChange?: string;
    lastModifiedBy?: 'admin' | 'client';
    lastModifiedAt?: string;
    authMethods: {
      password: boolean;
      pattern: boolean;
      biometric: boolean;
      faceId: boolean;
      otp: boolean;
      securityKey: boolean;
    };
  };
  billingCycle: string;
  totalAmount: number;
  status?: 'active' | 'inactive' | 'removed';
}

type NotificationMethod = 'email' | 'sms';

export const sendNotification = async (
  recipient: Client | { email: string },
  method: NotificationMethod,
  message?: string
): Promise<boolean> => {
  try {
    // Simulate sending notification
    console.log(`Sending ${method} notification to:`, recipient);
    if (message) {
      console.log('Message:', message);
    }

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}; 