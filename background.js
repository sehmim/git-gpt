// background.js

// Perform tasks when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension installed or updated!');
  });
  
  // Listen for messages from the popup or content script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'greet') {
      console.log('Hello from the popup!');
      sendResponse({ response: 'Greetings from the background script!' });
    }
  });
  
  // Perform background tasks or event handling for your extension
  // ...
  