import React from 'react';
import ReactDOM from 'react-dom/client';
import KuzuTestInterface from './KuzuTestInterface';

// Basic styling
const appStyle = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
};

function KuzuTestApp() {
  return (
    <div style={appStyle}>
      <h1>Kuzu Test Application</h1>
      <KuzuTestInterface />
    </div>
  );
}

// Mount the app to a div with id="kuzu-test-root"
const mountApp = () => {
  const rootElement = document.getElementById('kuzu-test-root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <KuzuTestApp />
      </React.StrictMode>
    );
  }
};

// If the element doesn't exist yet, create it
if (!document.getElementById('kuzu-test-root')) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'kuzu-test-root';
  document.body.appendChild(rootDiv);
}

mountApp();

export default KuzuTestApp; 