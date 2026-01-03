# WebCapture Pro - Offline Screenshot & PDF Extension

🎯 **Professional Chrome Extension for capturing website screenshots and converting to PDF - 100% Offline & Privacy-First**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-orange.svg)

## ✨ Features

### 🔹 Dual Capture Modes

1. **Full Page Capture (Auto Mode)**
   - Automatically captures entire loaded webpage
   - Handles long pages intelligently
   - Perfect for: Invoices, Articles, Documentation

2. **Scroll & Capture (Live Scroll Mode)**
   - Manually scroll to capture dynamic content
   - Handles lazy-loaded content
   - Perfect for: Social feeds, Infinite scroll pages

### 🔹 Export Options
- ✅ PNG Image (Lossless)
- ✅ JPEG Image (Compressed)
- ✅ Multi-page PDF (Professional)

### 🔹 Privacy & Security
- 🔒 100% Offline processing
- 🚫 No data collection
- 🚫 No analytics or tracking
- 🚫 No server uploads
- 🛡️ All processing happens locally on your device

## 🏗️ Architecture

This extension follows **Clean Architecture** principles:

```
📁 Clean Architecture Layers
├── 🎨 Presentation Layer (UI)
│   └── scripts/popup.js - UI controller
├── 🧠 Domain Layer (Business Logic)
│   ├── entities/CaptureConfig.js - Core entities
│   └── useCases/
│       ├── CaptureFullPageUseCase.js
│       └── CaptureScrollModeUseCase.js
└── 💾 Data Layer (Data Handling)
    ├── repositories/ScreenshotRepository.js
    └── dataSources/
        ├── ChromeScreenshotDataSource.js
        └── PDFGeneratorDataSource.js
```

### Benefits of Clean Architecture:
- ✅ Separation of concerns
- ✅ Testable business logic
- ✅ Easy to maintain and extend
- ✅ Independent of frameworks
- ✅ Professional code structure

## 📦 Installation

### Prerequisites
1. Google Chrome or Chromium-based browser
2. **REQUIRED**: Download pdf-lib library (see below)

### Step 1: Download pdf-lib Library

**Option A: Using curl**
```bash
cd screenshot-extension/lib
curl -L -o pdf-lib.min.js https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
```

**Option B: Using npm**
```bash
npm install pdf-lib@1.17.1
cp node_modules/pdf-lib/dist/pdf-lib.min.js lib/
```

**Option C: Manual Download**
1. Visit: https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
2. Save as `lib/pdf-lib.min.js`

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `screenshot-extension` folder
5. The extension icon should appear in your toolbar

## 🎯 How to Use

### Full Page Capture
1. Click the extension icon
2. Click **"Full Page Capture"**
3. Wait for automatic capture to complete
4. Choose export format (PNG/JPEG/PDF)
5. File downloads automatically

### Scroll & Capture
1. Click the extension icon
2. Click **"Scroll & Capture"**
3. Manually scroll the page to load content
4. Click **"Stop Capture"** when done
5. Choose export format (PNG/JPEG/PDF)
6. File downloads automatically

## 🎨 UI Design

- **Theme**: Professional Dark Blue
- **Design**: Modern, minimal, and intuitive
- **Animations**: Smooth transitions and progress indicators
- **Responsive**: Works on all screen sizes

## ⚙️ Technology Stack

- **Manifest Version**: V3 (Latest)
- **JavaScript**: Vanilla ES6+
- **CSS**: Modern CSS with gradients and animations
- **Chrome APIs**:
  - `chrome.tabs` - Tab management
  - `chrome.scripting` - Content script injection
  - `chrome.storage` - Settings storage
- **PDF Generation**: pdf-lib (offline library)
- **Canvas API**: Image stitching

## 📝 File Structure

```
screenshot-extension/
├── manifest.json                 # Extension configuration
├── popup.html                    # Extension popup UI
├── styles/
│   └── popup.css                # Beautiful dark blue styling
├── scripts/
│   ├── popup.js                 # Presentation layer
│   ├── background.js            # Service worker
│   └── content.js               # Content script
├── domain/
│   ├── entities/
│   │   └── CaptureConfig.js     # Core entities
│   └── useCases/
│       ├── CaptureFullPageUseCase.js
│       └── CaptureScrollModeUseCase.js
├── data/
│   ├── repositories/
│   │   └── ScreenshotRepository.js
│   └── dataSources/
│       ├── ChromeScreenshotDataSource.js
│       └── PDFGeneratorDataSource.js
├── lib/
│   └── pdf-lib.min.js           # PDF library (download required)
├── assets/
│   └── icons/                   # Extension icons
├── README.md                    # This file
└── LIBRARY_DOWNLOAD.md          # Library download instructions
```

## ⚠️ Known Limitations

1. **Canvas Height Limit**: Browser limitation of ~32,000 pixels
   - Solution: Automatic PDF page splitting
   
2. **Infinite Scroll**: Cannot force-load content beyond what's loaded
   - Solution: Use Scroll & Capture mode
   
3. **GPU-Heavy Pages**: May fail on low-end systems
   - Solution: Close other tabs to free up memory

## 🔧 Development

### Code Quality Standards
- ✅ Clean Architecture principles
- ✅ ES6+ modern JavaScript
- ✅ Proper error handling
- ✅ Async/await patterns
- ✅ No global variables
- ✅ Commented code

### Testing Checklist
- [ ] Test on long static pages (articles, invoices)
- [ ] Test on infinite scroll pages (social media)
- [ ] Test PDF generation with multiple pages
- [ ] Test PNG/JPEG export quality
- [ ] Test memory usage on large pages
- [ ] Test on different Chrome versions

## 📄 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions are welcome! Please follow:
1. Clean Architecture principles
2. Code comments and documentation
3. Error handling best practices
4. No external dependencies (except pdf-lib)

## 🐛 Troubleshooting

### Extension doesn't load
- Ensure pdf-lib.min.js is in the `lib/` folder
- Check Chrome console for errors
- Verify all files are present

### Capture fails
- Try refreshing the page
- Check if page is fully loaded
- Reduce page complexity by closing unnecessary elements

### PDF export fails
- Verify pdf-lib.min.js is properly loaded
- Check browser console for errors
- Try exporting as PNG first

### Out of memory errors
- Close other browser tabs
- Try capturing in smaller sections
- Reduce browser zoom level

## 📞 Support

For issues and feature requests, please check:
1. This README thoroughly
2. Known limitations section
3. Troubleshooting guide

## 🎉 Success Criteria

✅ 100% Offline operation  
✅ Zero external API calls  
✅ Clean Architecture implementation  
✅ Professional UI/UX  
✅ Error-free operation  
✅ Ready for Chrome Web Store publication  

---

**Made with ❤️ using Clean Architecture principles**
