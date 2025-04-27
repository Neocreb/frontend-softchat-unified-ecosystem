
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Create root element
const root = createRoot(document.getElementById("root")!);

// Render app with providers
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
