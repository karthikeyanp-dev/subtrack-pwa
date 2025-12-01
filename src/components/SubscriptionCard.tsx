import React from 'react';
import { Calendar, Mail, Phone, CreditCard, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Subscription } from '../types/subscription';
import { formatDate, getDaysUntilExpiration, isExpiringSoon, isExpired } from '../utils/dateUtils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete
}) => {
  const daysUntilExpiration = getDaysUntilExpiration(subscription.endDate);
  const expiringSoon = isExpiringSoon(subscription.endDate);
  const expired = isExpired(subscription.endDate);

  const getStatusColor = () => {
    if (expired) return 'bg-red-100 text-red-800 border-red-200';
    if (expiringSoon) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = () => {
    if (expired) return `Expired ${Math.abs(daysUntilExpiration)} days ago`;
    if (expiringSoon) return `Expires in ${daysUntilExpiration} days`;
    return `${daysUntilExpiration} days remaining`;
  };

  const getStatusIcon = () => {
    if (expired) return <AlertCircle className="h-4 w-4" />;
    if (expiringSoon) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getTypeColor = () => {
    switch (subscription.subscriptionType) {
      case 'Weekly':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'Monthly':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Yearly':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {subscription.serviceName}
            </h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={`inline-flex px-2.5 py-1 rounded-md font-medium ${getTypeColor()}`}>{subscription.subscriptionType}</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-medium ${subscription.autoRenewal ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
              {subscription.autoRenewal ? 'Auto-renewal: Yes' : 'Auto-renewal: No'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(subscription)}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(subscription.id)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Calendar className="h-4 w-4 mt-0.5 text-gray-400" />
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Start</div>
            <div className="font-medium">{formatDate(subscription.startDate)}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Calendar className="h-4 w-4 mt-0.5 text-gray-400" />
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">End</div>
            <div className="font-medium">{formatDate(subscription.endDate)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{subscription.mobileNumber}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <span className="truncate">{subscription.email}</span>
        </div>
        <div className="flex items-center text-sm text_gray-700 dark:text-gray-300">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          <span>{subscription.paymentMethod}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          <span>{subscription.cardBank}</span>
        </div>
      </div>
    </div>
  );
};
