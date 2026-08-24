import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastProvider } from '../components/ui/Toast';

export const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </Provider>
  );
};

export default AppProviders;
