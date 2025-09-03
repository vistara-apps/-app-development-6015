import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getUserSummaries, saveSummary, deleteSummary } from '../services/supabase'
import toast from 'react-hot-toast'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Fetch summaries when user changes
  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user) {
        setSummaries([])
        return
      }
      
      setLoading(true)
      try {
        const userSummaries = await getUserSummaries(user.userId || user.id)
        setSummaries(userSummaries)
      } catch (error) {
        console.error('Error fetching summaries:', error)
        setError('Failed to load summaries. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSummaries()
  }, [user])

  const addSummary = async (summary) => {
    if (!user) return
    
    setLoading(true)
    try {
      // Save to Supabase
      const savedSummary = await saveSummary(user.userId || user.id, summary)
      
      // Update local state
      setSummaries(prev => [savedSummary, ...prev])
      return savedSummary
    } catch (error) {
      console.error('Error saving summary:', error)
      toast.error('Failed to save summary. Please try again.')
      setError('Failed to save summary. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeSummary = async (summaryId) => {
    if (!user) return
    
    setLoading(true)
    try {
      // Delete from Supabase
      await deleteSummary(summaryId)
      
      // Update local state
      setSummaries(prev => prev.filter(summary => summary.id !== summaryId))
      toast.success('Summary deleted successfully')
    } catch (error) {
      console.error('Error deleting summary:', error)
      toast.error('Failed to delete summary. Please try again.')
      setError('Failed to delete summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const searchSummaries = (searchTerm) => {
    if (!searchTerm) return summaries
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return summaries.filter(summary => 
      summary.summaryText.toLowerCase().includes(lowerCaseSearchTerm) ||
      summary.url.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }

  const value = {
    summaries,
    setSummaries,
    addSummary,
    removeSummary,
    searchSummaries,
    loading,
    setLoading,
    error,
    setError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
