/**
 * Domain Entity: CaptureConfig
 * Represents the configuration for screenshot capture
 */
export class CaptureConfig {
  constructor({
    mode = 'full',
    format = 'png',
    quality = 0.95,
    maxCanvasHeight = 32000,
    viewportHeight = 0,
    scrollDelay = 100,
    chunkSize = 5000,
    cleanContentMode = true,
    startFromCurrentPosition = false
  } = {}) {
    this.mode = mode; // 'full' or 'scroll'
    this.format = format; // 'png', 'jpeg', 'pdf'
    this.quality = quality;
    this.maxCanvasHeight = maxCanvasHeight;
    this.viewportHeight = viewportHeight;
    this.scrollDelay = scrollDelay;
    this.chunkSize = chunkSize;
    this.cleanContentMode = cleanContentMode; // Remove ads and unwanted elements
    this.startFromCurrentPosition = startFromCurrentPosition; // Start from current scroll or top
  }

  isFullPageMode() {
    return this.mode === 'full';
  }

  isScrollMode() {
    return this.mode === 'scroll';
  }

  isPdfFormat() {
    return this.format === 'pdf';
  }

  isImageFormat() {
    return this.format === 'png' || this.format === 'jpeg';
  }
}
