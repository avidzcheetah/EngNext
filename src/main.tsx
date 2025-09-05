import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from "react";
import App from './App.tsx';
import './index.css';
import { CompanyProvider } from './contexts/CompanyContext';

createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
    <CompanyProvider>
      <App />
    </CompanyProvider>
  </React.StrictMode>
);
