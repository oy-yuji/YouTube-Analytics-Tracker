# Privacy Policy for Channel Panel

**Last Updated:** November 30, 2025

## Introduction

Channel Panel ("we", "our", or "the extension") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our Chrome extension.

## Information We Collect

### User-Provided Information
- **YouTube Data API Key**: You provide your own YouTube Data API key to access YouTube's public data. This key is stored locally in your browser using Chrome's sync storage.
- **Channel IDs**: The extension stores YouTube channel IDs that you choose to track.
- **Theme Preference**: Your light/dark mode preference is stored locally.

### Automatically Collected Information
- **None**: We do not automatically collect any personal information, browsing history, usage analytics, or telemetry data.

## How We Use Your Information

- **API Key**: Used solely to authenticate requests to the YouTube Data API on your behalf to retrieve public channel statistics.
- **Channel IDs**: Stored to maintain your list of tracked channels across browser sessions and synced devices (if Chrome Sync is enabled).
- **Theme Preference**: Stored to remember your light/dark mode selection.

## Data Storage

All data is stored locally in your browser using Chrome's `chrome.storage.sync` API:
- Data syncs across your Chrome browsers where you're signed in (if Chrome Sync is enabled in your browser)
- Data remains on your device and in your Google account's Chrome sync storage
- **We do not have access to your data**
- **We do not store data on external servers**
- **We do not maintain any backend servers or databases**

## Data Sharing

**We do NOT share, sell, rent, or transmit your data to any third parties.**

Your API key and channel list never leave your browser except when:
- Making API requests directly to Google's YouTube Data API (required for the extension to function)
- Syncing via Chrome Sync to your other devices (managed by Google Chrome, not by us)

## Third-Party Services

This extension interacts with:

### YouTube Data API v3 (Google)
- Used to retrieve public channel statistics (subscriber counts, view counts, video counts)
- Subject to [Google's Privacy Policy](https://policies.google.com/privacy)
- Subject to [YouTube's Terms of Service](https://www.youtube.com/t/terms)

We do not control and are not responsible for the privacy practices of third-party services.

## Data Security

- Your API key and data are stored securely using Chrome's built-in storage mechanisms
- All API requests use HTTPS encryption
- We recommend:
  - Keeping your API key confidential
  - Setting appropriate usage restrictions in Google Cloud Console
  - Not sharing your API key with others

## Your Rights

You have the right to:
- **Access**: View your stored data via browser DevTools Console:
  ```javascript
  chrome.storage.sync.get(null, console.log)
  ```
- **Delete**: Remove the extension to delete all stored data, or clear data manually:
  ```javascript
  chrome.storage.sync.clear()
  ```
- **Modify**: Change your API key or tracked channels at any time through the extension interface
- **Export**: Copy your channel list and API key before uninstalling

## Data Retention

Data is retained locally until you:
- Uninstall the extension
- Manually clear Chrome sync storage
- Remove specific data through the extension interface (double-click to remove channels)

## Children's Privacy

This extension is not intended for children under 13 years of age. We do not knowingly collect information from children.

## International Data Transfers

Since all data is stored locally on your device and synced via Chrome Sync (if enabled), data transfers are managed by Google Chrome according to their privacy policies.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last Updated" date at the top of this document. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Contact Information

For questions, concerns, or requests regarding this Privacy Policy, please:
- Open an issue on our [GitHub repository](https://github.com/oy-yuji/YouTube-Analytics-Tracker)
- Contact the developer through the Chrome Web Store listing

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- YouTube API Services Terms of Service
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) where applicable

## Limited Use Disclosure

Channel Panel's use and transfer of information received from Google APIs adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

Specifically:
- We only request the minimum permissions necessary (storage and YouTube Data API access)
- We do not use YouTube API data for serving advertisements
- We do not transfer YouTube API data to third parties
- We do not use YouTube API data for creditworthiness or lending purposes

## Your Consent

By installing and using this extension, you consent to this Privacy Policy and the collection and use of information as described herein.

## Data Processing Details

### What We Store:
1. Your YouTube Data API key (encrypted by Chrome's storage)
2. List of YouTube channel IDs you choose to track
3. Your theme preference (light/dark mode)

### What We Don't Store:
- Personal identification information
- Browsing history
- Video watch history
- Search queries
- Email addresses
- Payment information
- Location data
- Device identifiers

### API Requests:
- All requests are made directly from your browser to YouTube's servers
- We do not proxy, intercept, or store API responses
- API quota usage is attributed to your API key, not ours

---

**Summary**: Channel Panel stores your API key and channel preferences locally on your device. We don't collect, track, or share any of your data. All YouTube data requests go directly from your browser to YouTube's servers using your API key.
