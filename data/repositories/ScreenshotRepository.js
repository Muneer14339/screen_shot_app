/**
 * Repository: Screenshot Repository
 * Handles screenshot capture operations
 */
export class ScreenshotRepository {
  constructor(chromeDataSource) {
    this.chromeDataSource = chromeDataSource;
  }

  async getPageDimensions() {
    return await this.chromeDataSource.getPageDimensions();
  }

  async captureViewport(scrollY) {
    return await this.chromeDataSource.captureScreenshot(scrollY);
  }

  async captureCurrentViewport() {
    return await this.chromeDataSource.captureCurrentViewport();
  }

  async stitchScreenshots(screenshots, dimensions) {
    return await this.chromeDataSource.stitchImages(screenshots, dimensions);
  }

  async stitchScrollCaptures(captures, dimensions) {
    return await this.chromeDataSource.stitchScrollCaptures(captures, dimensions);
  }

  async initializeScrollListener(callback, config) {
    return await this.chromeDataSource.initializeScrollListener(callback, config);
  }

  async removeScrollListener() {
    return await this.chromeDataSource.removeScrollListener();
  }

  async enableCleanContentMode() {
    return await this.chromeDataSource.enableCleanContentMode();
  }

  async disableCleanContentMode() {
    return await this.chromeDataSource.disableCleanContentMode();
  }

  async hideStickyElements() {
    return await this.chromeDataSource.hideStickyElements();
  }

  async showStickyElements() {
    return await this.chromeDataSource.showStickyElements();
  }
}
