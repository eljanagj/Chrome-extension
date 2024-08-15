// Create a new div element to serve as the sidebar container
const sidebarContainer = document.createElement('div');
sidebarContainer.id = 'chrome-extension-sidebar';

// Style the sidebar container so it occupies the full height
sidebarContainer.style.position = 'fixed';
sidebarContainer.style.top = '0';
sidebarContainer.style.left = '0';
sidebarContainer.style.width = '250px';
sidebarContainer.style.height = '100vh';
sidebarContainer.style.zIndex = '1000';
sidebarContainer.style.backgroundColor = '#f8f9fa';
sidebarContainer.style.borderRight = '1px solid #ddd';
sidebarContainer.style.overflowY = 'auto';

// Append the sidebar container to the body
document.body.appendChild(sidebarContainer);

// Render the React app inside the sidebar container
const rootElement = document.getElementById('chrome-extension-sidebar');
if (rootElement) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('index.js');
  script.onload = () => {
    renderApp();
  };
  document.body.appendChild(script);
} else {
  console.error("Root element not found.");
}