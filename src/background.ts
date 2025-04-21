// Log that the background script is loaded
console.log('jam-cognito background script loaded');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message: { action: string; url?: string }, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.action === 'openIncognito' && message.url) {
    console.log('Opening in incognito:', message.url);
    
    // Open the URL in an incognito tab
    chrome.windows.getAll({ populate: true }, (windows) => {
      // Look for an existing incognito window
      const incognitoWindow = windows.find(window => window.incognito);
      
      if (incognitoWindow) {
        // If an incognito window exists, create a new tab in it
        console.log('Using existing incognito window');
        chrome.tabs.create({
          url: message.url,
          windowId: incognitoWindow.id,
          active: true
        });
      } else {
        // If no incognito window exists, create a new one
        console.log('Creating new incognito window');
        chrome.windows.create({
          url: message.url,
          incognito: true
        });
      }
    });
  }
}); 