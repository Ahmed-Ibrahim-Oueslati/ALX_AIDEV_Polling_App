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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">{poll.question}</h2>
            <div className="mt-4 space-y-2">
              {poll.options.map((option, index) => (
                <div key={index} className="flex justify-between">
                  <span>{option}</span>
                  <span className="text-gray-500">
                    {poll.votes[index]} votes
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
              <Link
                href={`/polls/${poll.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}