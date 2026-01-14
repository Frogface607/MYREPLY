// MyReply Chrome Extension - Background Service Worker

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_POPUP_WITH_REVIEW') {
    // Store review text for popup
    chrome.storage.local.set({ pendingReview: message.reviewText });
    
    // Open popup
    chrome.action.openPopup();
    
    sendResponse({ success: true });
  }
  
  if (message.type === 'GET_AUTH_TOKEN') {
    chrome.storage.local.get(['authToken'], (result) => {
      sendResponse({ token: result.authToken || null });
    });
    return true; // Keep channel open for async response
  }
  
  return false;
});

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First install - show welcome
    chrome.tabs.create({
      url: 'https://myreply.vercel.app/auth?source=extension',
    });
  }
});

// Listen for auth from website
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_AUTH_TOKEN' && sender.origin === 'https://myreply.vercel.app') {
    chrome.storage.local.set({ authToken: message.token });
    sendResponse({ success: true });
  }
});
