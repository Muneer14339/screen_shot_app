/**
 * Use Case: Capture Full Page
 * Business logic for full page screenshot capture
 */
export class CaptureFullPageUseCase {
  constructor(screenshotRepository) {
    this.screenshotRepository = screenshotRepository;
  }

  async execute(config, onProgress) {
    try {
      // Validate config
      if (!config || !config.isFullPageMode()) {
        throw new Error('Invalid configuration for full page capture');
      }

      // Step 1: Enable clean content mode if requested
      if (config.cleanContentMode) {
        onProgress?.({ status: 'Preparing clean content...', progress: 0 });
        await this.screenshotRepository.enableCleanContentMode();
        await this._delay(500); // Wait for DOM changes
      }

      // Step 2: Get page dimensions and current scroll position
      onProgress?.({ status: 'Analyzing page...', progress: 5 });
      const dimensions = await this.screenshotRepository.getPageDimensions();
      
      // Get current scroll position
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const [scrollResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.scrollY
      });
      const currentScrollY = scrollResult.result;

      // Step 3: Calculate capture range
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

      // Step 4: Capture screenshots in chunks
      const screenshots = [];
      for (let i = 0; i < screenshotsNeeded; i++) {
        const scrollY = startY + (i * viewportHeight);
        const progress = 5 + Math.round(((i + 1) / screenshotsNeeded) * 85);
        
        onProgress?.({ 
          status: `Capturing section ${i + 1}/${screenshotsNeeded}...`, 
          progress 
        });

        // Hide sticky elements after first screenshot
        if (i === 1 && config.cleanContentMode) {
          await this.screenshotRepository.hideStickyElements();
        }

        const screenshot = await this.screenshotRepository.captureViewport(scrollY);
        screenshots.push(screenshot);

        // Small delay to prevent overwhelming the browser
        await this._delay(config.scrollDelay);
      }

      onProgress?.({ status: 'Stitching images...', progress: 95 });

      // Step 5: Stitch screenshots
      const stitchedImage = await this.screenshotRepository.stitchScreenshots(
        screenshots,
        dimensions
      );

      // Step 6: Restore original content if clean mode was enabled
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
      // Try to restore content on error
      try {
        if (config.cleanContentMode) {
          await this.screenshotRepository.showStickyElements();
          await this.screenshotRepository.disableCleanContentMode();
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      
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
