# 📦 Installation Guide | انسٹالیشن گائیڈ

## English Version

### Step 1: Download Required Library

**CRITICAL**: The extension requires `pdf-lib` library for PDF generation.

#### Option A: Using Terminal (Recommended)
```bash
cd screenshot-extension/lib
curl -L -o pdf-lib.min.js https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
```

#### Option B: Manual Download
1. Open browser and go to: https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
2. Right-click → "Save As"
3. Save file as `pdf-lib.min.js` in the `screenshot-extension/lib/` folder

#### Option C: Using wget
```bash
cd screenshot-extension/lib
wget https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
```

### Step 2: Verify File Structure

Your folder should look like this:
```
screenshot-extension/
├── manifest.json ✓
├── popup.html ✓
├── lib/
│   └── pdf-lib.min.js ✓ (MUST BE PRESENT!)
├── scripts/ ✓
├── domain/ ✓
├── data/ ✓
└── assets/ ✓
```

### Step 3: Load Extension in Chrome

1. Open Google Chrome
2. Type in address bar: `chrome://extensions/`
3. Enable **"Developer mode"** (toggle switch at top-right)
4. Click **"Load unpacked"** button
5. Navigate to and select the `screenshot-extension` folder
6. Click **"Select Folder"**

### Step 4: Verify Installation

You should see:
- ✅ Extension card appears in extensions page
- ✅ Extension icon appears in Chrome toolbar
- ✅ No errors in the extension card

### Step 5: Test the Extension

1. Open any website (e.g., wikipedia.org)
2. Click the extension icon in toolbar
3. Click "Full Page Capture"
4. Export as PNG/PDF
5. File should download successfully

---

## اردو ورژن

### قدم 1: ضروری لائبریری ڈاؤن لوڈ کریں

**اہم**: ایکسٹینشن کو PDF بنانے کے لیے `pdf-lib` لائبریری کی ضرورت ہے۔

#### آپشن A: ٹرمینل استعمال کریں (تجویز کردہ)
```bash
cd screenshot-extension/lib
curl -L -o pdf-lib.min.js https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
```

#### آپشن B: خود ڈاؤن لوڈ کریں
1. براؤزر میں یہ لنک کھولیں: https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
2. دائیں کلک کریں → "Save As" پر کلک کریں
3. فائل کو `pdf-lib.min.js` نام سے `screenshot-extension/lib/` فولڈر میں سیو کریں

### قدم 2: فائل سٹرکچر چیک کریں

آپ کا فولڈر اس طرح ہونا چاہیے:
```
screenshot-extension/
├── manifest.json ✓
├── popup.html ✓
├── lib/
│   └── pdf-lib.min.js ✓ (یہ ضرور ہونی چاہیے!)
├── scripts/ ✓
├── domain/ ✓
├── data/ ✓
└── assets/ ✓
```

### قدم 3: Chrome میں ایکسٹینشن لوڈ کریں

1. Google Chrome کھولیں
2. ایڈریس بار میں ٹائپ کریں: `chrome://extensions/`
3. **"Developer mode"** آن کریں (اوپر دائیں طرف ٹوگل سوئچ)
4. **"Load unpacked"** بٹن پر کلک کریں
5. `screenshot-extension` فولڈر تلاش کر کے سلیکٹ کریں
6. **"Select Folder"** پر کلک کریں

### قدم 4: انسٹالیشن چیک کریں

آپ کو یہ نظر آنا چاہیے:
- ✅ ایکسٹینشن کا کارڈ ایکسٹینشنز پیج پر ظاہر ہو
- ✅ ایکسٹینشن آئیکن Chrome ٹول بار میں نظر آئے
- ✅ ایکسٹینشن کارڈ میں کوئی ایرر نہ ہو

### قدم 5: ایکسٹینشن ٹیسٹ کریں

1. کوئی بھی ویب سائٹ کھولیں (مثال: wikipedia.org)
2. ٹول بار میں ایکسٹینشن آئیکن پر کلک کریں
3. "Full Page Capture" پر کلک کریں
4. PNG/PDF کے طور پر ایکسپورٹ کریں
5. فائل کامیابی سے ڈاؤن لوڈ ہونی چاہیے

---

## Common Issues | عام مسائل

### Issue: "Extensions must be enabled" error
**Solution**: 
- Enable Developer mode in chrome://extensions/
- ڈویلپر موڈ آن کریں chrome://extensions/ میں

### Issue: Extension icon not appearing
**Solution**:
- Click the puzzle icon in Chrome toolbar
- Pin the WebCapture Pro extension
- Chrome ٹول بار میں پزل آئیکن پر کلک کریں
- WebCapture Pro ایکسٹینشن کو پن کریں

### Issue: "pdf-lib.min.js not found" error
**Solution**:
- Download pdf-lib.min.js as shown in Step 1
- Place it in the `lib/` folder
- Reload the extension
- قدم 1 کے مطابق pdf-lib.min.js ڈاؤن لوڈ کریں
- اسے `lib/` فولڈر میں رکھیں
- ایکسٹینشن کو دوبارہ لوڈ کریں

### Issue: Capture fails or freezes
**Solution**:
- Refresh the webpage
- Close unnecessary tabs
- Try smaller page sections
- ویب پیج کو ریفریش کریں
- غیر ضروری ٹیبز بند کریں
- چھوٹے سیکشن کیپچر کریں

---

## Publishing to Chrome Web Store | Chrome Web Store پر پبلش کرنا

### Requirements | ضروریات

1. **Developer Account**: Create a Chrome Web Store developer account ($5 one-time fee)
2. **Privacy Policy**: Prepare a privacy policy (template provided below)
3. **Screenshots**: Take 5-6 screenshots of the extension in action
4. **Promotional Images**: Create promotional tiles (440x280, 920x680, 1400x560)

### Privacy Policy Template

```
WebCapture Pro Privacy Policy

Last Updated: [Current Date]

1. Data Collection
   - WebCapture Pro does NOT collect any user data
   - All processing happens locally on your device
   - No analytics, tracking, or telemetry

2. Data Storage
   - All screenshots and PDFs are generated locally
   - No data is transmitted to external servers
   - No cloud storage or syncing

3. Permissions
   - activeTab: Required to capture visible content
   - scripting: Required to inject capture scripts
   - storage: Required to save user preferences (optional)

4. Third-Party Services
   - None. This extension operates 100% offline

5. Contact
   - For questions: [Your Email]
```

### Submission Steps

1. Go to: https://chrome.google.com/webstore/devconsole
2. Click "New Item"
3. Upload a ZIP file of your extension
4. Fill in all required fields:
   - Name: WebCapture Pro - Offline Screenshot & PDF
   - Summary: Professional offline screenshot to PDF converter
   - Description: Use the README content
   - Category: Productivity
   - Language: English
5. Upload screenshots and promotional images
6. Set pricing (Free)
7. Submit for review

**Review Time**: Usually 1-3 business days

---

## Support | سپورٹ

If you encounter any issues:
- Check the README.md file
- Verify all files are present
- Ensure pdf-lib.min.js is downloaded
- Check Chrome console for errors (F12)

اگر آپ کو کوئی مسئلہ آئے:
- README.md فائل چیک کریں
- تمام فائلیں موجود ہیں یقینی بنائیں
- pdf-lib.min.js ڈاؤن لوڈ ہے یقینی بنائیں
- Chrome console میں ایرر چیک کریں (F12 دبائیں)
