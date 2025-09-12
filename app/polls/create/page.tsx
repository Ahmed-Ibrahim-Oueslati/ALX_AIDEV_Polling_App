"use client"

import '../../exemple.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, X, Calendar, Users, Clock, Eye, EyeOff, Share2, Settings, ChevronDown, AlertCircle, CheckCircle, Image } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { createPollAction } from '@/lib/actions/poll-actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { debounce } from 'lodash';

const categories = [
  'General', 'Entertainment', 'Sports', 'Technology', 'Politics', 
  'Education', 'Health', 'Business', 'Lifestyle', 'Science'
];

const pollTypes = [
  { value: 'single', label: 'Single Choice', description: 'Voters can select only one option' },
  { value: 'multiple', label: 'Multiple Choice', description: 'Voters can select multiple options' },
  { value: 'ranking', label: 'Ranking', description: 'Voters rank options in order of preference' }
];

const showResultsOptions = [
  { value: 'after_vote', label: 'After voting' },
  { value: 'immediately', label: 'Show results immediately' },
  { value: 'after_end', label: 'Only after poll ends' },
  { value: 'never', label: 'Never show results publicly' }
];

export default function CreatePollPage() {
  const router = useRouter()
  const barsRef = useRef<HTMLDivElement | null>(null)
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    pollType: 'single',
    isPrivate: false,
    allowComments: true,
    requireAuth: false,
    endDate: '',
    endTime: '',
    maxVotes: '',
    allowAddOptions: false,
    showResults: 'after_vote',
    category: '',
    tags: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Debounced validation to improve performance
  const debouncedValidation = useCallback(
    debounce((data) => {
      const newErrors: Record<string, string> = {};

      if (!data.title.trim()) {
        newErrors.title = 'Poll title is required';
      } else if (data.title.length > 200) {
        newErrors.title = 'Title must be less than 200 characters';
      }

      if (data.description.length > 1000) {
        newErrors.description = 'Description must be less than 1000 characters';
      }

      const validOptions = data.options.filter(option => option.trim());
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }

      if (data.endDate && new Date(data.endDate + ' ' + (data.endTime || '23:59')) <= new Date()) {
        newErrors.endDate = 'End date must be in the future';
      }

      if (data.maxVotes && (isNaN(Number(data.maxVotes)) || parseInt(data.maxVotes) < 1)) {
        newErrors.maxVotes = 'Max votes must be a positive number';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, 300),
    []
  );

  // Optimized option management functions with validation
  const addOption = useCallback(() => {
    if (pollData.options.length < 10) {
      setPollData(prev => {
        const newData = {
          ...prev,
          options: [...prev.options, '']
        };
        debouncedValidation(newData);
        return newData;
      });
    } else {
      setToast('Maximum 10 options allowed');
      setTimeout(() => setToast(null), 1800);
    }
  }, [pollData.options.length, debouncedValidation]);

  const removeOption = useCallback((index: number) => {
    if (pollData.options.length > 2) {
      setPollData(prev => {
        const newData = {
          ...prev,
          options: prev.options.filter((_, i) => i !== index)
        };
        debouncedValidation(newData);
        return newData;
      });
    }
  }, [pollData.options.length, debouncedValidation]);

  const updateOption = useCallback((index: number, value: string) => {
    setPollData(prev => {
      const newData = {
        ...prev,
        options: prev.options.map((option, i) => i === index ? value : option)
      };
      debouncedValidation(newData);
      return newData;
    });
  }, [debouncedValidation]);

  // Enhanced tag management with validation and feedback
  const addTag = useCallback(() => {
    const trimmedTag = currentTag.trim();
    if (!trimmedTag) {
      setToast('Tag cannot be empty');
    } else if (pollData.tags.includes(trimmedTag)) {
      setToast('Tag already exists');
    } else if (pollData.tags.length >= 5) {
      setToast('Maximum 5 tags allowed');
    } else {
      setPollData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setCurrentTag('');
    }
    setTimeout(() => setToast(null), 1800);
  }, [currentTag, pollData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setPollData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  // Optimized form submission with better error handling and feedback
  const handleSubmit = async () => {
    const isValid = await debouncedValidation(pollData);
    if (!isValid) {
      setToast('Please fix the errors before submitting');
      setTimeout(() => setToast(null), 1800);
      return;
    }

    setIsSubmitting(true);
    setToast('Creating poll...');
    
    try {
      // Optimistic UI update
      const validOptions = pollData.options.filter(option => option.trim());
      
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 900));
      
      const result = await createPollAction(pollData.title, validOptions);
      
      if (result?.error) {
        setErrors({ submit: result.error });
        setToast('Failed to create poll: ' + result.error);
      } else {
        setToast('Poll created successfully!');
        // Delay redirect for toast visibility
        setTimeout(() => router.push('/polls'), 1000);
      }
    } catch (error) {
      console.error('Poll creation error:', error);
      setErrors({ submit: 'Failed to create poll. Please try again.' });
      setToast('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  // Enhanced animation effect with cleanup
  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;

    const bars = Array.from(el.querySelectorAll<HTMLDivElement>('.option-bar'));
    const animations: number[] = [];

    bars.forEach((bar, i) => {
      const target = bar.getAttribute('data-target') || '0%';
      bar.style.width = '0%';
      
      animations.push(
        setTimeout(() => {
          bar.style.transition = 'width 600ms ease';
          bar.style.width = target;
        }, 100 + i * 120)
      );
    });

    // Cleanup function to clear timeouts
    return () => {
      animations.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [pollData.options]);

  const PollPreview = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Poll Preview</h3>
        <button
          onClick={() => setPreviewMode(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="border rounded-lg p-4">
        <h4 className="text-xl font-bold mb-2">{pollData.title || 'Poll Title'}</h4>
        {pollData.description && (
          <p className="text-gray-600 mb-4">{pollData.description}</p>
        )}
        
        <div className="space-y-3">
          {pollData.options.filter(opt => opt.trim()).map((option, index) => (
            <div key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
              {pollData.pollType === 'single' ? (
                <input type="radio" name="poll-preview" className="mr-3" />
              ) : pollData.pollType === 'multiple' ? (
                <input type="checkbox" className="mr-3" />
              ) : (
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {index + 1}
                </span>
              )}
              <span>{option}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              0 votes
            </span>
            {pollData.endDate && (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Ends {new Date(pollData.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Vote
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create a New Poll</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design engaging polls to gather opinions, make decisions, or simply have fun with your audience.
          </p>
        </div>

        {previewMode && <PollPreview />}

        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="bg-white rounded-xl shadow-lg">
            <CardHeader className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  1
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">
                    Poll Title *
                  </Label>
                  <Input
                    id="title"
                    value={pollData.title}
                    onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's your question?"
                    maxLength={200}
                    className={`w-full px-4 py-3 rounded-lg ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title && (
                      <span className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </span>
                    )}
                    <span className="text-gray-400 text-sm ml-auto">
                      {pollData.title.length}/200
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </Label>
                  <textarea
                    id="description"
                    value={pollData.description}
                    onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add more context to help people understand your poll..."
                    rows={3}
                    maxLength={1000}
                    className={`w-full px-4 py-3 border rounded-lg resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                      <span className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </span>
                    )}
                    <span className="text-gray-400 text-sm ml-auto">
                      {pollData.description.length}/1000
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={pollData.category}
                      onChange={(e) => setPollData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-sm font-medium text-gray-700 mb-2">
                      Tags (Optional)
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        maxLength={20}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!currentTag.trim() || pollData.tags.length >= 5}
                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {pollData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pollData.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Poll Options Card */}
          <Card className="bg-white rounded-xl shadow-lg">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    2
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">Poll Options</CardTitle>
                </div>
                
                <select
                  value={pollData.pollType}
                  onChange={(e) => setPollData(prev => ({ ...prev, pollType: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {pollTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {pollData.pollType && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {pollTypes.find(t => t.value === pollData.pollType)?.description}
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-3">
                {pollData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {pollData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {errors.options && (
                <div className="mt-2 text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.options}
                </div>
              )}

              {pollData.options.length < 10 && (
                <Button
                  type="button"
                  onClick={addOption}
                  className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option ({pollData.options.length}/10)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card className="bg-white rounded-xl shadow-lg">
            <CardHeader className="p-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    3
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">Advanced Settings</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </CardHeader>

            {showAdvanced && (
              <CardContent className="p-6 space-y-6 pl-11">
                {/* Privacy & Access */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy & Access</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pollData.isPrivate}
                        onChange={(e) => setPollData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">Private Poll</span>
                        <p className="text-sm text-gray-500">Only people with the link can access this poll</p>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pollData.requireAuth}
                        onChange={(e) => setPollData(prev => ({ ...prev, requireAuth: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">Require Authentication</span>
                        <p className="text-sm text-gray-500">Users must be logged in to vote</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Voting Options */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Voting Options</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Maximum Votes (Optional)
                      </Label>
                      <Input
                        type="number"
                        value={pollData.maxVotes}
                        onChange={(e) => setPollData(prev => ({ ...prev, maxVotes: e.target.value }))}
                        placeholder="Unlimited"
                        className={errors.maxVotes ? 'border-red-500' : ''}
                        min="1"
                      />
                      {errors.maxVotes && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.maxVotes}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Show Results
                      </Label>
                      <select
                        value={pollData.showResults}
                        onChange={(e) => setPollData(prev => ({ ...prev, showResults: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      >
                        {showResultsOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pollData.allowAddOptions}
                        onChange={(e) => setPollData(prev => ({ ...prev, allowAddOptions: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">Allow voters to add options</span>
                        <p className="text-sm text-gray-500">Participants can suggest new poll options</p>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pollData.allowComments}
                        onChange={(e) => setPollData(prev => ({ ...prev, allowComments: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">Allow comments</span>
                        <p className="text-sm text-gray-500">Let people discuss the poll in comments</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Timing */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Poll Duration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </Label>
                      <Input
                        type="date"
                        value={pollData.endDate}
                        onChange={(e) => setPollData(prev => ({ ...prev, endDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.endDate ? 'border-red-500' : ''}
                      />
                      {errors.endDate && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.endDate}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        End Time (Optional)
                      </Label>
                      <Input
                        type="time"
                        value={pollData.endTime}
                        onChange={(e) => setPollData(prev => ({ ...prev, endTime: e.target.value }))}
                        disabled={!pollData.endDate}
                        className="disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Hide Preview' : 'Preview Poll'}
            </Button>
            
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Poll...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Poll
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Great Polls</h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Keep your question clear and specific to avoid confusion</li>
            <li>• Provide balanced options that cover all reasonable viewpoints</li>
            <li>• Use descriptive titles that help people find your poll</li>
            <li>• Consider setting an end date for time-sensitive decisions</li>
            <li>• Enable comments to encourage discussion and engagement</li>
          </ul>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}