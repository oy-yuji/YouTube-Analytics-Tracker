# OAuth 2.0 Setup Instructions

Follow these steps to configure OAuth 2.0 for your YouTube Channel Tracker extension:

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

## 2. Configure OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External (for testing) or Internal (for organization-only use)
   - Fill in App name, User support email, Developer contact
   - Add scopes: `https://www.googleapis.com/auth/youtube.readonly`
   - Add test users (if External)
4. Select Application type: **Chrome extension**
5. Enter your extension name
6. You'll receive a **Client ID** like: `xxxxxxxxxxxxx.apps.googleusercontent.com`

## 3. Get Your Extension Key

### Option A: For development (unpacked extension)

1. Load your extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select your extension folder
2. Copy the **Extension ID** shown under your extension
3. Generate the public key:
   - The key is automatically generated when you load the unpacked extension
   - You need to extract it from the extension's folder after first load
   - Or package the extension once to generate the .pem file

### Option B: For production (packaged extension)

1. Package your extension:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select your extension folder
   - This creates a .crx file and a .pem file
2. The .pem file contains your private key
3. Convert the public key from the .pem file (keep this secure!)

**Easier method:** Use the extension ID from the unpacked extension and get the key from the manifest after first load.

## 4. Update manifest.json

Replace the placeholder values in `manifest.json`:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/youtube.readonly"
  ]
},
"key": "YOUR_EXTENSION_KEY_HERE"
```

- Replace `YOUR_CLIENT_ID_HERE` with your OAuth Client ID from step 2
- Replace `YOUR_EXTENSION_KEY_HERE` with your extension's public key from step 3

## 5. Configure Authorized JavaScript Origins

In Google Cloud Console > Credentials > Your OAuth Client:

1. Add your extension ID as an authorized origin:
   - Format: `chrome-extension://YOUR_EXTENSION_ID`
   - Example: `chrome-extension://abcdefghijklmnopqrstuvwxyz123456`

## 6. Test Your Extension

1. Reload your extension in Chrome
2. Click the extension icon
3. Click "Sign in with Google"
4. You should see the Google OAuth consent screen
5. Grant permissions
6. The tracker page should open with your channels loaded

## Important Notes

- **Client Secret**: Chrome extensions don't need a client secret for OAuth 2.0
- **Redirect URIs**: Not needed for Chrome Identity API
- **Scopes**: We only request `youtube.readonly` - minimal permissions needed
- **Token Storage**: Tokens are managed by Chrome and never exposed to your code
- **Production**: Before publishing to Chrome Web Store, complete the OAuth verification process in Google Cloud Console

## Troubleshooting

### "OAuth2 client not found"
- Verify your Client ID is correct in manifest.json
- Make sure the OAuth client is for "Chrome extension" type

### "This app is blocked"
- Your OAuth consent screen needs verification if using external users
- Add yourself as a test user during development

### "Redirect URI mismatch"
- Chrome extensions use a special redirect URI
- You don't need to configure redirect URIs manually

### Token expired/invalid
- The extension automatically handles token refresh
- If issues persist, revoke the token and sign in again

## Security Best Practices

1. Never commit your .pem private key file to git
2. Keep your Client ID public but Client Secret private (though extensions don't use it)
3. Request minimal scopes needed
4. Test thoroughly before publishing
5. Complete OAuth verification before publishing to Chrome Web Store
