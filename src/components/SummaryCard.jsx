import { Calendar, ExternalLink, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const SummaryCard = ({ summary }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary.summaryText)
    toast.success('Summary copied to clipboard!')
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(summary.dateCreated)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={summary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              View Original Paper
            </a>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Copy summary"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {summary.summaryText}
        </div>
      </div>
    </div>
  )
}

export default SummaryCard