// domain/entities/CaptureConfig.js
export class CaptureConfig {
  constructor({
    mode = 'full',
    format = 'png',
    quality = 0.95,
    maxCanvasHeight = 32000,
    viewportHeight = 0,
    scrollDelay = 600,
    chunkSize = 5000,
    cleanContentMode = true,
    startFromCurrentPosition = false
  } = {}) {
    this.mode = mode;
    this.format = format;
    this.quality = quality;
    this.maxCanvasHeight = maxCanvasHeight;
    this.viewportHeight = viewportHeight;
    this.scrollDelay = scrollDelay;
    this.chunkSize = chunkSize;
    this.cleanContentMode = cleanContentMode;
    this.startFromCurrentPosition = startFromCurrentPosition;
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