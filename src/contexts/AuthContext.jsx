import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('scholarsift_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock authentication - replace with Supabase auth
    const mockUser = {
      id: '1',
      email,
      subscriptionTier: 'basic',
      apiKey: 'mock-api-key',
      summariesUsed: 5,
      summariesLimit: 50
    }
    setUser(mockUser)
    localStorage.setItem('scholarsift_user', JSON.stringify(mockUser))
    return mockUser
  }

  const register = async (email, password) => {
    // Mock registration - replace with Supabase auth
    const mockUser = {
      id: '1',
      email,
      subscriptionTier: 'free',
      apiKey: 'mock-api-key',
      summariesUsed: 0,
      summariesLimit: 5
    }
    setUser(mockUser)
    localStorage.setItem('scholarsift_user', JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('scholarsift_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('scholarsift_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}