import { createRoot } from 'react-dom/client'
import './index.css'
import './app.css'
import { BrowserRouter } from 'react-router';

import App from './App.jsx';

const navigation = performance.getEntriesByType('navigation')[0];
if (navigation?.type === 'reload' && window.location.pathname !== '/') {
  window.history.replaceState(null, '', '/');
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
