import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import SummaryCard from '../components/SummaryCard'
import { BookOpen, FileText, Search, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'

const MyLibrary = () => {
  const { summaries, searchSummaries, loading, error } = useApp()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSummaries, setFilteredSummaries] = useState([])

  // Update filtered summaries when search term or summaries change
  useEffect(() => {
    if (searchTerm) {
      setFilteredSummaries(searchSummaries(searchTerm))
    } else {
      setFilteredSummaries(summaries)
    }
  }, [searchTerm, summaries, searchSummaries])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">My Library</h2>
          <p className="mt-2 text-gray-600">
            Manage and search through your saved paper summaries
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-500">
          {summaries.length} {summaries.length === 1 ? 'summary' : 'summaries'} total
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search summaries..."
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-gray-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Loader className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading summaries...</h3>
          <p className="text-gray-600">
            Please wait while we fetch your research library
          </p>
        </div>
      )}

      {/* Library Content */}
      {!loading && summaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your research library by summarizing your first paper
          </p>
          <a href="/summarize" className="btn-primary flex items-center justify-center">
            <FileText className="w-4 h-4 mr-2" />
            Summarize Your First Paper
          </a>
        </div>
      ) : !loading && filteredSummaries.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms to find what you're looking for
          </p>
        </div>
      ) : !loading && (
        <div className="space-y-6">
          {filteredSummaries.map((summary) => (
            <SummaryCard 
              key={summary.id} 
              summary={summary} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLibrary
