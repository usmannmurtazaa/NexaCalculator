import React from 'react';
import ReactDOM from 'react-dom/client';
import './firebase/firebase'; // Initialize Firebase before App renders
import App from './App';
import './styles/global.css';

// Enable concurrent features and performance monitoring in production
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html contains <div id="root"></div>');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);