/* global chrome */
import React from 'react';
import Sidebar from './Sidebar';

function App() {
  const handleAuthClick = () => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError || !token) {
        console.error("Failed to get auth token:", chrome.runtime.lastError);
        return;
      }
      console.log("User signed in. Access Token:", token);
      chrome.storage.local.set({ token: token }, function() {
        console.log("Token stored.");
      });
    });
  };

  return (
    <div className="App">
      <button onClick={handleAuthClick}>Sign in with Google</button>
      <Sidebar />
    </div>
  );
}

export default App;