import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import { ErrorProvider, useError, setupGlobalErrorHandler } from './contexts/ErrorContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SummarizePaper from './pages/SummarizePaper'
import MyLibrary from './pages/MyLibrary'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

// Global error handler setup
const ErrorHandler = () => {
  const { addError } = useError()
  
  useEffect(() => {
    // Set up global error handlers
    const cleanup = setupGlobalErrorHandler(addError)
    
    // Clean up on unmount
    return cleanup
  }, [addError])
  
  return null
}

function App() {
  return (
    <ErrorBoundary fallbackMessage="Something went wrong with the application. Please refresh the page.">
      <ErrorProvider>
        <AuthProvider>
          <AppProvider>
            <ErrorHandler />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={
                  <ErrorBoundary fallbackMessage="There was an error loading the dashboard.">
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="summarize" element={
                  <ErrorBoundary fallbackMessage="There was an error with the paper summarization.">
                    <SummarizePaper />
                  </ErrorBoundary>
                } />
                <Route path="library" element={
                  <ErrorBoundary fallbackMessage="There was an error loading your library.">
                    <MyLibrary />
                  </ErrorBoundary>
                } />
                <Route path="settings" element={
                  <ErrorBoundary fallbackMessage="There was an error loading your settings.">
                    <Settings />
                  </ErrorBoundary>
                } />
              </Route>
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  boxShadow: '0 8px 24px hsla(220, 50%, 45%, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: 'hsl(120, 60%, 40%)',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(0, 70%, 45%)',
                    secondary: 'white',
                  },
                },
              }}
            />
          </AppProvider>
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
