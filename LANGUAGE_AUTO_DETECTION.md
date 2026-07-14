# 🌍 Automatic Language Detection

## How It Works

Your PokéPrice Tracker now **automatically detects the visitor's language** and displays the website in their preferred language.

---

## 🎯 Detection Logic

### 1. **First-Time Visitors**
When someone visits your website for the first time:

- **German Browser** (`de`, `de-DE`, `de-AT`, `de-CH`) → Website shows in **German** 🇩🇪
- **All Other Languages** → Website shows in **English** 🇺🇸

### 2. **Returning Visitors**
- Their manually selected preference is **remembered** via localStorage
- They see the language they last chose

### 3. **Manual Override**
- Users can always switch languages using the country selector in the navbar
- Their choice is saved and persists across sessions

---

## 🔍 Detection Method

The system uses the browser's language setting:
```javascript
navigator.language || navigator.userLanguage
```

This captures:
- ✅ Browser language preference
- ✅ Operating system language
- ✅ User's language settings

---

## 🇩🇪 German Auto-Detection

Automatically detects these German language codes:
- `de` - Generic German
- `de-DE` - German (Germany)
- `de-AT` - German (Austria)
- `de-CH` - German (Switzerland)
- `de-LI` - German (Liechtenstein)
- `de-LU` - German (Luxembourg)

---

## 💰 What Changes for German Visitors

### Language
- All text → German
- Navigation → German
- Forms → German
- Buttons → German
- Error messages → German

### Currency
- Prices automatically convert from USD to EUR
- `$15.99` → `€14.71`
- Proper formatting with Euro symbol

### Formatting
- Dates: `31. Dezember 2024`
- Numbers: `1.234,56` (European format)

---

## 🧪 How to Test

### Test German Detection:
1. **Chrome/Edge:**
   - Settings → Languages
   - Add "Deutsch" to the top
   - Clear site data for tcgvertex.com
   - Refresh the page
   - ✅ Should show in German

2. **Firefox:**
   - Settings → Language
   - Choose "Deutsch [de]"
   - Clear cookies for tcgvertex.com
   - Refresh
   - ✅ Should show in German

### Test English (Default):
1. Set browser language to English, Spanish, French, etc.
2. Clear site data
3. Refresh
4. ✅ Should show in English

---

## 📊 User Flow

```
New Visitor
    ↓
Browser Language Check
    ↓
├─ German (de*) → Show German 🇩🇪
│                  Show EUR €
│
└─ Other → Show English 🇺🇸
           Show USD $
    ↓
User Can Switch Manually
    ↓
Preference Saved
    ↓
Next Visit: Use Saved Preference
```

---

## ✅ What's Implemented

- [x] Auto-detect browser language
- [x] Set German for German browsers
- [x] Set English for all others
- [x] Remember manual selections
- [x] Persist across sessions
- [x] Auto-currency conversion
- [x] Proper formatting per locale

---

## 🚀 Live Behavior

Once deployed, German visitors will:
1. Land on your site
2. **Immediately see German** (no flash of English)
3. See all prices in **Euros**
4. Can switch to English if they prefer
5. Their choice is remembered

---

## 🎨 No Configuration Needed

This works **automatically** for all visitors. No setup required!

Just deploy and it works! 🎉
