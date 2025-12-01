# Quick Start Guide - YouTube Channel Tracker Extension

## What You Need to Do Next

Your extension now uses **OAuth 2.0** for secure authentication. Here's what you need to do to test it:

## Step 1: Google Cloud Console Setup (15 minutes)

### Create OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search "YouTube Data API v3"
   - Click "Enable"

4. Create OAuth Client ID:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure consent screen first:
     - Choose "External" for testing
     - Fill required fields (app name, email)
     - Add scope: `https://www.googleapis.com/auth/youtube.readonly`
     - Add your email as test user
   - Select application type: **Chrome Extension** 
   - Copy your Client ID (looks like: `xxxxx.apps.googleusercontent.com`)

## Step 2: Load Your Extension

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select your extension folder: `YouTube-Analytics-Tracker`
5. Note the **Extension ID** shown (e.g., `abcdefghijklmnop...`)

## Step 3: Update manifest.json

Open `manifest.json` and replace these placeholders:

```json
"oauth2": {
  "client_id": "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
  ...
},
"key": "YOUR_EXTENSION_KEY_HERE"
```

**For the Client ID:** Paste the OAuth Client ID from Step 1

**For the Extension Key:** 
- During development, you can temporarily remove the `"key"` line entirely
- OR get it from your extension folder after first load (advanced)
- For production, you'll package the extension which generates the key

**Quick fix for testing:** Just remove the `"key"` line for now:
```json
"oauth2": {
  "client_id": "123456789.apps.googleusercontent.com",
  "scopes": ["https://www.googleapis.com/auth/youtube.readonly"]
},
```

## Step 4: Reload & Test

1. Go back to `chrome://extensions/`
2. Click the **reload icon** on your extension
3. Click the extension icon in Chrome toolbar
4. Click **Sign in with Google**
5. Grant permissions when prompted
6. Tracker page should open with channels loaded!

## Troubleshooting

### "OAuth2 client not found"
- Double-check your Client ID in manifest.json
- Make sure you selected "Chrome Extension" type in Google Cloud

### "This app is blocked"
- Normal during development
- In Google Cloud Console, add yourself as a test user

### Extension won't load
- Check for syntax errors in manifest.json
- Make sure your Client ID doesn't have extra spaces or quotes
- Try removing the `"key"` line entirely for testing

### Sign-in button does nothing
- Check browser console (F12) for errors
- Verify background.js loaded properly in `chrome://extensions/`
- Check service worker logs in extensions page

## What Happens When You Sign In

1. Google's consent screen appears
2. You grant YouTube readonly permission
3. Chrome securely stores your OAuth token
4. Extension uses token to fetch channel data
5. No API key needed - it's all handled by OAuth!

## Files You Modified

- ✅ `manifest.json` - OAuth configuration
- ✅ `background.js` - Token management service worker
- ✅ `index.html` - Sign-in popup interface
- ✅ `index.js` - OAuth flow trigger
- ✅ `script.js` - Uses OAuth tokens for API calls

## Next Steps After Testing

1. Create extension icons (16px, 32px, 48px, 128px)
2. Write a privacy policy
3. Complete OAuth app verification in Google Cloud
4. Package extension for Chrome Web Store
5. Prepare store listing with screenshots

## Need More Details?

See these files:
- **OAUTH_SETUP.md** - Detailed OAuth configuration
- **OAUTH_CHANGES.md** - What changed and why
- **IMPLEMENTATION.md** - Complete technical documentation

## Support

If you run into issues:
1. Check browser console for errors (F12)
2. Check service worker logs: chrome://extensions → background.js
3. Verify YouTube Data API is enabled
4. Make sure you're added as a test user
5. Try removing and re-adding the extension

---

**You're almost there!** Just update the Client ID in manifest.json and you're ready to test. 🚀
