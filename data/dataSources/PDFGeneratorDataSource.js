/**
 * Data Source: PDF Generator Data Source
 * Handles offline PDF generation using pdf-lib
 */
export class PDFGeneratorDataSource {
  constructor() {
    this.PDFLib = null;
  }

  async initialize() {
    if (!this.PDFLib) {
      // Load pdf-lib
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('lib/pdf-lib.min.js');
      document.head.appendChild(script);
      
      await new Promise(resolve => {
        script.onload = () => {
          this.PDFLib = window.PDFLib;
          resolve();
        };
      });
    }
  }

  async generatePDF(imageDataUrl, dimensions) {
    await this.initialize();

    const { PDFDocument } = this.PDFLib;

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Convert data URL to bytes
    const imageBytes = this._dataUrlToBytes(imageDataUrl);
    
    // Embed PNG image
    const image = await pdfDoc.embedPng(imageBytes);
    const imageDims = image.scale(1);

    // Calculate number of pages needed
    const maxPageHeight = 14400; // PDF page height limit
    const pagesNeeded = Math.ceil(dimensions.height / maxPageHeight);

    for (let i = 0; i < pagesNeeded; i++) {
      const pageHeight = Math.min(maxPageHeight, dimensions.height - (i * maxPageHeight));
      
      // Create page with proper dimensions
      const page = pdfDoc.addPage([dimensions.width, pageHeight]);

      // Calculate source rectangle
      const srcY = dimensions.height - ((i + 1) * maxPageHeight);
      const srcHeight = pageHeight;

      // Draw image section
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: dimensions.width,
        height: pageHeight,
        // Crop from source image
        srcX: 0,
        srcY: Math.max(0, srcY),
        srcWidth: dimensions.width,
        srcHeight: srcHeight
      });
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert to blob
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  _dataUrlToBytes(dataUrl) {
    const base64 = dataUrl.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  }
}
