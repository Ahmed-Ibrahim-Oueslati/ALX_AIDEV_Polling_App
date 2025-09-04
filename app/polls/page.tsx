'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Poll {
  id: string
  question: string
  options: string[]
  votes: number[]
  createdAt: string
  createdBy: string
}

export default function PollsPage() {
  // This will be replaced with actual data fetching
  const polls: Poll[] = [
    {
      id: '1',
      question: 'What is your favorite programming language?',
      options: ['JavaScript', 'Python', 'Java', 'C++'],
      votes: [10, 15, 8, 5],
      createdAt: '2024-03-01',
      createdBy: 'john@example.com'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Active Polls</h1>
          <p className="text-gray-500">Click on a poll to view details and cast your vote.</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="bg-white rounded-lg border shadow-md transition-shadow hover:shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{poll.question}</h2>
              <div className="space-y-3">
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{option}</span>
                    <span className="font-semibold text-gray-600">
                      {poll.votes[index]} votes
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                <Link
                  href={`/polls/${poll.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View & Vote
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}