# Library Download Instructions

## Required External Library

This extension requires `pdf-lib` for offline PDF generation. Due to network restrictions, please download it manually:

### Option 1: Download from CDN
1. Visit: https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
2. Save the file as `lib/pdf-lib.min.js` in the extension directory

### Option 2: Use npm
```bash
npm install pdf-lib@1.17.1
cp node_modules/pdf-lib/dist/pdf-lib.min.js lib/
```

### Option 3: Use curl (if available)
```bash
curl -L -o lib/pdf-lib.min.js https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
```

## File Structure
After downloading, your structure should be:
```
screenshot-extension/
├── lib/
│   └── pdf-lib.min.js  ← Place the downloaded file here
```

The extension will NOT work without this library file!
