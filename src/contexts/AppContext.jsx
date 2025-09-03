import React, { createContext, useContext, useState } from 'react'

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

  const addSummary = (summary) => {
    setSummaries(prev => [summary, ...prev])
  }

  const value = {
    summaries,
    setSummaries,
    addSummary,
    loading,
    setLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}