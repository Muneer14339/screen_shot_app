// domain/useCases/CaptureScrollModeUseCase.js
export class CaptureScrollModeUseCase {
  constructor(screenshotRepository) {
    this.screenshotRepository = screenshotRepository;
    this.isCapturing = false;
    this.startScrollY = 0;
    this.config = null;
  }

  async startCapture(config, onProgress) {
    try {
      if (this.isCapturing) {
        throw new Error('Capture already in progress');
      }

      this.isCapturing = true;
      this.config = config;

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const [scrollResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.scrollY
      });
      this.startScrollY = scrollResult.result;

      onProgress?.({ status: 'Scroll to desired end position, then click Stop', progress: 0 });

      return { success: true };
    } catch (error) {
      this.isCapturing = false;
      return { success: false, error: error.message };
    }
  }

  // domain/useCases/CaptureScrollModeUseCase.js
async stopCapture(onProgress, config) {
  try {
    if (!this.isCapturing) {
      throw new Error('No capture in progress');
    }

    this.isCapturing = false;

    if (config && config.cleanContentMode) {
      onProgress?.({ status: 'Preparing clean content...', progress: 0 });
      await this.screenshotRepository.enableCleanContentMode();
      await this._delay(500);
    }

    onProgress?.({ status: 'Analyzing range...', progress: 5 });
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [scrollResult] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.scrollY
    });
    const endScrollY = scrollResult.result;

    const dimensions = await this.screenshotRepository.getPageDimensions();
    const viewportHeight = dimensions.viewportHeight;
    
    const startY = Math.min(this.startScrollY, endScrollY);
    const endY = Math.max(this.startScrollY, endScrollY) + viewportHeight;
    const captureHeight = endY - startY;
    const screenshotsNeeded = Math.ceil(captureHeight / viewportHeight);

    const screenshots = [];
    const minCaptureInterval = 600;
    let lastCaptureTime = 0;
    
    for (let i = 0; i < screenshotsNeeded; i++) {
      const now = Date.now();
      const timeSinceLastCapture = now - lastCaptureTime;
      
      if (timeSinceLastCapture < minCaptureInterval) {
        await this._delay(minCaptureInterval - timeSinceLastCapture);
      }

      const scrollY = startY + (i * viewportHeight);
      const progress = 5 + Math.round(((i + 1) / screenshotsNeeded) * 85);
      
      onProgress?.({ 
        status: `Capturing section ${i + 1}/${screenshotsNeeded}...`, 
        progress 
      });

      if (i === 1 && config && config.cleanContentMode) {
        await this.screenshotRepository.hideStickyElements();
      }

      lastCaptureTime = Date.now();
      const screenshot = await this.screenshotRepository.captureViewport(scrollY);
      screenshots.push(screenshot);

      await this._delay(Math.max(600, minCaptureInterval));
    }

    onProgress?.({ status: 'Stitching images...', progress: 95 });

    const scrollDimensions = {
      viewportWidth: dimensions.viewportWidth,
      viewportHeight: dimensions.viewportHeight,
      scrollHeight: screenshotsNeeded * viewportHeight
    };

    const stitchedImage = await this.screenshotRepository.stitchScreenshots(
      screenshots,
      scrollDimensions
    );

    if (config && config.cleanContentMode) {
      await this.screenshotRepository.showStickyElements();
      await this.screenshotRepository.disableCleanContentMode();
    }

    onProgress?.({ status: 'Complete!', progress: 100 });

    return {
      success: true,
      data: stitchedImage,
      dimensions: {
        width: dimensions.viewportWidth,
        height: screenshotsNeeded * viewportHeight
      }
    };
  } catch (error) {
    this.isCapturing = false;
    
    try {
      if (config && config.cleanContentMode) {
        await this.screenshotRepository.showStickyElements();
        await this.screenshotRepository.disableCleanContentMode();
      }
    } catch (e) {}
    
    return { success: false, error: error.message };
  }
}

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isCaptureActive() {
    return this.isCapturing;
  }
}