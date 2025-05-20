import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

// Tipos de toast disponibles
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Estructura de un toast
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Contexto para el sistema de toast
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Props para el proveedor de toast
interface ToastProviderProps {
  children: ReactNode;
}

// Componente de proveedor de toast
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Función para agregar un nuevo toast
  const addToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Agregar el nuevo toast
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    
    // Configurar un temporizador para eliminarlo después de la duración
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  // Función para eliminar un toast
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook para usar el sistema de toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  
  return context;
};

// Funciones de ayuda para mostrar tipos específicos de toasts
export const useToastNotification = () => {
  const { addToast } = useToast();
  
  return {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
  };
};

// Componente contenedor de toasts
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Componente individual de toast
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const { message, type } = toast;
  
  // Estilos y iconos según el tipo de toast
  const styles = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };
  
  const icons = {
    success: <FiCheckCircle className="h-5 w-5" />,
    error: <FiXCircle className="h-5 w-5" />,
    info: <FiInfo className="h-5 w-5" />,
    warning: <FiAlertTriangle className="h-5 w-5" />,
  };

  return (
    <div
      className={`rounded-md border-l-4 px-4 py-3 shadow-md ${styles[type]} flex items-center justify-between min-w-[300px] max-w-md animate-slide-in`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3">{icons[type]}</div>
        <div>{message}</div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
