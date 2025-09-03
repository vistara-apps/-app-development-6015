import React, { createContext, useContext, useState, useCallback } from 'react'
import { AlertCircle, X } from 'lucide-react'

const ErrorContext = createContext()

export const useError = () => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([])

  const addError = useCallback((message, type = 'error', timeout = 5000) => {
    const id = Date.now().toString()
    const newError = { id, message, type, timestamp: new Date() }
    
    setErrors(prev => [...prev, newError])
    
    // Auto-remove after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeError(id)
      }, timeout)
    }
    
    return id
  }, [])

  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(error => error.id !== id))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Error UI component
  const ErrorDisplay = () => {
    if (errors.length === 0) return null
    
    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
        {errors.map(error => (
          <div 
            key={error.id}
            className={`p-4 rounded-lg shadow-md flex items-start animate-fade-in ${
              error.type === 'error' 
                ? 'bg-error/10 border border-error/20' 
                : error.type === 'warning'
                ? 'bg-warning/10 border border-warning/20'
                : 'bg-gray-100 border border-gray-200'
            }`}
          >
            <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
              error.type === 'error' 
                ? 'text-error' 
                : error.type === 'warning'
                ? 'text-warning'
                : 'text-gray-500'
            }`} />
            <div className="flex-1">
              <p className="text-sm text-gray-800">{error.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {error.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button 
              onClick={() => removeError(error.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  const value = {
    errors,
    addError,
    removeError,
    clearErrors
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorDisplay />
    </ErrorContext.Provider>
  )
}

// Global error handler for unhandled exceptions
export const setupGlobalErrorHandler = (addError) => {
  const originalConsoleError = console.error
  
  // Override console.error to capture errors
  console.error = (...args) => {
    // Call the original console.error
    originalConsoleError.apply(console, args)
    
    // Extract error message
    const errorMessage = args
      .map(arg => (arg instanceof Error ? arg.message : String(arg)))
      .join(' ')
    
    // Add to error context
    addError(`An error occurred: ${errorMessage}`)
  }
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason instanceof Error
      ? event.reason.message
      : String(event.reason)
    
    addError(`Unhandled Promise Rejection: ${errorMessage}`)
  })
  
  // Handle runtime errors
  window.addEventListener('error', (event) => {
    addError(`Runtime Error: ${event.message}`)
  })
  
  return () => {
    // Cleanup function to restore original behavior
    console.error = originalConsoleError
    window.removeEventListener('unhandledrejection', addError)
    window.removeEventListener('error', addError)
  }
}

