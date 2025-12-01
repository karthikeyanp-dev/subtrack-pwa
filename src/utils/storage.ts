import { Subscription } from '../types/subscription';

const STORAGE_KEY = 'subscription-tracker-data';

export const saveSubscriptions = (subscriptions: Subscription[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
};

export const loadSubscriptions = (): Subscription[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading subscriptions:', error);
    return [];
  }
};

export const exportSubscriptions = (subscriptions: Subscription[]): void => {
  const dataStr = JSON.stringify(subscriptions, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `subscription-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importSubscriptions = (file: File): Promise<Subscription[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data) && data.every(isValidSubscription)) {
          resolve(data);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

const isValidSubscription = (obj: any): obj is Subscription => {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.serviceName === 'string' &&
    typeof obj.startDate === 'string' &&
    typeof obj.endDate === 'string' &&
    ['Weekly', 'Monthly', 'Yearly', 'Custom'].includes(obj.subscriptionType) &&
    typeof obj.mobileNumber === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.paymentMethod === 'string' &&
    typeof obj.cardBank === 'string' &&
    typeof obj.autoRenewal === 'boolean'
  );
};
