/**
 * Presentation Layer: Popup UI Controller
 * Handles UI interactions and coordinates with use cases
 */

// Import domain layer
import { CaptureConfig } from '../domain/entities/CaptureConfig.js';
import { CaptureFullPageUseCase } from '../domain/useCases/CaptureFullPageUseCase.js';
import { CaptureScrollModeUseCase } from '../domain/useCases/CaptureScrollModeUseCase.js';

// Import data layer
import { ScreenshotRepository } from '../data/repositories/ScreenshotRepository.js';
import { ChromeScreenshotDataSource } from '../data/dataSources/ChromeScreenshotDataSource.js';
import { PDFGeneratorDataSource } from '../data/dataSources/PDFGeneratorDataSource.js';

class PopupController {
  constructor() {
    // Initialize data sources
    this.chromeDataSource = new ChromeScreenshotDataSource();
    this.pdfGenerator = new PDFGeneratorDataSource();
    
    // Initialize repository
    this.screenshotRepository = new ScreenshotRepository(this.chromeDataSource);
    
    // Initialize use cases
    this.fullPageUseCase = new CaptureFullPageUseCase(this.screenshotRepository);
    this.scrollModeUseCase = new CaptureScrollModeUseCase(this.screenshotRepository);
    
    // State
    this.capturedData = null;
    this.captureDimensions = null;
    this.currentScrollConfig = null;
    
    this.initializeUI();
  }

  initializeUI() {
    // Get DOM elements
    this.elements = {
      fullPageBtn: document.getElementById('fullPageBtn'),
      scrollModeBtn: document.getElementById('scrollModeBtn'),
      stopBtn: document.getElementById('stopBtn'),
      exportSection: document.getElementById('exportSection'),
      exportPngBtn: document.getElementById('exportPngBtn'),
      exportJpegBtn: document.getElementById('exportJpegBtn'),
      exportPdfBtn: document.getElementById('exportPdfBtn'),
      statusText: document.getElementById('statusText'),
      progressContainer: document.getElementById('progressContainer'),
      progressFill: document.getElementById('progressFill'),
      progressText: document.getElementById('progressText'),
      cleanModeToggle: document.getElementById('cleanModeToggle'),
      startPositionToggle: document.getElementById('startPositionToggle')
    };

    // Bind event listeners
    this.elements.fullPageBtn.addEventListener('click', () => this.handleFullPageCapture());
    this.elements.scrollModeBtn.addEventListener('click', () => this.handleScrollModeStart());
    this.elements.stopBtn.addEventListener('click', () => this.handleScrollModeStop());
    this.elements.exportPngBtn.addEventListener('click', () => this.handleExport('png'));
    this.elements.exportJpegBtn.addEventListener('click', () => this.handleExport('jpeg'));
    this.elements.exportPdfBtn.addEventListener('click', () => this.handleExport('pdf'));
  }

  async handleFullPageCapture() {
    try {
      this.showProgress(true);
      this.disableButtons();
      
      const cleanMode = this.elements.cleanModeToggle.checked;
      const startFromCurrent = this.elements.startPositionToggle.checked;
      
      const config = new CaptureConfig({ 
        mode: 'full',
        cleanContentMode: cleanMode,
        startFromCurrentPosition: startFromCurrent
      });
      
      const result = await this.fullPageUseCase.execute(
        config,
        this.updateProgress.bind(this)
      );

      if (result.success) {
        this.capturedData = result.data;
        this.captureDimensions = result.dimensions;
        this.showExportOptions();
        this.updateStatus('Capture complete! Choose export format', 'success');
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.showProgress(false);
      this.enableButtons();
    }
  }

  // scripts/popup.js (relevant part only)
async handleScrollModeStart() {
  try {
    const cleanMode = this.elements.cleanModeToggle.checked;
    const config = new CaptureConfig({ 
      mode: 'scroll',
      cleanContentMode: cleanMode
    });
    
    this.currentScrollConfig = config;
    
    const result = await this.scrollModeUseCase.startCapture(
      config,
      this.updateProgress.bind(this)
    );

    if (result.success) {
      this.elements.scrollModeBtn.classList.add('hidden');
      this.elements.fullPageBtn.classList.add('hidden');
      this.elements.stopBtn.classList.remove('hidden');
      this.elements.cleanModeToggle.disabled = true;
      this.elements.startPositionToggle.disabled = true;
      this.updateStatus('Scroll to desired end position, then click Stop', 'active');
    } else {
      this.showError(result.error);
    }
  } catch (error) {
    this.showError(error.message);
  }
}

  async handleScrollModeStop() {
    try {
      this.showProgress(true);
      
      const result = await this.scrollModeUseCase.stopCapture(
        this.updateProgress.bind(this),
        this.currentScrollConfig // Pass config for cleanup
      );

      if (result.success) {
        this.capturedData = result.data;
        this.captureDimensions = result.dimensions;
        this.showExportOptions();
        this.updateStatus('Capture complete! Choose export format', 'success');
        this.elements.stopBtn.classList.add('hidden');
        this.elements.scrollModeBtn.classList.remove('hidden');
        this.elements.fullPageBtn.classList.remove('hidden');
        this.elements.cleanModeToggle.disabled = false; // Re-enable toggle
        this.elements.startPositionToggle.disabled = false; // Re-enable toggle
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.showProgress(false);
    }
  }

  // scripts/popup.js
async handleExport(format) {
  try {
    if (!this.capturedData) {
      throw new Error('No captured data available');
    }

    this.updateStatus(`Preparing ${format.toUpperCase()} export...`, 'processing');
    this.disableButtons();

    if (format === 'pdf') {
      const pdfUrl = await this.pdfGenerator.generatePDF(
        this.capturedData,
        this.captureDimensions
      );
      this.downloadFile(pdfUrl, `screenshot-${Date.now()}.pdf`);
    } else {
      const imageUrl = await this.convertImageFormat(this.capturedData, format);
      this.downloadFile(imageUrl, `screenshot-${Date.now()}.${format}`);
    }

    this.updateStatus('Export complete!', 'success');
    
    setTimeout(() => {
      this.resetUI();
    }, 2000);
  } catch (error) {
    this.showError(error.message);
  } finally {
    this.enableButtons();
  }
}

  convertImageFormat(dataUrl, format) {
    if (format === 'png') {
      return dataUrl;
    }

    // Convert to JPEG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = dataUrl;
    });
  }

  downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  updateProgress({ status, progress }) {
    this.elements.statusText.textContent = status;
    this.elements.progressFill.style.width = `${progress}%`;
    this.elements.progressText.textContent = `${progress}%`;
  }

  updateStatus(message, type = 'ready') {
    this.elements.statusText.textContent = message;
  }

  showProgress(show) {
    if (show) {
      this.elements.progressContainer.classList.remove('hidden');
    } else {
      this.elements.progressContainer.classList.add('hidden');
    }
  }

  showExportOptions() {
    this.elements.exportSection.classList.remove('hidden');
  }

  hideExportOptions() {
    this.elements.exportSection.classList.add('hidden');
  }

  showError(message) {
    this.elements.statusText.textContent = `Error: ${message}`;
    this.showProgress(false);
  }

  disableButtons() {
    this.elements.fullPageBtn.disabled = true;
    this.elements.scrollModeBtn.disabled = true;
    this.elements.exportPngBtn.disabled = true;
    this.elements.exportJpegBtn.disabled = true;
    this.elements.exportPdfBtn.disabled = true;
  }

  enableButtons() {
    this.elements.fullPageBtn.disabled = false;
    this.elements.scrollModeBtn.disabled = false;
    this.elements.exportPngBtn.disabled = false;
    this.elements.exportJpegBtn.disabled = false;
    this.elements.exportPdfBtn.disabled = false;
  }

  resetUI() {
    this.capturedData = null;
    this.captureDimensions = null;
    this.hideExportOptions();
    this.updateStatus('Ready to capture', 'ready');
    this.elements.progressFill.style.width = '0%';
    this.elements.progressText.textContent = '0%';
  }
}

// Initialize popup controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
