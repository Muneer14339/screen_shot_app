/**
 * Use Case: Capture Scroll Mode
 * Business logic for manual scroll & capture mode
 */
export class CaptureScrollModeUseCase {
  constructor(screenshotRepository) {
    this.screenshotRepository = screenshotRepository;
    this.isCapturing = false;
    this.capturedSections = [];
    this.lastScrollPosition = 0;
    this.captureCount = 0;
    this.config = null;
  }

  async startCapture(config, onProgress) {
    try {
      if (this.isCapturing) {
        throw new Error('Capture already in progress');
      }

      this.isCapturing = true;
      this.capturedSections = [];
      this.lastScrollPosition = 0;
      this.captureCount = 0;
      this.config = config;

      // Enable clean content mode if requested
      if (config.cleanContentMode) {
        onProgress?.({ status: 'Preparing clean content...', progress: 0 });
        await this.screenshotRepository.enableCleanContentMode();
        await this._delay(500);
      }

      onProgress?.({ status: 'Scroll capture mode active', progress: 0 });

      // Initialize scroll listener
      await this.screenshotRepository.initializeScrollListener(
        this._onScroll.bind(this),
        config
      );

      // Capture initial viewport
      const initialCapture = await this.screenshotRepository.captureCurrentViewport();
      this.capturedSections.push({
        data: initialCapture,
        scrollY: 0
      });
      this.captureCount = 1;

      return { success: true };
    } catch (error) {
      this.isCapturing = false;
      return { success: false, error: error.message };
    }
  }

  async stopCapture(onProgress, config) {
    try {
      if (!this.isCapturing) {
        throw new Error('No capture in progress');
      }

      this.isCapturing = false;

      onProgress?.({ status: 'Processing captured sections...', progress: 50 });

      // Remove scroll listener
      await this.screenshotRepository.removeScrollListener();

      // Restore original content if clean mode was enabled
      if (config && config.cleanContentMode) {
        await this.screenshotRepository.showStickyElements();
        await this.screenshotRepository.disableCleanContentMode();
      }

      // Get final dimensions
      const dimensions = await this.screenshotRepository.getPageDimensions();

      onProgress?.({ status: 'Stitching images...', progress: 75 });

      // Stitch all captured sections
      const stitchedImage = await this.screenshotRepository.stitchScrollCaptures(
        this.capturedSections,
        dimensions
      );

      onProgress?.({ status: 'Complete!', progress: 100 });

      return {
        success: true,
        data: stitchedImage,
        dimensions: {
          width: dimensions.viewportWidth,
          height: Math.max(...this.capturedSections.map(s => s.scrollY)) + dimensions.viewportHeight
        }
      };
    } catch (error) {
      this.isCapturing = false;
      
      // Try to restore content on error
      try {
        if (config && config.cleanContentMode) {
          await this.screenshotRepository.showStickyElements();
          await this.screenshotRepository.disableCleanContentMode();
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      
      return { success: false, error: error.message };
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _onScroll(scrollY, config) {
    if (!this.isCapturing) return;

    // Check if we've scrolled enough to capture new content
    const scrollDelta = Math.abs(scrollY - this.lastScrollPosition);
    const dimensions = await this.screenshotRepository.getPageDimensions();

    if (scrollDelta > dimensions.viewportHeight * 0.5) {
      // Hide sticky elements after second capture
      if (this.captureCount === 1 && this.config && this.config.cleanContentMode) {
        await this.screenshotRepository.hideStickyElements();
      }
      
      // Capture new section
      const capture = await this.screenshotRepository.captureCurrentViewport();
      
      // Check for duplicates
      const isDuplicate = this.capturedSections.some(
        section => Math.abs(section.scrollY - scrollY) < 50
      );

      if (!isDuplicate) {
        this.capturedSections.push({
          data: capture,
          scrollY: scrollY
        });
        this.lastScrollPosition = scrollY;
        this.captureCount++;
      }
    }
  }

  isCaptureActive() {
    return this.isCapturing;
  }
}
