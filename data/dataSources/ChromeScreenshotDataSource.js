/**
 * Data Source: Chrome Screenshot Data Source
 * Handles Chrome API interactions for screenshots
 */
export class ChromeScreenshotDataSource {
  constructor() {
    this.scrollListener = null;
  }

  async getPageDimensions() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Get maximum dimensions to capture full width and height
        const body = document.body;
        const html = document.documentElement;
        
        const width = Math.max(
          body.scrollWidth, body.offsetWidth,
          html.clientWidth, html.scrollWidth, html.offsetWidth
        );
        
        const height = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        return {
          width: width,
          scrollHeight: height,
          viewportHeight: window.innerHeight,
          viewportWidth: window.innerWidth
        };
      }
    });

    return result.result;
  }

  async captureScreenshot(scrollY) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Scroll to position
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (y) => window.scrollTo(0, y),
      args: [scrollY]
    });

    // Wait for scroll to complete
    await this._delay(100);

    // Capture screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'png'
    });

    return dataUrl;
  }

  async enableCleanContentMode() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Store original state
        window.__originalDisplay = window.__originalDisplay || {};
        window.__stickyElements = window.__stickyElements || [];
        
        // CONSERVATIVE selector list - only remove obvious ads and clutter
        const unwantedSelectors = [
          // Only clear advertisements
          'iframe[src*="doubleclick"]', 
          'iframe[src*="googlesyndication"]',
          'iframe[src*="advertising"]',
          'ins.adsbygoogle',
          '[id^="google_ads"]',
          '[class*="advertisement"]',
          '[id*="advertisement"]',
          
          // Only obvious ad containers (be specific)
          '.ad-container', '.ads-container', '.banner-ad',
          '#ad-banner', '#ads-banner',
          
          // Popups and overlays (these are annoying)
          '[class*="popup"][class*="overlay"]',
          '[class*="modal"][class*="overlay"]',
          '.popup-overlay', '.modal-overlay'
        ];
        
        // Hide unwanted elements
        unwantedSelectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              if (!window.__originalDisplay[selector]) {
                window.__originalDisplay[selector] = [];
              }
              window.__originalDisplay[selector].push({
                element: el,
                display: el.style.display
              });
              el.style.display = 'none';
            });
          } catch (e) {
            // Ignore selector errors
          }
        });
        
        // Handle sticky/fixed elements - store them for later
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') {
            window.__stickyElements.push({
              element: el,
              position: style.position,
              top: style.top,
              zIndex: style.zIndex
            });
          }
        });
      }
    });
  }

  async hideStickyElements() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window.__stickyElements) {
          window.__stickyElements.forEach(item => {
            item.element.style.position = 'absolute';
            item.element.style.top = '-9999px';
          });
        }
      }
    });
  }

  async showStickyElements() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window.__stickyElements) {
          window.__stickyElements.forEach(item => {
            item.element.style.position = item.position;
            item.element.style.top = item.top;
          });
        }
      }
    });
  }

  async disableCleanContentMode() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (!window.__originalDisplay) return;
        
        // Restore all hidden elements
        Object.keys(window.__originalDisplay).forEach(selector => {
          window.__originalDisplay[selector].forEach(item => {
            item.element.style.display = item.display;
          });
        });
        
        // Restore sticky elements
        if (window.__stickyElements) {
          window.__stickyElements.forEach(item => {
            item.element.style.position = item.position;
            item.element.style.top = item.top;
            item.element.style.zIndex = item.zIndex;
          });
          delete window.__stickyElements;
        }
        
        delete window.__originalDisplay;
      }
    });
  }

  async captureCurrentViewport() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'png'
    });

    return dataUrl;
  }

  async stitchImages(screenshots, dimensions) {
    // Create canvas - use viewport width (what's actually visible)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Use viewportWidth instead of full scrollWidth to avoid stretching
    canvas.width = dimensions.viewportWidth;
    canvas.height = Math.min(dimensions.scrollHeight, 32000);

    // Load and draw each screenshot
    for (let i = 0; i < screenshots.length; i++) {
      const img = await this._loadImage(screenshots[i]);
      const yPosition = i * dimensions.viewportHeight;
      
      // Draw at actual size without scaling
      ctx.drawImage(img, 0, yPosition, dimensions.viewportWidth, dimensions.viewportHeight);
    }

    return canvas.toDataURL('image/png');
  }

  async stitchScrollCaptures(captures, dimensions) {
    // Sort captures by scroll position
    const sortedCaptures = captures.sort((a, b) => a.scrollY - b.scrollY);

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const maxHeight = Math.max(...sortedCaptures.map(c => c.scrollY)) + dimensions.viewportHeight;
    canvas.width = dimensions.width;
    canvas.height = Math.min(maxHeight, 32000);

    // Draw each capture at its scroll position
    for (const capture of sortedCaptures) {
      const img = await this._loadImage(capture.data);
      ctx.drawImage(img, 0, capture.scrollY);
    }

    return canvas.toDataURL('image/png');
  }

  async initializeScrollListener(callback, config) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.__scrollCaptureListener = () => {
          chrome.runtime.sendMessage({
            type: 'SCROLL_EVENT',
            scrollY: window.scrollY
          });
        };
        window.addEventListener('scroll', window.__scrollCaptureListener);
      }
    });

    // Listen for scroll events from content script
    this.scrollListener = (message) => {
      if (message.type === 'SCROLL_EVENT') {
        callback(message.scrollY, config);
      }
    };
    
    chrome.runtime.onMessage.addListener(this.scrollListener);
  }

  async removeScrollListener() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window.__scrollCaptureListener) {
          window.removeEventListener('scroll', window.__scrollCaptureListener);
          delete window.__scrollCaptureListener;
        }
      }
    });

    if (this.scrollListener) {
      chrome.runtime.onMessage.removeListener(this.scrollListener);
      this.scrollListener = null;
    }
  }

  _loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
