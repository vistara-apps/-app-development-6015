import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { validateApiKey, getUserLibraries, exportSummaryToZotero } from '../services/zotero'
import { Key, Check, X, Loader, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const ZoteroConnect = ({ summary, onExportComplete }) => {
  const { user, updateUser } = useAuth()
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  
  // Check if user already has a Zotero API key
  useEffect(() => {
    if (user?.zoteroApiKey) {
      setApiKey(user.zoteroApiKey)
      setIsConnected(true)
      fetchLibraries(user.zoteroApiKey)
    }
  }, [user])
  
  const fetchLibraries = async (key) => {
    try {
      const userLibraries = await getUserLibraries(key)
      setLibraries(userLibraries)
      
      // Select personal library by default
      const personalLibrary = userLibraries.find(lib => lib.type === 'personal')
      if (personalLibrary) {
        setSelectedLibrary(personalLibrary)
      }
    } catch (error) {
      console.error('Error fetching Zotero libraries:', error)
      toast.error('Failed to fetch Zotero libraries')
    }
  }
  
  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a Zotero API key')
      return
    }
    
    setIsValidating(true)
    
    try {
      const isValid = await validateApiKey(apiKey)
      
      if (isValid) {
        // Save API key to user profile
        await updateUser({ zoteroApiKey: apiKey })
        setIsConnected(true)
        toast.success('Successfully connected to Zotero')
        
        // Fetch user libraries
        await fetchLibraries(apiKey)
      } else {
        toast.error('Invalid Zotero API key')
      }
    } catch (error) {
      console.error('Error connecting to Zotero:', error)
      toast.error('Failed to connect to Zotero')
    } finally {
      setIsValidating(false)
    }
  }
  
  const handleDisconnect = async () => {
    try {
      await updateUser({ zoteroApiKey: null })
      setApiKey('')
      setIsConnected(false)
      setLibraries([])
      setSelectedLibrary(null)
      toast.success('Disconnected from Zotero')
    } catch (error) {
      console.error('Error disconnecting from Zotero:', error)
      toast.error('Failed to disconnect from Zotero')
    }
  }
  
  const handleExport = async () => {
    if (!selectedLibrary) {
      toast.error('Please select a library')
      return
    }
    
    setIsExporting(true)
    
    try {
      const libraryType = selectedLibrary.type === 'personal' ? 'user' : 'group'
      await exportSummaryToZotero(
        apiKey,
        libraryType,
        selectedLibrary.id,
        summary
      )
      
      toast.success('Summary exported to Zotero')
      
      if (onExportComplete) {
        onExportComplete()
      }
    } catch (error) {
      console.error('Error exporting to Zotero:', error)
      toast.error('Failed to export summary to Zotero')
    } finally {
      setIsExporting(false)
    }
  }
  
  // Only premium users can use Zotero integration
  if (user?.subscriptionTier !== 'premium') {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <BookOpen className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Zotero Integration</h4>
            <p className="text-xs text-gray-600 mt-1">
              Upgrade to Premium to connect your Zotero account and export summaries directly to your reference manager.
            </p>
            <a href="/settings" className="text-primary hover:underline text-xs mt-2 inline-block">
              Upgrade to Premium
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-4">
        <BookOpen className="w-5 h-5 text-primary mr-2" />
        <h4 className="text-sm font-medium text-gray-900">Zotero Integration</h4>
      </div>
      
      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Connect your Zotero account to export summaries directly to your reference manager.
          </p>
          
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <label htmlFor="zoteroApiKey" className="block text-xs font-medium text-gray-700 mb-1">
                Zotero API Key
              </label>
              <input
                id="zoteroApiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Zotero API key"
                className="input-field text-sm py-2"
                disabled={isValidating}
              />
              <p className="mt-1 text-xs text-gray-500">
                <a 
                  href="https://www.zotero.org/settings/keys/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get an API key from Zotero
                </a>
              </p>
            </div>
            <button
              onClick={handleConnect}
              disabled={isValidating || !apiKey.trim()}
              className="btn-primary text-sm py-2 px-4 mt-5"
            >
              {isValidating ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Connect
                </div>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-success">
              <Check className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Connected to Zotero</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Disconnect
            </button>
          </div>
          
          <div>
            <label htmlFor="zoteroLibrary" className="block text-xs font-medium text-gray-700 mb-1">
              Export to Library
            </label>
            <select
              id="zoteroLibrary"
              value={selectedLibrary?.id || ''}
              onChange={(e) => {
                const selected = libraries.find(lib => lib.id.toString() === e.target.value)
                setSelectedLibrary(selected)
              }}
              className="input-field text-sm py-2"
              disabled={isExporting}
            >
              <option value="" disabled>Select a library</option>
              {libraries.map(library => (
                <option key={library.id} value={library.id}>
                  {library.name} {library.type === 'personal' ? '(Personal)' : '(Group)'}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleExport}
            disabled={isExporting || !selectedLibrary}
            className="btn-primary text-sm py-2 px-4 w-full"
          >
            {isExporting ? (
              <div className="flex items-center justify-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Export to Zotero
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ZoteroConnect

