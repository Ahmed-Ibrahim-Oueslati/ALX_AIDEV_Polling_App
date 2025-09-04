import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Users, Clock, Eye, EyeOff, Share2, Settings, ChevronDown, AlertCircle, CheckCircle, Image, Trash2 } from 'lucide-react';

const CreatePollPage = () => {
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
    tags: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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

  const addOption = () => {
    if (pollData.options.length < 10) {
      setPollData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !pollData.tags.includes(currentTag.trim()) && pollData.tags.length < 5) {
      setPollData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPollData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!pollData.title.trim()) {
      newErrors.title = 'Poll title is required';
    } else if (pollData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (pollData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    const validOptions = pollData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    if (pollData.endDate && new Date(pollData.endDate + ' ' + (pollData.endTime || '23:59')) <= new Date()) {
      newErrors.endDate = 'End date must be in the future';
    }

    if (pollData.maxVotes && (isNaN(pollData.maxVotes) || parseInt(pollData.maxVotes) < 1)) {
      newErrors.maxVotes = 'Max votes must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call
      const pollPayload = {
        ...pollData,
        options: pollData.options.filter(option => option.trim()),
        endDateTime: pollData.endDate && pollData.endTime ? 
          new Date(pollData.endDate + ' ' + pollData.endTime).toISOString() : null
      };
      
      console.log('Creating poll:', pollPayload);
      
      // Show success message or redirect
      alert('Poll created successfully!');
      
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Error creating poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create a New Poll</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design engaging polls to gather opinions, make decisions, or simply have fun with your audience.
          </p>
        </div>

        {/* Preview Modal */}
        {previewMode && <PollPreview />}

        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>

            {/* Poll Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Title *
              </label>
              <input
                type="text"
                value={pollData.title}
                onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's your favorite programming language?"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={200}
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

            {/* Poll Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={pollData.description}
                onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add more context to help people understand your poll..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={1000}
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

            {/* Category and Tags */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={pollData.category}
                  onChange={(e) => setPollData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim() || pollData.tags.length >= 5}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
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

          {/* Poll Options Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Poll Options</h2>
              </div>
              
              {/* Poll Type Selector */}
              <select
                value={pollData.pollType}
                onChange={(e) => setPollData(prev => ({ ...prev, pollType: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {pollTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {pollData.pollType && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {pollTypes.find(t => t.value === pollData.pollType)?.description}
                </p>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3">
              {pollData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={100}
                  />
                  {pollData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

            {/* Add Option Button */}
            {pollData.options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option ({pollData.options.length}/10)
              </button>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full mb-4 text-left"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  3
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Advanced Settings</h2>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="space-y-6 pl-11">
                {/* Privacy & Access */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy & Access</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pollData.isPrivate}
                        onChange={(e) => setPollData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Votes (Optional)
                      </label>
                      <input
                        type="number"
                        value={pollData.maxVotes}
                        onChange={(e) => setPollData(prev => ({ ...prev, maxVotes: e.target.value }))}
                        placeholder="Unlimited"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.maxVotes ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Show Results
                      </label>
                      <select
                        value={pollData.showResults}
                        onChange={(e) => setPollData(prev => ({ ...prev, showResults: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={pollData.endDate}
                        onChange={(e) => setPollData(prev => ({ ...prev, endDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endDate && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.endDate}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time (Optional)
                      </label>
                      <input
                        type="time"
                        value={pollData.endTime}
                        onChange={(e) => setPollData(prev => ({ ...prev, endTime: e.target.value }))}
                        disabled={!pollData.endDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Hide Preview' : 'Preview Poll'}
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Poll...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Poll
                </>
              )}
            </button>
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
    </div>
  );
};

export default CreatePollPage;