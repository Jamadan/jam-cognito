import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import './popup.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Popup />);
} 