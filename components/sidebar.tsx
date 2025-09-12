"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  BarChart3, 
  Plus, 
  FileText, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  Users,
  Clock,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Dashboard')

  const navigation = [
    { name: 'Dashboard', icon: BarChart3, href: '#', current: true },
    { name: 'Create Poll', icon: Plus, href: '#', current: false },
    { name: 'My Polls', icon: FileText, href: '#', current: false },
    { name: 'Analytics', icon: TrendingUp, href: '#', current: false },
  ]

  const quickActions = [
    { name: 'New Poll', icon: Plus, action: () => console.log('New Poll') },
    { name: 'Templates', icon: FileText, action: () => console.log('Templates') },
    { name: 'Export Data', icon: TrendingUp, action: () => console.log('Export') },
  ]

  const stats = [
    { label: 'Active Polls', value: '12', icon: BarChart3, color: 'text-primary-600' },
    { label: 'Total Votes', value: '1,234', icon: Users, color: 'text-success-600' },
    { label: 'This Week', value: '8', icon: Clock, color: 'text-orange-600' },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:border-r lg:border-gray-200 lg:bg-white xl:w-72">
      <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    activeItem === item.name
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveItem(item.name)
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </a>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.name}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={action.action}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {action.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Your Stats
            </h3>
            <div className="space-y-3">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Icon className={cn("h-4 w-4 mr-2", stat.color)} />
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", stat.color)}>
                      {stat.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">New poll created</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Poll received 50 votes</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Poll completed</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help & Support */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <HelpCircle className="mr-3 h-4 w-4" />
              Help & Support
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
