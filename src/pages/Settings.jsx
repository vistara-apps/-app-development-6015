import { useAuth } from '../contexts/AuthContext'
import { User, Crown, Zap, Check, CreditCard, Key, Shield, Loader, Receipt } from 'lucide-react'
import { useState } from 'react'
import SubscriptionForm from '../components/SubscriptionForm'
import BillingHistory from '../components/BillingHistory'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateUser, upgradeSubscription, logout, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const subscriptionPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      summaries: 5,
      features: ['5 summaries per month', 'Basic paper analysis', 'Web interface'],
      current: user?.subscriptionTier === 'free',
      recommended: false
    },
    {
      name: 'Basic',
      price: '$10',
      period: 'month',
      summaries: 50,
      features: ['50 summaries per month', 'Advanced analysis', 'Priority support', 'Export options'],
      current: user?.subscriptionTier === 'basic',
      recommended: true
    },
    {
      name: 'Premium',
      price: '$25',
      period: 'month',
      summaries: 'Unlimited',
      features: ['Unlimited summaries', 'Advanced AI insights', 'API access', 'Zotero integration', 'Priority support'],
      current: user?.subscriptionTier === 'premium',
      recommended: false
    }
  ]

  const handleUpgrade = async (planName) => {
    setLoading(true)
    try {
      await upgradeSubscription(planName.toLowerCase())
      toast.success(`Successfully upgraded to ${planName} plan!`)
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const regenerateApiKey = async () => {
    if (!window.confirm('Are you sure you want to regenerate your API key? This will invalidate your current key.')) {
      return
    }
    
    setLoading(true)
    try {
      const newApiKey = 'sk-' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      await updateUser({ apiKey: newApiKey })
      toast.success('API key regenerated successfully')
      setShowApiKey(true)
    } catch (error) {
      toast.error('Failed to regenerate API key. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || authLoading

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Settings</h2>
        <p className="mt-2 text-gray-600">
          Manage your account and subscription preferences
        </p>
      </div>

      {/* Account Information */}
      <div className="card">
        <div className="flex items-center mb-6">
          <User className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Plan
            </label>
            <div className="flex items-center space-x-2">
              <span className="capitalize font-medium text-primary">
                {user?.subscriptionTier}
              </span>
              {user?.subscriptionTier === 'premium' && (
                <Crown className="w-4 h-4 text-accent" />
              )}
            </div>
          </div>
        </div>

        {/* API Key (for Basic and Premium plans) */}
        {user?.subscriptionTier !== 'free' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <Key className="w-5 h-5 text-primary mr-2" />
              <h4 className="text-md font-medium text-gray-900">API Key</h4>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={user?.apiKey || ''}
                    readOnly
                    className="input-field pr-24 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-primary hover:underline"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Use this key to access the ScholarSift API. Keep it secret!
                </p>
              </div>
              <button
                onClick={regenerateApiKey}
                disabled={isLoading}
                className="btn-secondary text-sm h-10"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={logout}
            disabled={isLoading}
            className="btn-secondary"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Please wait...
              </div>
            ) : (
              'Sign Out'
            )}
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Zap className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Subscription Plans</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border rounded-lg p-6 ${
                plan.current
                  ? 'border-primary bg-primary/5'
                  : plan.recommended
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                    Recommended
                  </span>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== '$0' && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {typeof plan.summaries === 'number' 
                    ? `${plan.summaries} summaries/month`
                    : `${plan.summaries} summaries`
                  }
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <button
                  disabled
                  className="w-full py-2 px-4 rounded-md font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <SubscriptionForm 
                  plan={plan.name} 
                  onSuccess={(tier) => handleUpgrade(tier)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start">
          <Shield className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">
              Your payment information is securely processed by Stripe. ScholarSift does not store your credit card details.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You can cancel your subscription at any time from this page.
            </p>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Usage Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">{user?.summariesUsed || 0}</div>
            <div className="text-sm text-gray-600">Summaries Used</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-secondary">{user?.summariesLimit || 0}</div>
            <div className="text-sm text-gray-600">Monthly Limit</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-accent">
              {(user?.summariesLimit || 0) - (user?.summariesUsed || 0)}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Monthly Usage</span>
            <span>{user?.summariesUsed || 0} / {user?.summariesLimit || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(((user?.summariesUsed || 0) / (user?.summariesLimit || 1)) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Billing History */}
      {user?.subscriptionTier !== 'free' && (
        <div className="card">
          <div className="flex items-center mb-6">
            <Receipt className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
          </div>
          
          <BillingHistory />
        </div>
      )}
    </div>
  )
}

export default Settings
