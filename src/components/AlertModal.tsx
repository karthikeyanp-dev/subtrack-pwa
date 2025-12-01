import React from 'react';
import { AlertCircle, CheckCircle, X, XCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          iconBg: 'bg-green-100',
          titleColor: 'text-green-900'
        };
      case 'error':
        return {
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          iconBg: 'bg-red-100',
          titleColor: 'text-red-900'
        };
      case 'info':
        return {
          icon: <AlertCircle className="h-6 w-6 text-blue-600" />,
          iconBg: 'bg-blue-100',
          titleColor: 'text-blue-900'
        };
      default:
        return {
          icon: <AlertCircle className="h-6 w-6 text-blue-600" />,
          iconBg: 'bg-blue-100',
          titleColor: 'text-blue-900'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w_full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              {styles.icon}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 ${styles.titleColor} dark:text-gray-100`}>
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
