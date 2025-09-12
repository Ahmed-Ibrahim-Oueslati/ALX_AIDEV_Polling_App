'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import PollCard from '@/components/polls/PollCard'

interface Poll {
  id: string
  question: string
  options: { text: string; votes: number }[]
  createdAt: string
  createdBy: string
  isMultipleChoice: boolean
  expiresAt?: string
}

export default function PollsPage() {
  // This will be replaced with actual data fetching
  const polls: Poll[] = [
    {
      id: '1',
      question: 'What is your favorite programming language?',
      options: [
        { text: 'JavaScript', votes: 10 },
        { text: 'Python', votes: 15 },
        { text: 'Java', votes: 8 },
        { text: 'C++', votes: 5 },
      ],
      createdAt: '2024-03-01',
      createdBy: 'john@example.com',
      isMultipleChoice: false,
    },
  ]

  const handleVote = (pollId: string, optionId: string) => {
    console.log(`Voted on poll ${pollId} for option ${optionId}`)
    // In a real app, you would send this to your backend
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Active Polls</h1>
          <p className="text-muted-foreground">Click on a poll to view details and cast your vote.</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} onVote={handleVote} />
        ))}
      </div>
    </div>
  )
}