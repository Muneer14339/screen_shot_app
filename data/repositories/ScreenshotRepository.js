// data/repositories/ScreenshotRepository.js
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