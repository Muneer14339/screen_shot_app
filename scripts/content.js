/**
 * Content Script
 * Injected into web pages for scroll detection and page manipulation
 */

(function() {
  'use strict';

  // Prevent multiple injections
  if (window.__webCaptureProInjected) {
    return;
  }
  window.__webCaptureProInjected = true;

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'GET_PAGE_INFO':
        sendResponse(getPageInfo());
        break;
        
      case 'SCROLL_TO':
        scrollToPosition(message.position);
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
    
    return true;
  });

  function getPageInfo() {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      currentScrollY: window.scrollY,
      currentScrollX: window.scrollX
    };
  }

  function scrollToPosition(position) {
    window.scrollTo({
      top: position,
      left: 0,
      behavior: 'auto'
    });
  }

  console.log('WebCapture Pro content script loaded');
})();
