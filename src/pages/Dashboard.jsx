import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { Sparkles, BookOpen, TrendingUp, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const { summaries } = useApp()

  const stats = [
    {
      name: 'Total Summaries',
      value: user?.summariesUsed || 0,
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-blue-50'
    },
    {
      name: 'This Month',
      value: Math.min(user?.summariesUsed || 0, 12),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-green-50'
    },
    {
      name: 'Remaining',
      value: (user?.summariesLimit || 0) - (user?.summariesUsed || 0),
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-yellow-50'
    }
  ]

  const recentSummaries = summaries.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Track your research progress and manage your paper summaries
          </p>
        </div>
        <Link
          to="/summarize"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Summarize Paper
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Current Plan: <span className="capitalize text-primary">{user?.subscriptionTier}</span>
            </h3>
            <p className="text-gray-600 mt-1">
              {user?.summariesUsed}/{user?.summariesLimit} summaries used this month
            </p>
          </div>
          <div className="flex space-x-4">
            {user?.subscriptionTier === 'free' && (
              <Link to="/settings" className="btn-primary">
                Upgrade Plan
              </Link>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((user?.summariesUsed || 0) / (user?.summariesLimit || 1) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Quick Summarize</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get instant insights from any research paper URL or DOI
          </p>
          <Link to="/summarize" className="btn-primary w-full">
            Start Summarizing
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 text-secondary mr-2" />
            <h3 className="text-lg font-medium text-gray-900">My Library</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Access all your saved summaries and manage your research library
          </p>
          <Link to="/library" className="btn-secondary w-full">
            View Library
          </Link>
        </div>
      </div>

      {/* Recent Summaries */}
      {recentSummaries.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Summaries</h3>
            <Link to="/library" className="text-primary hover:underline text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentSummaries.map((summary, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <a
                      href={summary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Research Paper #{index + 1}
                    </a>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {summary.summaryText.slice(0, 120)}...
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(summary.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard