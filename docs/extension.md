# Browser Extension Documentation

This document provides detailed information about the ScholarSift browser extension, including architecture, implementation, and usage.

## Overview

The ScholarSift browser extension allows users to quickly summarize research papers while browsing the web. It integrates with popular academic websites and provides a seamless experience for researchers.

## Supported Browsers

The extension supports the following browsers:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari (macOS only)

## Architecture

The extension consists of the following components:

1. **Popup UI**: The user interface that appears when the extension icon is clicked
2. **Content Script**: JavaScript that runs in the context of web pages
3. **Background Script**: JavaScript that runs in the background
4. **Manifest**: Configuration file that defines the extension's properties

### Directory Structure

```
extension/
├── manifest.json        # Extension configuration
├── popup/
│   ├── popup.html      # Popup UI HTML
│   ├── popup.js        # Popup UI JavaScript
│   └── popup.css       # Popup UI styles
├── content/
│   └── content.js      # Content script
├── background/
│   └── background.js   # Background script
└── assets/
    ├── icon-16.png     # Extension icon (16x16)
    ├── icon-48.png     # Extension icon (48x48)
    └── icon-128.png    # Extension icon (128x128)
```

## Manifest File

The manifest file (`manifest.json`) defines the extension's properties:

```json
{
  "manifest_version": 3,
  "name": "ScholarSift",
  "version": "1.0.0",
  "description": "Instantly summarize research papers with AI",
  "icons": {
    "16": "assets/icon-16.png",
    "48": "assets/icon-48.png",
    "128": "assets/icon-128.png"
  },
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "assets/icon-16.png",
      "48": "assets/icon-48.png",
      "128": "assets/icon-128.png"
    }
  },
  "permissions": [
    "activeTab",
    "storage",
    "scripting"
  ],
  "host_permissions": [
    "https://api.scholarsift.com/*"
  ],
  "content_scripts": [
    {
      "matches": [
        "https://arxiv.org/*",
        "https://scholar.google.com/*",
        "https://www.ncbi.nlm.nih.gov/pubmed/*",
        "https://pubmed.ncbi.nlm.nih.gov/*",
        "https://www.sciencedirect.com/*",
        "https://link.springer.com/*",
        "https://ieeexplore.ieee.org/*"
      ],
      "js": ["content/content.js"]
    }
  ],
  "background": {
    "service_worker": "background/background.js"
  }
}
```

## Popup UI

The popup UI is the main interface for the extension. It allows users to:

1. Sign in to their ScholarSift account
2. View their subscription status
3. Summarize the current paper
4. View their recent summaries

### HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>ScholarSift</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="../assets/icon-48.png" alt="ScholarSift Logo">
      <h1>ScholarSift</h1>
    </div>
    
    <div id="login-section" class="section">
      <!-- Login form -->
    </div>
    
    <div id="summary-section" class="section hidden">
      <!-- Summary interface -->
    </div>
    
    <div id="recent-section" class="section hidden">
      <!-- Recent summaries -->
    </div>
    
    <div class="footer">
      <a href="https://scholarsift.com" target="_blank">ScholarSift</a>
      <span>|</span>
      <a href="https://scholarsift.com/privacy" target="_blank">Privacy</a>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

### JavaScript Implementation

The popup JavaScript handles user interactions and communicates with the background script:

```javascript
// Popup initialization
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  chrome.storage.local.get(['token', 'user'], (result) => {
    if (result.token && result.user) {
      showSummarySection(result.user);
    } else {
      showLoginSection();
    }
  });
  
  // Set up event listeners
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('summarize-button').addEventListener('click', handleSummarize);
  document.getElementById('logout-button').addEventListener('click', handleLogout);
});

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    // Send login request to background script
    const response = await chrome.runtime.sendMessage({
      action: 'login',
      email,
      password
    });
    
    if (response.success) {
      showSummarySection(response.user);
    } else {
      showError(response.error);
    }
  } catch (error) {
    showError('Login failed. Please try again.');
  }
}

// Handle summarize
async function handleSummarize() {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Show loading state
    showLoading();
    
    // Send summarize request to background script
    const response = await chrome.runtime.sendMessage({
      action: 'summarize',
      url: tab.url
    });
    
    if (response.success) {
      showSummary(response.summary);
    } else {
      showError(response.error);
    }
  } catch (error) {
    showError('Summarization failed. Please try again.');
  } finally {
    hideLoading();
  }
}

// Other helper functions...
```

## Content Script

The content script runs in the context of web pages and is responsible for:

1. Detecting research papers on supported websites
2. Extracting paper metadata
3. Injecting UI elements for quick summarization

```javascript
// Content script initialization
(function() {
  // Check if the current page is a research paper
  if (isPaperPage()) {
    // Extract paper metadata
    const metadata = extractMetadata();
    
    // Store metadata for later use
    chrome.storage.local.set({ currentPaper: metadata });
    
    // Inject summarize button
    injectSummarizeButton();
  }
})();

// Check if the current page is a research paper
function isPaperPage() {
  const url = window.location.href;
  
  // Check for different paper repositories
  if (url.includes('arxiv.org/abs/')) {
    return true;
  }
  
  if (url.includes('sciencedirect.com/science/article/')) {
    return true;
  }
  
  // Add more checks for other repositories
  
  return false;
}

// Extract paper metadata
function extractMetadata() {
  // Different extraction logic for different websites
  if (window.location.href.includes('arxiv.org')) {
    return extractArxivMetadata();
  }
  
  if (window.location.href.includes('sciencedirect.com')) {
    return extractScienceDirectMetadata();
  }
  
  // Add more extraction logic for other websites
  
  return null;
}

// Inject summarize button
function injectSummarizeButton() {
  // Create button element
  const button = document.createElement('button');
  button.textContent = 'Summarize with ScholarSift';
  button.className = 'scholarsift-button';
  
  // Add click event listener
  button.addEventListener('click', () => {
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'summarize',
      url: window.location.href
    });
  });
  
  // Find appropriate location to inject button
  // This varies by website
  const container = findButtonContainer();
  if (container) {
    container.appendChild(button);
  }
}

// Website-specific extraction functions
function extractArxivMetadata() {
  // Extract metadata from arXiv pages
  const title = document.querySelector('.title').textContent.trim();
  const authors = Array.from(document.querySelectorAll('.authors a'))
    .map(a => a.textContent.trim());
  const abstract = document.querySelector('.abstract').textContent.trim();
  
  return {
    title,
    authors,
    abstract,
    url: window.location.href
  };
}

// More extraction functions for other websites...
```

## Background Script

The background script runs in the background and is responsible for:

1. Handling authentication
2. Making API requests to ScholarSift
3. Managing user data

```javascript
// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    handleLogin(message.email, message.password)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicate async response
  }
  
  if (message.action === 'summarize') {
    handleSummarize(message.url)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicate async response
  }
  
  if (message.action === 'logout') {
    handleLogout()
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicate async response
  }
});

// Handle login
async function handleLogin(email, password) {
  try {
    // Make API request to ScholarSift
    const response = await fetch('https://api.scholarsift.com/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    // Store token and user data
    chrome.storage.local.set({
      token: data.token,
      user: data.user
    });
    
    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Handle summarize
async function handleSummarize(url) {
  try {
    // Get token from storage
    const { token } = await chrome.storage.local.get(['token']);
    
    if (!token) {
      throw new Error('Not logged in');
    }
    
    // Make API request to ScholarSift
    const response = await fetch('https://api.scholarsift.com/v1/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ source: url })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Summarization failed');
    }
    
    // Store summary in recent summaries
    await addToRecentSummaries(data);
    
    return {
      success: true,
      summary: data
    };
  } catch (error) {
    console.error('Summarize error:', error);
    throw error;
  }
}

// Handle logout
async function handleLogout() {
  try {
    // Clear storage
    await chrome.storage.local.remove(['token', 'user']);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Add to recent summaries
async function addToRecentSummaries(summary) {
  try {
    // Get recent summaries from storage
    const { recentSummaries = [] } = await chrome.storage.local.get(['recentSummaries']);
    
    // Add new summary to the beginning
    recentSummaries.unshift(summary);
    
    // Limit to 10 recent summaries
    if (recentSummaries.length > 10) {
      recentSummaries.pop();
    }
    
    // Save updated recent summaries
    await chrome.storage.local.set({ recentSummaries });
  } catch (error) {
    console.error('Error adding to recent summaries:', error);
  }
}
```

## Building and Packaging

The extension can be built and packaged using the following steps:

1. **Install Dependencies**:
   ```
   npm install
   ```

2. **Build Extension**:
   ```
   npm run build:extension
   ```

3. **Package Extension**:
   ```
   npm run package:extension
   ```

This will create a ZIP file that can be uploaded to browser extension stores.

## Browser-Specific Considerations

### Chrome

- Uses Manifest V3
- Requires host permissions for API access

### Firefox

- Uses Manifest V2 (Firefox-specific manifest)
- Requires `browser_specific_settings` in manifest

### Edge

- Compatible with Chrome extension
- No special considerations

### Safari

- Requires additional packaging for Safari Web Extension
- Uses Safari Web Extension Converter

## Testing

1. **Unit Tests**:
   - Test popup UI functionality
   - Test content script detection logic
   - Test background script API calls

2. **Integration Tests**:
   - Test end-to-end summarization flow
   - Test authentication flow

3. **Browser Compatibility Tests**:
   - Test on all supported browsers
   - Test on different operating systems

## Deployment

1. **Chrome Web Store**:
   - Create a developer account
   - Submit the extension for review
   - Provide screenshots and description

2. **Firefox Add-ons**:
   - Create a developer account
   - Submit the extension for review
   - Provide screenshots and description

3. **Microsoft Edge Add-ons**:
   - Create a developer account
   - Submit the extension for review
   - Provide screenshots and description

4. **Safari Extensions Gallery**:
   - Requires Apple Developer account
   - Submit through App Store Connect
   - Provide screenshots and description

## User Guide

1. **Installation**:
   - Install the extension from the browser's extension store
   - Pin the extension to the toolbar for easy access

2. **Authentication**:
   - Click the extension icon
   - Sign in with ScholarSift credentials
   - Or create a new account

3. **Summarizing Papers**:
   - Navigate to a research paper page
   - Click the "Summarize" button injected on the page
   - Or click the extension icon and use the popup interface

4. **Viewing Summaries**:
   - Summaries are displayed in the popup
   - Recent summaries are accessible from the popup
   - Click "Save to Library" to save to ScholarSift account

## Troubleshooting

Common issues and their solutions:

1. **Extension Not Working on a Site**:
   - Check if the site is supported
   - Try refreshing the page
   - Check browser console for errors

2. **Authentication Issues**:
   - Clear extension storage and try again
   - Check if the ScholarSift API is accessible

3. **Summarization Fails**:
   - Check if the paper is accessible
   - Check if the user has reached their summary limit
   - Try using the main ScholarSift website instead

