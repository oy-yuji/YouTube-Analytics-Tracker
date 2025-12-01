# YouTube Channel Tracker - Chrome Extension with OAuth 2.0

## Overview
This Chrome extension allows users to track multiple YouTube channels and view their statistics (subscribers, views, videos) in a sortable table. The extension uses OAuth 2.0 for secure authentication with the YouTube Data API v3.

## Features
- **OAuth 2.0 Authentication**: Secure Google sign-in, no manual API key entry
- **Channel Tracking**: Add channels by URL (supports both channel IDs and handles)
- **Live Statistics**: View subscriber count, view count, and video count
- **Sortable Table**: Click column headers to sort (alphabetically or numerically)
- **Persistent Storage**: Channels saved across sessions using chrome.storage.sync
- **Quick Delete**: Double-click any row to remove a channel
- **Demo Channels**: Pre-loaded example channels on first use

## Technical Stack
- **Manifest Version**: 3 (latest Chrome extension standard)
- **APIs**: 
  - Chrome Identity API (OAuth 2.0 token management)
  - Chrome Storage API (sync across devices)
  - Chrome Tabs API (navigation)
  - YouTube Data API v3 (channel data)
- **UI Framework**: Bootstrap 5.3.7 (CSS only, CSP-compliant)
- **Architecture**: Service worker background script, popup page, tracker page

## File Structure

```
YouTube-Analytics-Tracker/
├── manifest.json           # Extension configuration
├── background.js           # OAuth service worker
├── index.html             # Sign-in popup (720x540px)
├── index.js               # Popup logic (OAuth flow trigger)
├── channeltracker.html    # Main tracker page
├── script.js              # Tracker functionality
├── styles.css             # Custom styling
├── savedChannels.json     # Demo channel IDs
├── icon/                  # Extension icons (TODO)
├── README.md             # Project documentation
└── OAUTH_SETUP.md        # OAuth configuration guide
```

## How It Works

### Authentication Flow
1. User clicks extension icon → opens popup (index.html)
2. User clicks "Sign in with Google" button
3. index.js sends message to background service worker
4. background.js requests OAuth token via chrome.identity API
5. User grants permissions via Google consent screen
6. Token returned and cached by Chrome
7. Tracker page opens in new tab

### Data Fetching
1. script.js initializes and requests OAuth token from background
2. Token used in Authorization header for YouTube API requests
3. Channel data fetched and displayed in table
4. Channel IDs saved to chrome.storage.sync
5. Table automatically refreshes on page load

### Storage
- **chrome.storage.sync**: Syncs savedChannels array across user's devices
- **OAuth tokens**: Managed by Chrome, auto-refresh handled
- **No manual key storage**: Eliminates security risks of API key exposure

## Setup Instructions

See [OAUTH_SETUP.md](OAUTH_SETUP.md) for detailed OAuth 2.0 configuration steps.

### Quick Start
1. Clone this repository
2. Follow OAUTH_SETUP.md to configure Google Cloud Console
3. Update manifest.json with your Client ID and extension key
4. Load extension in Chrome (chrome://extensions → Load unpacked)
5. Click extension icon and sign in

## Chrome Web Store Readiness

### Completed ✅
- Manifest V3 compliance
- OAuth 2.0 implementation (secure authentication)
- Content Security Policy compliance (no inline scripts)
- Minimal permissions requested
- Persistent storage using chrome.storage.sync
- User-friendly popup interface

### Before Publishing 📋
1. **Create extension icons** (16px, 32px, 48px, 128px)
2. **Write privacy policy** (required by Chrome Web Store)
3. **Complete OAuth verification** in Google Cloud Console
4. **Vendor Bootstrap CSS** (optional - remove CDN dependency)
5. **Add loading indicators** for better UX during API calls
6. **Improve error handling** for quota limits and network failures
7. **Test thoroughly** in different scenarios
8. **Prepare store listing**: screenshots, description, promotional images

### Security Notes
- OAuth 2.0 eliminates API key exposure risks
- Minimal YouTube API scope requested (readonly)
- No sensitive data stored locally
- Follows Chrome extension security best practices
- CSP-compliant code (no eval, no inline scripts)

## Known Limitations
1. **Quota**: YouTube API has daily quota limits (10,000 units/day default)
2. **Sync Storage**: 100KB limit (approximately 1,000+ channels before hitting limit)
3. **No real-time updates**: Refresh page to update statistics
4. **Duplicate channels**: Currently allows adding same channel multiple times

## Future Enhancements
- Automatic statistics refresh at intervals
- Duplicate channel detection
- Export data to CSV
- Charts and trend visualization
- Notifications for milestone achievements
- Dark mode
- Customizable refresh intervals
- Quota usage indicator

## Development Notes

### Important Functions (script.js)
- `init()`: Initializes app, gets OAuth token, loads channels
- `getAuthToken()`: Requests token from background service worker
- `fetchAndDisplayChannel(id)`: Fetches channel data from YouTube API
- `showIntroModal()`: Custom CSP-safe modal implementation
- `saveChannelIdToLocalStorage(id)`: Saves channel to chrome.storage.sync
- `sortTable(n)`, `sortTableNumerically(n)`: Column sorting functions

### OAuth Flow (background.js)
- Listens for `getAuthToken` and `revokeAuthToken` messages
- Uses chrome.identity.getAuthToken() for token retrieval
- Handles token caching and refresh automatically
- Returns token to requesting context via message response

### Storage Schema
```javascript
{
  savedChannels: ["UCxxxxxxxx", "UCyyyyyyyy", ...] // Array of YouTube channel IDs
}
```

## Testing Checklist
- [ ] Sign-in flow works smoothly
- [ ] Channels load correctly on tracker page
- [ ] Add channel by URL (both ID and handle formats)
- [ ] Sort by each column (ascending/descending)
- [ ] Delete channel by double-click
- [ ] Channels persist after closing/reopening extension
- [ ] Error handling for invalid channels
- [ ] Error handling for network failures
- [ ] Error handling for expired tokens (auto-refresh)
- [ ] Test on fresh install (no existing data)

## Contributing
This project is a personal learning exercise. Feel free to fork and modify for your own use.

## License
[Specify your license here]

## Acknowledgments
- YouTube Data API v3
- Bootstrap CSS framework
- Chrome Extensions documentation
