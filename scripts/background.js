/**
 * Background Service Worker
 * Handles background tasks and message routing
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('WebCapture Pro installed successfully');
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SCROLL_EVENT':
      // Forward scroll events from content script to popup
      chrome.runtime.sendMessage(message);
      break;
      
    case 'CAPTURE_STATUS':
      // Log capture status for debugging
      console.log('Capture status:', message.status);
      break;
      
    default:
      console.log('Unknown message type:', message.type);
  }
  
  return true;
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});
