export interface Subscription {
  id: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  subscriptionType: 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';
  mobileNumber: string;
  email: string;
  paymentMethod: string;
  cardBank: string;
  autoRenewal: boolean;
  createdAt: string;
}

export type SubscriptionFormData = Omit<Subscription, 'id' | 'createdAt'>;
