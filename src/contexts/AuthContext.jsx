import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  updateUserProfile, 
  setupAuthListener,
  updateSubscription,
  resetPassword
} from '../services/supabase'
import toast from 'react-hot-toast'

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
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in with Supabase
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    // Set up auth state listener
    const { data: authListener } = setupAuthListener((userData) => {
      setUser(userData)
      setLoading(false)
    })

    initializeAuth()

    // Cleanup function
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setAuthError(null)
    try {
      const { user: authUser, profile } = await signIn(email, password)
      const userData = { ...authUser, ...profile }
      setUser(userData)
      return userData
    } catch (error) {
      setAuthError(error.message)
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    setLoading(true)
    setAuthError(null)
    try {
      const { user: authUser } = await signUp(email, password)
      // After signup, we need to get the profile data
      const userData = await getCurrentUser()
      setUser(userData)
      return userData
    } catch (error) {
      setAuthError(error.message)
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (updates) => {
    if (!user) return
    
    setLoading(true)
    try {
      const updatedProfile = await updateUserProfile(user.userId || user.id, updates)
      setUser({ ...user, ...updatedProfile })
      return updatedProfile
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Error updating profile. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const upgradeSubscription = async (tier) => {
    if (!user) return
    
    setLoading(true)
    try {
      const updatedProfile = await updateSubscription(user.userId || user.id, tier)
      setUser({ ...user, ...updatedProfile })
      return updatedProfile
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      toast.error('Error upgrading subscription. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const sendPasswordReset = async (email) => {
    setLoading(true)
    try {
      await resetPassword(email)
      toast.success('Password reset email sent. Please check your inbox.')
    } catch (error) {
      console.error('Error sending password reset:', error)
      toast.error('Error sending password reset. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    upgradeSubscription,
    sendPasswordReset,
    loading,
    authError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
