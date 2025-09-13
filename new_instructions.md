# AI IDE Instructions: Transform Polling App to Modern Tailwind UI

## Overview
Transform the existing Next.js polling application from LazyVim theme to a modern, clean UI using Tailwind CSS with excellent user experience and working functionality.

## 1. Dependencies and Setup

### Install Required Packages
```bash
npm install @tailwindcss/forms @headlessui/react @heroicons/react lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Update tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
```

## 2. Remove LazyVim Theme

### Clean Up Existing Styles
- Remove all LazyVim related CSS files and imports
- Delete any vim-specific styling components
- Remove terminal/editor themed components
- Clean up any monospace/code editor specific styling

### Update globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 3. Core UI Components Structure

### Create components/ui/ directory with:

#### Button Component (components/ui/Button.tsx)
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}
```

#### Card Component (components/ui/Card.tsx)
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
```

#### Input Component (components/ui/Input.tsx)
```typescript
interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
```

#### Modal Component (components/ui/Modal.tsx)
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

## 4. Polling App Specific Components

### PollCard Component
Create a modern poll display card with:
- Clean title display
- Option buttons with hover effects
- Vote count visualization (progress bars)
- Results toggle functionality
- Responsive design

### CreatePoll Component
Create poll creation form with:
- Title input field
- Dynamic option addition/removal
- Form validation
- Submit with loading state
- Success/error feedback

### PollResults Component
Create results display with:
- Animated progress bars
- Vote percentages
- Total vote count
- Visual hierarchy for winner
- Share functionality

### PollList Component
Create poll listing with:
- Grid/list layout toggle
- Search functionality
- Filter options (active, completed, created by user)
- Pagination
- Loading states

## 5. Layout and Navigation

### Update Layout Structure
```typescript
// app/layout.tsx structure:
- Header with logo, navigation, user menu
- Main content area with proper spacing
- Footer with links
- Responsive sidebar for mobile
```

### Navigation Items
- Home (poll listing)
- Create Poll
- My Polls
- Profile
- About

### Header Design
- Clean, minimal design
- Logo on left
- Navigation in center
- User actions on right
- Mobile hamburger menu

## 6. Page Implementations

### Home Page (app/page.tsx)
- Hero section with call-to-action
- Featured/recent polls grid
- Quick stats (total polls, votes, users)
- Search bar
- Category filters

### Create Poll Page (app/create/page.tsx)
- Step-by-step form wizard
- Real-time preview
- Validation feedback
- Save as draft option
- Publish settings

### Poll Detail Page (app/poll/[id]/page.tsx)
- Poll display with voting interface
- Results with animations
- Comments section
- Share options
- Edit option (if owner)

### My Polls Page (app/my-polls/page.tsx)
- User's created polls
- Analytics/stats
- Edit/delete options
- Draft polls
- Poll status management

## 7. Interactive Features

### Voting System
- Single-choice radio buttons
- Multi-choice checkboxes
- Real-time vote updates
- Vote confirmation
- Results reveal animation

### Real-time Updates
- WebSocket connection for live results
- Vote count updates
- New poll notifications
- User activity indicators

### Progressive Enhancement
- Works without JavaScript
- Enhanced with JS interactions
- Offline capability
- Loading states
- Error boundaries

## 8. UI/UX Enhancements

### Animations
- Page transitions
- Button hover effects
- Card hover elevations
- Progress bar animations
- Loading spinners
- Success confirmations

### Responsive Design
- Mobile-first approach
- Tablet breakpoints
- Desktop optimizations
- Touch-friendly interactions
- Keyboard navigation

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus indicators

### Visual Design
- Consistent color palette
- Proper typography hierarchy
- Adequate whitespace
- Visual feedback for actions
- Intuitive iconography

## 9. State Management

### Use React Hooks for:
- Poll data management
- User authentication state
- Loading states
- Error handling
- Form state

### Local Storage
- Save draft polls
- User preferences
- Voting history
- Theme preferences

## 10. API Integration

### Ensure Working Functions for:
- Create poll endpoint
- Vote submission
- Fetch polls
- User authentication
- Poll management (edit/delete)
- Results retrieval

### Error Handling
- Network errors
- Validation errors
- Authentication errors
- Rate limiting
- Graceful fallbacks

## 11. Performance Optimizations

### Implement:
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Bundle optimization
- SEO meta tags

## 12. Testing Considerations

### Ensure:
- All buttons work correctly
- Forms submit properly
- Voting mechanism functions
- Results display accurately
- Responsive behavior
- Error states handle gracefully

## 13. Final Polish

### Before completion:
- Test all user flows
- Verify responsive design
- Check accessibility
- Optimize performance
- Add loading states
- Implement proper error handling
- Add success notifications
- Ensure smooth animations

## Expected Outcome
A modern, professional polling application with:
- Clean, intuitive interface
- Smooth interactions and animations
- Full functionality for creating and voting on polls
- Responsive design for all devices
- Excellent user experience
- Professional visual design
- Fast performance
- Accessibility compliance