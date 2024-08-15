import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Function to render the React app
function renderApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.render(<App />, rootElement);
  } else {
    console.error("Root element not found.");
  }
}

// Render the app when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  renderApp();
});