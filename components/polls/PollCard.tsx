"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Eye, BarChart3, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Poll {
  id: string
  question: string
  options: { label: string; pct: number; selected?: boolean; votes?: number }[]
  status?: 'Active' | 'Draft' | 'Completed'
  meta?: string
  totalVotes?: number
  createdAt?: string
  author?: string
}

interface PollCardProps {
  poll: Poll
  onVote?: (pollId: string, optionIndex: number) => void
  onView?: (pollId: string) => void
  onShare?: (pollId: string) => void
  showResults?: boolean
  className?: string
}

const PollCard: React.FC<PollCardProps> = ({
  poll,
  onVote,
  onView,
  onShare,
  showResults = false,
  className
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    poll.options.findIndex(opt => opt.selected) ?? null
  )

  const handleOptionClick = (optionIndex: number) => {
    if (poll.status === 'Draft') return
    
    setSelectedOption(optionIndex)
    onVote?.(poll.id, optionIndex)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Draft':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatMeta = (meta: string) => {
    const parts = meta.split(' · ')
    return {
      author: parts[0] || 'Unknown',
      time: parts[1] || '',
      votes: parts[2] || '0 votes'
    }
  }

  const meta = poll.meta ? formatMeta(poll.meta) : { author: 'Unknown', time: '', votes: '0 votes' }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-primary-600 transition-colors">
            {poll.question}
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              getStatusColor(poll.status || 'Draft')
            )}>
              {poll.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{meta.votes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{meta.time}</span>
          </div>
          <span className="text-gray-500">by {meta.author}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Poll Options */}
        <div className="space-y-3">
          {poll.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "poll-option",
                selectedOption === index && "selected",
                poll.status === 'Draft' && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleOptionClick(index)}
            >
              <div className={cn(
                "poll-option-radio",
                selectedOption === index && "selected"
              )} />
              
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                {showResults && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="progress-bar flex-1">
                      <div
                        className="progress-fill"
                        style={{ 
                          width: `${option.pct}%`,
                          '--progress-width': `${option.pct}%`
                        } as React.CSSProperties}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium min-w-[3rem]">
                      {option.pct}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(poll.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          
          {showResults && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(poll.id)}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          
          {poll.status === 'Active' && !showResults && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(poll.id)}
              className="flex-1"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { PollCard }