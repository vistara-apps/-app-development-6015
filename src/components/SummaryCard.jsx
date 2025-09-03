import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { ChevronDown, ChevronUp, Copy, ExternalLink, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const SummaryCard = ({ summary }) => {
  const [expanded, setExpanded] = useState(false)
  const { deleteSummary } = useApp()
  
  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summaryText)
    toast.success('Summary copied to clipboard!')
  }
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this summary?')) {
      deleteSummary(summary.id)
      toast.success('Summary deleted')
    }
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  const formatAuthors = (authors) => {
    if (!authors || !Array.isArray(authors)) return ''
    return authors.join(', ')
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {summary.metadata?.title || 'Untitled Paper'}
          </h3>
          
          {summary.metadata?.authors && (
            <p className="text-sm text-gray-600 mt-1">
              {formatAuthors(summary.metadata.authors)}
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(summary.dateCreated)}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Copy summary"
            title="Copy summary"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <a
            href={summary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
            aria-label="View paper"
            title="View paper"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-error"
            aria-label="Delete summary"
            title="Delete summary"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-3">
        <div className={`text-sm text-gray-700 ${expanded ? '' : 'line-clamp-3'}`}>
          {summary.summaryText}
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary hover:text-primary/80 text-sm mt-2 flex items-center"
          aria-label={expanded ? 'Collapse summary' : 'Expand summary'}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Expand
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SummaryCard

