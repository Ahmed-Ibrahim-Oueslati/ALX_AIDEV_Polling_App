"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Download, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PollResult {
  id: string
  question: string
  options: { 
    label: string
    pct: number
    votes: number
    isWinner?: boolean
  }[]
  totalVotes: number
  status: 'Active' | 'Completed'
  createdAt: string
  author: string
}

interface PollResultsProps {
  poll: PollResult
  onShare?: (pollId: string) => void
  onExport?: (pollId: string) => void
  onRefresh?: (pollId: string) => void
  className?: string
}

const PollResults: React.FC<PollResultsProps> = ({
  poll,
  onShare,
  onExport,
  onRefresh,
  className
}) => {
  const winner = poll.options.find(opt => opt.isWinner)
  const maxVotes = Math.max(...poll.options.map(opt => opt.votes))

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {poll.question}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>by {poll.author}</span>
              <span>•</span>
              <span>{poll.totalVotes} total votes</span>
              <span>•</span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                poll.status === 'Active' 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-700"
              )}>
                {poll.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRefresh(poll.id)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(poll.id)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(poll.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Winner Announcement */}
        {winner && (
          <div className="bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold text-success-800">Winner!</h3>
                <p className="text-success-700">
                  <span className="font-medium">{winner.label}</span> is leading with {winner.pct}% of the votes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Results</h3>
          
          {poll.options
            .sort((a, b) => b.votes - a.votes)
            .map((option, index) => (
            <div key={option.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index === 0 
                      ? "bg-primary-500 text-white" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {index + 1}
                  </div>
                  <span className={cn(
                    "font-medium",
                    index === 0 ? "text-primary-700" : "text-gray-900"
                  )}>
                    {option.label}
                  </span>
                  {option.isWinner && (
                    <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">
                      Winner
                    </span>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {option.votes} votes
                  </div>
                  <div className="text-xs text-gray-500">
                    {option.pct}%
                  </div>
                </div>
              </div>
              
              <div className="progress-bar">
                <div
                  className={cn(
                    "progress-fill h-2",
                    index === 0 
                      ? "bg-gradient-to-r from-primary-500 to-primary-600" 
                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                  )}
                  style={{ 
                    width: `${option.pct}%`,
                    '--progress-width': `${option.pct}%`
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {poll.totalVotes}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Total Votes
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {poll.options.length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Options
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {winner?.pct || 0}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Leading
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((poll.totalVotes / poll.options.length) * 10) / 10}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Avg/Option
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PollResults }
