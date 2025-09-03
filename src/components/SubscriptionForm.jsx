import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { upgradeSubscription, PRICE_IDS } from '../services/stripe'
import { CreditCard, Loader, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const SubscriptionForm = ({ plan, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('You must be logged in to upgrade your subscription')
      return
    }

    setLoading(true)
    try {
      // In a real implementation, this would redirect to Stripe Checkout
      // For this demo, we'll just simulate the upgrade
      const session = await upgradeSubscription(user.id, plan.toLowerCase())
      
      // In a real implementation, we would redirect to the checkout URL
      // window.location.href = session.url
      
      // For this demo, we'll just simulate a successful upgrade
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSuccess) {
        onSuccess(plan)
      }
      
      toast.success(`Successfully upgraded to ${plan} plan!`)
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      toast.error('Failed to upgrade subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Upgrade to {plan}
          </div>
        )}
      </button>
      
      <div className="p-3 bg-gray-50 rounded-md flex items-start">
        <Shield className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600">
          Your payment information is securely processed by Stripe. ScholarSift does not store your credit card details.
        </p>
      </div>
    </div>
  )
}

export default SubscriptionForm

