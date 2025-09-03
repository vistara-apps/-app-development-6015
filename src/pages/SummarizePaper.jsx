import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { summarizePaper, extractPaperContent } from '../services/openai'
import { Sparkles, Link as LinkIcon, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SummarizePaper = () => {
  const [paperUrl, setPaperUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSummary, setCurrentSummary] = useState(null)
  const { user, updateUser } = useAuth()
  const { addSummary } = useApp()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!paperUrl.trim()) {
      toast.error('Please enter a paper URL or DOI')
      return
    }

    if (user.summariesUsed >= user.summariesLimit) {
      toast.error('You have reached your summary limit. Please upgrade your plan.')
      return
    }

    setLoading(true)
    setCurrentSummary(null)

    try {
      // Extract paper content
      toast.loading('Extracting paper content...', { id: 'summarize' })
      const paperContent = await extractPaperContent(paperUrl)
      
      // Generate summary
      toast.loading('Generating summary...', { id: 'summarize' })
      const result = await summarizePaper(paperContent, paperUrl)
      
      // Add to app state
      const summaryWithId = {
        id: Date.now(),
        ...result,
        summaryText: result.summary
      }
      
      addSummary(summaryWithId)
      setCurrentSummary(summaryWithId)
      
      // Update user's usage count
      updateUser({ summariesUsed: user.summariesUsed + 1 })
      
      toast.success('Summary generated successfully!', { id: 'summarize' })
      setPaperUrl('')
    } catch (error) {
      toast.error(error.message, { id: 'summarize' })
    } finally {
      setLoading(false)
    }
  }

  const remainingSummaries = user.summariesLimit - user.summariesUsed

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-semibold text-gray-900">Summarize Research Paper</h2>
        <p className="mt-2 text-gray-600">
          Get instant insights from any research paper URL or DOI
        </p>
      </div>

      {/* Usage Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Usage Status</h3>
            <p className="text-gray-600">
              {remainingSummaries} summaries remaining this month
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-primary">{remainingSummaries}</p>
            <p className="text-sm text-gray-500">of {user.summariesLimit}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((user.summariesUsed / user.summariesLimit) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="paperUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Paper URL or DOI
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="paperUrl"
                type="url"
                value={paperUrl}
                onChange={(e) => setPaperUrl(e.target.value)}
                className="input-field pl-10"
                placeholder="https://arxiv.org/abs/... or DOI: 10.1000/..."
                disabled={loading || remainingSummaries <= 0}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Supported formats: arXiv URLs, DOIs, direct PDF links, and journal URLs
            </p>
          </div>

          {remainingSummaries <= 0 && (
            <div className="flex items-center p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                You have reached your monthly summary limit. 
                <a href="/settings" className="text-primary hover:underline ml-1">
                  Upgrade your plan
                </a> to continue summarizing papers.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || remainingSummaries <= 0}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Summary...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Summary
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Current Summary */}
      {currentSummary && (
        <div className="card animate-slide-in">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Generated Summary</h3>
          </div>
          
          <div className="mb-4">
            <a
              href={currentSummary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              View Original Paper →
            </a>
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg">
              {currentSummary.summaryText}
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentSummary.summaryText)
                toast.success('Summary copied to clipboard!')
              }}
              className="btn-secondary"
            >
              Copy Summary
            </button>
            <a
              href={currentSummary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View Paper
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummarizePaper