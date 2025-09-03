// Error logging service
// This service handles error logging and reporting

// Log levels
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
}

// In-memory log storage for development
const inMemoryLogs = []

// Maximum number of logs to keep in memory
const MAX_IN_MEMORY_LOGS = 100

// Log an error or message
export const logError = (error, context = {}, level = LogLevel.ERROR) => {
  const timestamp = new Date().toISOString()
  const errorMessage = error instanceof Error ? error.message : String(error)
  const stackTrace = error instanceof Error ? error.stack : null
  
  const logEntry = {
    timestamp,
    level,
    message: errorMessage,
    stack: stackTrace,
    context
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`[${level.toUpperCase()}] ${timestamp}`)
    console.error(errorMessage)
    if (stackTrace) console.error(stackTrace)
    if (Object.keys(context).length > 0) console.info('Context:', context)
    console.groupEnd()
    
    // Store in memory for development debugging
    inMemoryLogs.push(logEntry)
    
    // Trim logs if they exceed the maximum
    if (inMemoryLogs.length > MAX_IN_MEMORY_LOGS) {
      inMemoryLogs.shift()
    }
  }
  
  // In production, you would send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to a logging service like Sentry
    // sendToLoggingService(logEntry)
  }
  
  return logEntry
}

// Log an informational message
export const logInfo = (message, context = {}) => {
  return logError(message, context, LogLevel.INFO)
}

// Log a warning
export const logWarning = (message, context = {}) => {
  return logError(message, context, LogLevel.WARNING)
}

// Log a debug message
export const logDebug = (message, context = {}) => {
  return logError(message, context, LogLevel.DEBUG)
}

// Log a critical error
export const logCritical = (error, context = {}) => {
  return logError(error, context, LogLevel.CRITICAL)
}

// Get all logs (for development debugging)
export const getLogs = () => {
  return [...inMemoryLogs]
}

// Clear all logs (for development debugging)
export const clearLogs = () => {
  inMemoryLogs.length = 0
}

// Example function to send logs to a logging service
const sendToLoggingService = (logEntry) => {
  // This would be implemented to send logs to a service like Sentry, LogRocket, etc.
  // For example:
  // 
  // fetch('https://logging-api.example.com/log', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(logEntry),
  // })
  // .catch(err => console.error('Failed to send log to service:', err))
  
  console.log('Would send to logging service:', logEntry)
}

