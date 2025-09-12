"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PollCard, type Poll } from '@/components/polls/PollCard'
import { CreatePoll } from '@/components/polls/CreatePoll'
import { PollResults } from '@/components/polls/PollResults'
import { Modal } from '@/components/ui/modal'
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  BarChart3,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const samplePolls: Poll[] = [
  {
    id: '1',
    question: 'Which programming language should we learn next?',
    status: 'Active',
    meta: 'Ahmed Ibrahim · 2 days ago · 127 votes',
    options: [
      { label: 'Rust', pct: 45, selected: true, votes: 57 },
      { label: 'Go', pct: 30, votes: 38 },
      { label: 'TypeScript', pct: 25, votes: 32 }
    ],
    totalVotes: 127,
    createdAt: '2 days ago',
    author: 'Ahmed Ibrahim'
  },
  {
    id: '2',
    question: 'Best code editor for 2025?',
    status: 'Draft',
    meta: 'Developer Team · 1 hour ago · 89 votes',
    options: [
      { label: 'Neovim (LazyVim)', pct: 65, votes: 58 },
      { label: 'VS Code', pct: 25, votes: 22 },
      { label: 'JetBrains IDEs', pct: 10, votes: 9 }
    ],
    totalVotes: 89,
    createdAt: '1 hour ago',
    author: 'Developer Team'
  },
  {
    id: '3',
    question: 'What is your preferred deployment platform?',
    status: 'Active',
    meta: 'DevOps Team · 3 hours ago · 203 votes',
    options: [
      { label: 'AWS', pct: 40, votes: 81 },
      { label: 'Google Cloud', pct: 35, votes: 71 },
      { label: 'Azure', pct: 25, votes: 51 }
    ],
    totalVotes: 203,
    createdAt: '3 hours ago',
    author: 'DevOps Team'
  }
]

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>(samplePolls)
  const [toast, setToast] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'completed'>('all')

  const handleVote = (pollId: string, optionIndex: number) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p
      const options = p.options.map((o, i) => ({ 
        ...o, 
        selected: i === optionIndex,
        votes: i === optionIndex ? (o.votes || 0) + 1 : o.votes || 0
      }))
      
      // Recalculate percentages
      const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
      const updatedOptions = options.map(opt => ({
        ...opt,
        pct: totalVotes > 0 ? Math.round((opt.votes || 0) / totalVotes * 100) : 0
      }))
      
      return { 
        ...p, 
        options: updatedOptions,
        totalVotes: totalVotes
      }
    }))
    setToast('Vote registered successfully!')
    setTimeout(() => setToast(null), 3000)
  }

  const handleCreatePoll = (pollData: { question: string; options: string[] }) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options.map(opt => ({ 
        label: opt, 
        pct: 0, 
        votes: 0 
      })),
      status: 'Active',
      meta: `You · just now · 0 votes`,
      totalVotes: 0,
      createdAt: 'just now',
      author: 'You'
    }
    
    setPolls(prev => [newPoll, ...prev])
    setShowCreateModal(false)
    setToast('Poll created successfully!')
    setTimeout(() => setToast(null), 3000)
  }

  const handleViewPoll = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId)
    if (poll) {
      setSelectedPoll(poll)
      setShowResultsModal(true)
    }
  }

  const handleSharePoll = (pollId: string) => {
    setToast('Share link copied to clipboard!')
    setTimeout(() => setToast(null), 3000)
  }

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || poll.status?.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    totalPolls: polls.length,
    activePolls: polls.filter(p => p.status === 'Active').length,
    totalVotes: polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
    avgVotesPerPoll: Math.round(polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0) / polls.length) || 0
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Engaging Polls
            <span className="block text-primary-600">Get Instant Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build interactive polls, gather real-time feedback, and make data-driven decisions with our modern polling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowCreateModal(true)}
              className="text-lg px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Poll
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPolls}</div>
          <div className="stat-label">Total Polls</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activePolls}</div>
          <div className="stat-label">Active Polls</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalVotes.toLocaleString()}</div>
          <div className="stat-label">Total Votes</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'active', 'draft', 'completed'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status as any)}
              className="capitalize whitespace-nowrap flex-shrink-0"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Polls Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {filterStatus === 'all' ? 'All Polls' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Polls`}
          </h2>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </div>

        {filteredPolls.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first poll to get started'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPolls.map(poll => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                onView={handleViewPoll}
                onShare={handleSharePoll}
                className="animate-in slide-up"
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Poll Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Poll"
        size="lg"
      >
        <CreatePoll
          onSubmit={handleCreatePoll}
          onSaveDraft={(pollData) => {
            console.log('Draft saved:', pollData)
            setToast('Draft saved successfully!')
            setTimeout(() => setToast(null), 3000)
          }}
        />
      </Modal>

      {/* Results Modal */}
      {selectedPoll && (
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title="Poll Results"
          size="lg"
        >
          <PollResults
            poll={{
              ...selectedPoll,
              totalVotes: selectedPoll.totalVotes || 0,
              options: selectedPoll.options.map(opt => ({
                ...opt,
                votes: opt.votes || 0,
                isWinner: opt.pct === Math.max(...selectedPoll.options.map(o => o.pct))
              }))
            }}
            onShare={handleSharePoll}
            onExport={(pollId) => {
              setToast('Export started!')
              setTimeout(() => setToast(null), 3000)
            }}
          />
        </Modal>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
