// Zotero API integration service

// Zotero API base URL
const ZOTERO_API_BASE = 'https://api.zotero.org'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Zotero API error: ${response.status} - ${error}`)
  }
  return response.json()
}

/**
 * Get user profile information
 * @param {string} apiKey - Zotero API key
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async (apiKey) => {
  try {
    const response = await fetch(`${ZOTERO_API_BASE}/keys/${apiKey}`, {
      headers: {
        'Zotero-API-Key': apiKey
      }
    })
    
    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching Zotero user profile:', error)
    throw new Error('Failed to fetch Zotero user profile')
  }
}

/**
 * Get user libraries (personal and group)
 * @param {string} apiKey - Zotero API key
 * @returns {Promise<Object>} - User libraries
 */
export const getUserLibraries = async (apiKey) => {
  try {
    // Get user ID first
    const userProfile = await getUserProfile(apiKey)
    const userId = userProfile.userID
    
    // Get personal library
    const personalLibrary = {
      id: userId,
      name: 'Personal Library',
      type: 'personal'
    }
    
    // Get group libraries
    const groupsResponse = await fetch(`${ZOTERO_API_BASE}/users/${userId}/groups`, {
      headers: {
        'Zotero-API-Key': apiKey
      }
    })
    
    const groups = await handleResponse(groupsResponse)
    const groupLibraries = groups.map(group => ({
      id: group.id,
      name: group.data.name,
      type: 'group'
    }))
    
    return [personalLibrary, ...groupLibraries]
  } catch (error) {
    console.error('Error fetching Zotero libraries:', error)
    throw new Error('Failed to fetch Zotero libraries')
  }
}

/**
 * Get items from a library
 * @param {string} apiKey - Zotero API key
 * @param {string} libraryType - 'user' or 'group'
 * @param {string} libraryId - Library ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Library items
 */
export const getLibraryItems = async (apiKey, libraryType, libraryId, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      limit: params.limit || 50,
      start: params.start || 0,
      sort: params.sort || 'dateAdded',
      direction: params.direction || 'desc',
      ...params.filters
    })
    
    const url = `${ZOTERO_API_BASE}/${libraryType}s/${libraryId}/items?${queryParams}`
    
    const response = await fetch(url, {
      headers: {
        'Zotero-API-Key': apiKey
      }
    })
    
    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching Zotero library items:', error)
    throw new Error('Failed to fetch Zotero library items')
  }
}

/**
 * Search for items across libraries
 * @param {string} apiKey - Zotero API key
 * @param {string} query - Search query
 * @param {string} libraryType - 'user' or 'group'
 * @param {string} libraryId - Library ID
 * @returns {Promise<Array>} - Search results
 */
export const searchItems = async (apiKey, query, libraryType, libraryId) => {
  try {
    const queryParams = new URLSearchParams({
      q: query,
      limit: 50
    })
    
    const url = `${ZOTERO_API_BASE}/${libraryType}s/${libraryId}/items?${queryParams}`
    
    const response = await fetch(url, {
      headers: {
        'Zotero-API-Key': apiKey
      }
    })
    
    return handleResponse(response)
  } catch (error) {
    console.error('Error searching Zotero items:', error)
    throw new Error('Failed to search Zotero items')
  }
}

/**
 * Create a new item in a library
 * @param {string} apiKey - Zotero API key
 * @param {string} libraryType - 'user' or 'group'
 * @param {string} libraryId - Library ID
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} - Created item
 */
export const createItem = async (apiKey, libraryType, libraryId, itemData) => {
  try {
    const url = `${ZOTERO_API_BASE}/${libraryType}s/${libraryId}/items`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Zotero-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([itemData])
    })
    
    return handleResponse(response)
  } catch (error) {
    console.error('Error creating Zotero item:', error)
    throw new Error('Failed to create Zotero item')
  }
}

/**
 * Create a note item attached to a parent item
 * @param {string} apiKey - Zotero API key
 * @param {string} libraryType - 'user' or 'group'
 * @param {string} libraryId - Library ID
 * @param {string} parentKey - Parent item key
 * @param {string} noteText - Note text (HTML)
 * @returns {Promise<Object>} - Created note
 */
export const createNote = async (apiKey, libraryType, libraryId, parentKey, noteText) => {
  try {
    const noteData = {
      itemType: 'note',
      parentItem: parentKey,
      note: noteText
    }
    
    return await createItem(apiKey, libraryType, libraryId, noteData)
  } catch (error) {
    console.error('Error creating Zotero note:', error)
    throw new Error('Failed to create Zotero note')
  }
}

/**
 * Add a summary as a note to a Zotero item
 * @param {string} apiKey - Zotero API key
 * @param {string} libraryType - 'user' or 'group'
 * @param {string} libraryId - Library ID
 * @param {string} itemKey - Item key
 * @param {Object} summary - Summary object
 * @returns {Promise<Object>} - Created note
 */
export const addSummaryToItem = async (apiKey, libraryType, libraryId, itemKey, summary) => {
  try {
    const noteText = `
      <h1>ScholarSift Summary</h1>
      <p><strong>Generated:</strong> ${new Date(summary.dateCreated).toLocaleString()}</p>
      <div>
        ${summary.summaryText.replace(/\n/g, '<br>')}
      </div>
    `
    
    return await createNote(apiKey, libraryType, libraryId, itemKey, noteText)
  } catch (error) {
    console.error('Error adding summary to Zotero item:', error)
    throw new Error('Failed to add summary to Zotero item')
  }
}

/**
 * Format a summary for export to Zotero
 * @param {Object} summary - Summary object
 * @returns {Object} - Zotero item data
 */
export const formatSummaryForZotero = (summary) => {
  return {
    itemType: 'journalArticle',
    title: 'ScholarSift Summary: ' + (summary.title || 'Research Paper'),
    url: summary.url,
    accessDate: new Date().toISOString(),
    notes: [
      {
        note: `<p>${summary.summaryText.replace(/\n/g, '<br>')}</p>`
      }
    ],
    tags: [
      {
        tag: 'ScholarSift',
        type: 1
      }
    ]
  }
}

/**
 * Export a summary to Zotero
 * @param {string} apiKey - Zotero API key
 * @param {string} libraryType - 'user' or 'group'
 * @param {string} libraryId - Library ID
 * @param {Object} summary - Summary object
 * @returns {Promise<Object>} - Created item
 */
export const exportSummaryToZotero = async (apiKey, libraryType, libraryId, summary) => {
  try {
    const itemData = formatSummaryForZotero(summary)
    return await createItem(apiKey, libraryType, libraryId, itemData)
  } catch (error) {
    console.error('Error exporting summary to Zotero:', error)
    throw new Error('Failed to export summary to Zotero')
  }
}

/**
 * Validate a Zotero API key
 * @param {string} apiKey - Zotero API key to validate
 * @returns {Promise<boolean>} - Whether the key is valid
 */
export const validateApiKey = async (apiKey) => {
  try {
    await getUserProfile(apiKey)
    return true
  } catch (error) {
    return false
  }
}

