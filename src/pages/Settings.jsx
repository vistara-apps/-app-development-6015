import { useAuth } from '../contexts/AuthContext'
import { User, Crown, Zap, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateUser, logout } = useAuth()
  const [loading, setLoading] = useState(false)

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
      // Mock upgrade process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newLimits = {
        free: 5,
        basic: 50,
        premium: 999
      }
      
      updateUser({
        subscriptionTier: planName.toLowerCase(),
        summariesLimit: newLimits[planName.toLowerCase()],
        summariesUsed: Math.min(user.summariesUsed, newLimits[planName.toLowerCase()])
      })
      
      toast.success(`Successfully upgraded to ${planName} plan!`)
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="btn-secondary"
          >
            Sign Out
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

              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.current || loading}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  plan.current
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : plan.recommended
                    ? 'bg-accent text-white hover:opacity-90'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
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
    </div>
  )
}

export default Settings