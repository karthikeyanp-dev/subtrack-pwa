import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Calendar } from 'lucide-react';
import { Subscription, SubscriptionFormData } from './types/subscription';
import { SubscriptionCard } from './components/SubscriptionCard';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SearchBar } from './components/SearchBar';
import { ConfirmModal } from './components/ConfirmModal';
import { AlertModal } from './components/AlertModal';
import { ThemeToggle } from './components/ThemeToggle';
import { saveSubscriptions, loadSubscriptions, exportSubscriptions, importSubscriptions } from './utils/storage';
import { getDaysUntilExpiration } from './utils/dateUtils';

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadSubscriptions());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  

  useEffect(() => {
    saveSubscriptions(subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'subscription-tracker-data') {
        const latest = loadSubscriptions();
        setSubscriptions(latest);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddSubscription = (formData: SubscriptionFormData) => {
    const newSubscription: Subscription = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setSubscriptions(prev => [...prev, newSubscription]);
    
  };

  const handleEditSubscription = (formData: SubscriptionFormData) => {
    if (editingSubscription) {
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === editingSubscription.id
            ? { ...sub, ...formData }
            : sub
        )
      );
      setEditingSubscription(null);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Subscription',
      message: `Are you sure you want to delete "${subscription?.serviceName}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditClick = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  const handleExport = () => {
    exportSubscriptions(subscriptions);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedSubscriptions = await importSubscriptions(file);
        setConfirmModal({
          isOpen: true,
          title: 'Import Subscriptions',
          message: `This will replace all existing subscriptions with ${importedSubscriptions.length} imported subscriptions. This action cannot be undone.`,
          type: 'warning',
          onConfirm: () => {
            setSubscriptions(importedSubscriptions);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            setAlertModal({
              isOpen: true,
              title: 'Import Successful',
              message: `Successfully imported ${importedSubscriptions.length} subscriptions.`,
              type: 'success'
            });
          }
        });
      } catch (error) {
        setAlertModal({
          isOpen: true,
          title: 'Import Failed',
          message: error instanceof Error ? error.message : 'Unknown error occurred during import.',
          type: 'error'
        });
      }
      // Reset file input
      event.target.value = '';
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSubscriptions = filteredSubscriptions.sort((a, b) => {
    const daysA = getDaysUntilExpiration(a.endDate);
    const daysB = getDaysUntilExpiration(b.endDate);
    return daysA - daysB;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Subscription Tracker</h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-center sm:text-left">Keep track of your subscriptions and never miss a renewal date</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Subscription
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center transition-colors duration-200 dark:bg_gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border dark:border-gray-700"
              disabled={subscriptions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Backup
            </button>
            <label className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text_gray-700 rounded-xl font-medium flex items-center cursor-pointer transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border dark:border-gray-700">
              <Upload className="h-4 w-4 mr-2" />
              Restore
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Subscriptions List */}
        {sortedSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx_auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No matching subscriptions found' : 'No subscriptions added yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Tap the "Add Subscription" button to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Add Your First Subscription
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSubscriptions.map(subscription => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={handleEditClick}
                onDelete={handleDeleteSubscription}
              />
            ))}
          </div>
        )}

        {/* Subscription Form Modal */}
        <SubscriptionForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={editingSubscription ? handleEditSubscription : handleAddSubscription}
          editingSubscription={editingSubscription}
        />

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          confirmText={confirmModal.type === 'danger' ? 'Delete' : 'Continue'}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
}

export default App;
