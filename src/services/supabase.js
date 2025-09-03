import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  
  // If successful, create a user profile with default settings
  if (data?.user) {
    await createUserProfile(data.user.id, {
      email: data.user.email,
      subscriptionTier: 'free',
      summariesUsed: 0,
      summariesLimit: 5,
    })
  }
  
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  // Get the user profile data
  if (data?.user) {
    const profile = await getUserProfile(data.user.id)
    return { ...data, profile }
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) throw error
}

export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  
  if (error) throw error
  
  if (data?.user) {
    const profile = await getUserProfile(data.user.id)
    return { ...data.user, ...profile }
  }
  
  return null
}

// User profile functions
export const createUserProfile = async (userId, profileData) => {
  const { error } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: userId,
        email: profileData.email,
        subscription_tier: profileData.subscriptionTier,
        summaries_used: profileData.summariesUsed,
        summaries_limit: profileData.summariesLimit,
        api_key: generateApiKey(),
      },
    ])
  
  if (error) throw error
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  
  // Convert snake_case to camelCase for frontend use
  return {
    id: data.id,
    userId: data.user_id,
    email: data.email,
    subscriptionTier: data.subscription_tier,
    summariesUsed: data.summaries_used,
    summariesLimit: data.summaries_limit,
    apiKey: data.api_key,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export const updateUserProfile = async (userId, updates) => {
  // Convert camelCase to snake_case for database
  const dbUpdates = {}
  if (updates.subscriptionTier) dbUpdates.subscription_tier = updates.subscriptionTier
  if (updates.summariesUsed !== undefined) dbUpdates.summaries_used = updates.summariesUsed
  if (updates.summariesLimit !== undefined) dbUpdates.summaries_limit = updates.summariesLimit
  if (updates.apiKey) dbUpdates.api_key = updates.apiKey
  
  const { data, error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  // Convert snake_case to camelCase for frontend use
  return {
    id: data.id,
    userId: data.user_id,
    email: data.email,
    subscriptionTier: data.subscription_tier,
    summariesUsed: data.summaries_used,
    summariesLimit: data.summaries_limit,
    apiKey: data.api_key,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Summary functions
export const saveSummary = async (userId, summary) => {
  const { data, error } = await supabase
    .from('summaries')
    .insert([
      {
        user_id: userId,
        paper_url: summary.url,
        summary_text: summary.summaryText || summary.summary,
        date_created: new Date().toISOString(),
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  
  // Convert snake_case to camelCase for frontend use
  return {
    id: data.id,
    userId: data.user_id,
    url: data.paper_url,
    summaryText: data.summary_text,
    dateCreated: data.date_created,
  }
}

export const getUserSummaries = async (userId) => {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('user_id', userId)
    .order('date_created', { ascending: false })
  
  if (error) throw error
  
  // Convert snake_case to camelCase for frontend use
  return data.map(summary => ({
    id: summary.id,
    userId: summary.user_id,
    url: summary.paper_url,
    summaryText: summary.summary_text,
    dateCreated: summary.date_created,
  }))
}

export const deleteSummary = async (summaryId) => {
  const { error } = await supabase
    .from('summaries')
    .delete()
    .eq('id', summaryId)
  
  if (error) throw error
}

// Helper functions
const generateApiKey = () => {
  // Generate a random API key for the user
  return 'sk-' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Subscription functions
export const updateSubscription = async (userId, tier) => {
  const limits = {
    free: 5,
    basic: 50,
    premium: 999,
  }
  
  return await updateUserProfile(userId, {
    subscriptionTier: tier,
    summariesLimit: limits[tier],
  })
}

// Setup Supabase auth state change listener
export const setupAuthListener = (callback) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const profile = await getUserProfile(session.user.id)
      callback({ ...session.user, ...profile })
    } else if (event === 'SIGNED_OUT') {
      callback(null)
    }
  })
}

