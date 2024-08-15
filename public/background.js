const CLIENT_ID = "835129316618-rvp0v2v40ht873hqhoko6k5kdt6p7sb7.apps.googleusercontent.com"; // Replace with your actual client ID
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

chrome.runtime.onInstalled.addListener(() => {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError || !token) {
      console.error("Failed to get auth token:", chrome.runtime.lastError);
      return;
    }
    console.log("Auth Token:", token);
    // Store the token for later use
    chrome.storage.local.set({ token: token }, function() {
      console.log("Token stored.");
    });
  });
});

chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  if (!signedIn) {
    chrome.storage.local.remove('token', function() {
      console.log("Token removed.");
    });
  }
});

