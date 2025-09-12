"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, Save, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PollOption {
  id: string
  label: string
}

interface CreatePollProps {
  onSubmit?: (poll: { question: string; options: string[] }) => void
  onSaveDraft?: (poll: { question: string; options: string[] }) => void
  className?: string
}

const CreatePoll: React.FC<CreatePollProps> = ({
  onSubmit,
  onSaveDraft,
  className
}) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', label: '' },
    { id: '2', label: '' }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ question?: string; options?: string }>({})

  const addOption = () => {
    const newId = (Math.max(...options.map(o => parseInt(o.id))) + 1).toString()
    setOptions([...options, { id: newId, label: '' }])
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) return
    setOptions(options.filter(opt => opt.id !== id))
  }

  const updateOption = (id: string, label: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, label } : opt
    ))
  }

  const validateForm = () => {
    const newErrors: { question?: string; options?: string } = {}
    
    if (!question.trim()) {
      newErrors.question = 'Question is required'
    }
    
    const validOptions = options.filter(opt => opt.label.trim())
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (isDraft = false) => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const validOptions = options
        .filter(opt => opt.label.trim())
        .map(opt => opt.label.trim())
      
      const pollData = {
        question: question.trim(),
        options: validOptions
      }
      
      if (isDraft) {
        onSaveDraft?.(pollData)
      } else {
        onSubmit?.(pollData)
      }
      
      // Reset form after successful submission
      if (!isDraft) {
        setQuestion('')
        setOptions([
          { id: '1', label: '' },
          { id: '2', label: '' }
        ])
      }
    } catch (error) {
      console.error('Error submitting poll:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create New Poll
        </CardTitle>
        <p className="text-gray-600">
          Create engaging polls and gather insights from your audience
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Input */}
        <div className="space-y-2">
          <Label htmlFor="question" required>
            Poll Question
          </Label>
          <Input
            id="question"
            placeholder="What would you like to ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            error={errors.question}
            className="text-lg"
          />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Label required>Poll Options</Label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.label}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    className="h-10 w-10 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {errors.options && (
            <p className="text-sm text-red-600">{errors.options}</p>
          )}
          
          <Button
            variant="outline"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          <Button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Publishing...' : 'Publish Poll'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { CreatePoll }
