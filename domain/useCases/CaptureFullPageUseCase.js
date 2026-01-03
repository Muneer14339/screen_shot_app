// domain/useCases/CaptureFullPageUseCase.js
export class CaptureFullPageUseCase {
  constructor(screenshotRepository) {
    this.screenshotRepository = screenshotRepository;
    this.minCaptureInterval = 600;
  }

  async execute(config, onProgress) {
    try {
      if (!config || !config.isFullPageMode()) {
        throw new Error('Invalid configuration for full page capture');
      }

      if (config.cleanContentMode) {
        onProgress?.({ status: 'Preparing clean content...', progress: 0 });
        await this.screenshotRepository.enableCleanContentMode();
        await this._delay(500);
      }

      onProgress?.({ status: 'Analyzing page...', progress: 5 });
      const dimensions = await this.screenshotRepository.getPageDimensions();
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const [scrollResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.scrollY
      });
      const currentScrollY = scrollResult.result;

      const viewportHeight = dimensions.viewportHeight;
      const totalHeight = dimensions.scrollHeight;
      
      let startY, endY;
      if (config.startFromCurrentPosition) {
        startY = currentScrollY;
        endY = totalHeight;
      } else {
        startY = 0;
        endY = totalHeight;
      }
      
      const captureHeight = endY - startY;
      const screenshotsNeeded = Math.ceil(captureHeight / viewportHeight);

      const screenshots = [];
      let lastCaptureTime = 0;
      
      for (let i = 0; i < screenshotsNeeded; i++) {
        const now = Date.now();
        const timeSinceLastCapture = now - lastCaptureTime;
        
        if (timeSinceLastCapture < this.minCaptureInterval) {
          await this._delay(this.minCaptureInterval - timeSinceLastCapture);
        }

        const scrollY = startY + (i * viewportHeight);
        const progress = 5 + Math.round(((i + 1) / screenshotsNeeded) * 85);
        
        onProgress?.({ 
          status: `Capturing section ${i + 1}/${screenshotsNeeded}...`, 
          progress 
        });

        if (i === 1 && config.cleanContentMode) {
          await this.screenshotRepository.hideStickyElements();
        }

        lastCaptureTime = Date.now();
        const screenshot = await this.screenshotRepository.captureViewport(scrollY);
        screenshots.push(screenshot);

        await this._delay(Math.max(config.scrollDelay, this.minCaptureInterval));
      }

      onProgress?.({ status: 'Stitching images...', progress: 95 });

      const stitchedImage = await this.screenshotRepository.stitchScreenshots(
        screenshots,
        dimensions
      );

      if (config.cleanContentMode) {
        await this.screenshotRepository.showStickyElements();
        await this.screenshotRepository.disableCleanContentMode();
      }

      onProgress?.({ status: 'Complete!', progress: 100 });

      return {
        success: true,
        data: stitchedImage,
        dimensions: {
          width: dimensions.viewportWidth,
          height: captureHeight
        }
      };
    } catch (error) {
      try {
        if (config.cleanContentMode) {
          await this.screenshotRepository.showStickyElements();
          await this.screenshotRepository.disableCleanContentMode();
        }
      } catch (e) {}
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}