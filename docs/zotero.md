# Zotero Integration Documentation

This document provides detailed information about the Zotero integration in ScholarSift, including API usage, authentication, and data synchronization.

## Overview

ScholarSift integrates with Zotero, a popular reference management tool, to allow users to export summaries directly to their Zotero libraries. This integration is available for Premium tier users only.

## Zotero API

ScholarSift uses the Zotero Web API to interact with users' Zotero libraries. The API documentation is available at [https://www.zotero.org/support/dev/web_api/v3/start](https://www.zotero.org/support/dev/web_api/v3/start).

## API Key Authentication

Zotero uses API keys for authentication. Users need to generate an API key from their Zotero account and provide it to ScholarSift:

1. Users go to [https://www.zotero.org/settings/keys/new](https://www.zotero.org/settings/keys/new)
2. They create a new API key with appropriate permissions:
   - Read/Write access to their library
   - Read/Write access to notes
3. They copy the API key and paste it into ScholarSift

## API Endpoints Used

ScholarSift uses the following Zotero API endpoints:

### Get User Profile

```
GET /keys/{apiKey}
```

Used to validate the API key and get user information.

### Get User Libraries

```
GET /users/{userId}/groups
```

Used to get the list of group libraries the user has access to.

### Get Library Items

```
GET /{libraryType}s/{libraryId}/items
```

Used to get items from a library.

### Create Item

```
POST /{libraryType}s/{libraryId}/items
```

Used to create new items (e.g., journal articles, notes) in a library.

## Data Models

### Zotero Item Types

ScholarSift primarily works with the following Zotero item types:

1. **Journal Article**:
   ```json
   {
     "itemType": "journalArticle",
     "title": "Paper Title",
     "creators": [
       {
         "creatorType": "author",
         "firstName": "John",
         "lastName": "Doe"
       }
     ],
     "abstractNote": "Paper abstract...",
     "publicationTitle": "Journal Name",
     "volume": "1",
     "issue": "2",
     "pages": "34-56",
     "date": "2023",
     "url": "https://example.com/paper",
     "DOI": "10.1000/xyz123",
     "tags": [
       {
         "tag": "ScholarSift",
         "type": 1
       }
     ]
   }
   ```

2. **Note**:
   ```json
   {
     "itemType": "note",
     "parentItem": "ABCD1234",
     "note": "<p>Note content in HTML format</p>"
   }
   ```

## Integration Implementation

### ZoteroConnect Component

The `ZoteroConnect` component handles the Zotero integration UI:

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { validateApiKey, getUserLibraries, exportSummaryToZotero } from '../services/zotero'

const ZoteroConnect = ({ summary, onExportComplete }) => {
  const [apiKey, setApiKey] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  
  // Component implementation...
}
```

### Zotero Service

The `zotero.js` service handles the API calls to Zotero:

```javascript
// Zotero API base URL
const ZOTERO_API_BASE = 'https://api.zotero.org'

// Validate API key
export const validateApiKey = async (apiKey) => {
  try {
    await getUserProfile(apiKey)
    return true
  } catch (error) {
    return false
  }
}

// Get user libraries
export const getUserLibraries = async (apiKey) => {
  // Implementation...
}

// Export summary to Zotero
export const exportSummaryToZotero = async (apiKey, libraryType, libraryId, summary) => {
  // Implementation...
}
```

## User Flow

1. **Connect to Zotero**:
   - User enters their Zotero API key
   - ScholarSift validates the API key
   - ScholarSift fetches the user's libraries

2. **Export Summary**:
   - User selects a library to export to
   - User clicks "Export to Zotero"
   - ScholarSift formats the summary for Zotero
   - ScholarSift creates a new item in the selected library

## Error Handling

Errors from Zotero API calls are handled as follows:

1. **Authentication Errors**:
   - Display appropriate error messages to the user
   - Prompt the user to check their API key

2. **Permission Errors**:
   - Check if the API key has the required permissions
   - Prompt the user to update their API key permissions

3. **Network Errors**:
   - Implement retries with exponential backoff
   - Display user-friendly error messages

## Security Considerations

1. **API Key Storage**:
   - Store API keys securely in the database
   - Encrypt API keys at rest
   - Never expose API keys in client-side code

2. **Data Privacy**:
   - Only access the minimum required data
   - Do not store Zotero data unnecessarily

## Rate Limiting

Zotero API has rate limits that need to be respected:

- 300 requests per minute
- Implement throttling to avoid hitting rate limits
- Handle 429 Too Many Requests responses with appropriate backoff

## Testing

1. **Unit Tests**:
   - Test API key validation
   - Test library fetching
   - Test item creation

2. **Integration Tests**:
   - Test end-to-end export flow
   - Test error handling

## Future Improvements

Planned improvements for the Zotero integration:

1. **Two-way Synchronization**:
   - Import papers from Zotero for summarization
   - Sync summaries back to Zotero

2. **Batch Operations**:
   - Export multiple summaries at once
   - Import multiple papers at once

3. **Advanced Integration**:
   - Browser extension integration with Zotero Connector
   - Automatic tagging and organization in Zotero

## Troubleshooting

Common issues and their solutions:

1. **API Key Invalid**:
   - Check that the API key is entered correctly
   - Verify that the API key has not expired
   - Generate a new API key if necessary

2. **Permission Denied**:
   - Check that the API key has the required permissions
   - Update the API key permissions in Zotero

3. **Rate Limit Exceeded**:
   - Implement exponential backoff
   - Reduce the frequency of API calls

