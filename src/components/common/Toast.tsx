import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactDOM from 'react-dom';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px 24px;
  background: ${props => props.type === 'success' ? 'rgba(0, 200, 100, 0.9)' : 'rgba(255, 50, 50, 0.9)'};
  color: white;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

let toastContainer: HTMLDivElement | null = null;

const createContainer = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  toastContainer = container;
  return container;
};

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return ReactDOM.createPortal(
    <Message type={type}>{message}</Message>,
    toastContainer || createContainer()
  );
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = React.useState<Array<{ id: number; message: string; type: 'success' | 'error' }>>([]);

  return (
    <Container>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}
    </Container>
  );
};

export const toast = {
  success: (message: string) => {
    const container = document.querySelector('.toast-container');
    if (container) {
      const event = new CustomEvent('toast', { detail: { message, type: 'success' } });
      container.dispatchEvent(event);
    }
  },
  error: (message: string) => {
    const container = document.querySelector('.toast-container');
    if (container) {
      const event = new CustomEvent('toast', { detail: { message, type: 'error' } });
      container.dispatchEvent(event);
    }
  },
};

export default ToastContainer; 