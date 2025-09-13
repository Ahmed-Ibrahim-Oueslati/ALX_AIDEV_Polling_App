'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
          <h1 className="text-4xl font-bold gradient-text">Active Polls</h1>
          <p className="text-muted-foreground">Click on a poll to view details and cast your vote.</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle>{poll.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{option}</span>
                  <span className="font-semibold text-muted-foreground">
                    {poll.votes[index]} votes
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
              <Link
                href={`/polls/${poll.id}`}
                className="text-primary hover:underline font-semibold"
              >
                View & Vote
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}