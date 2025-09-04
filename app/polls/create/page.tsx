'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPollAction } from '@/lib/actions/poll-actions'

export default function CreatePollPage() {
  const router = useRouter()
  const [options, setOptions] = useState<string[]>(['', ''])
  const [error, setError] = useState<string | null>(null)

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setError('A poll must have at least 2 options')
      return
    }
    setError(null)
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (formData: FormData) => {
    const question = formData.get('question') as string

    if (!question.trim()) {
      setError('Question is required')
      return
    }

    const validOptions = options.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      setError('At least 2 valid options are required')
      return
    }

    try {
      const result = await createPollAction(question, validOptions)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/polls')
      }
    } catch (error) {
      setError('Failed to create poll. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Create New Poll</h1>
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            name="question"
            placeholder="What is your question?"
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Options</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border hover:border-blue-400 transition">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Remove Option ${index + 1}`}
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddOption}
            aria-label="Add Option"
          >
            + Add Option
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex gap-4">
          <Button type="submit">Create Poll</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}