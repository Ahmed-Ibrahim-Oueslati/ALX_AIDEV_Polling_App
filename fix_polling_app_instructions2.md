# AI Agent Instructions: Fix ALX_AIDEV_Polling_App Repository

## Overview
This repository has Git merge conflicts and dependency issues that need to be resolved. Follow these instructions in order to fix all issues.

---

## **URGENT FIXES FOR CURRENT ERRORS**

### Fix 1: Replace Geist font with Inter in layout.tsx
Your current layout.tsx is trying to use `Geist` font which is not available. Replace it with:

```tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Polling App',
  description: 'A Next.js polling application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### Fix 2: Update next.config.js (remove deprecated appDir)
Replace your next.config.js with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14+, no experimental flag needed
}

module.exports = nextConfig
```

### Fix 3: Quick command sequence to resolve immediately
Run these commands in order:

```bash
# Stop the dev server (Ctrl+C)
# Then run:
npm run build
npm run dev
```

---

## **PRIORITY 1: Fix Git Merge Conflicts**

### 1. Examine package.json file
- Look for Git merge conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
- Remove all conflict markers
- Choose the appropriate content (usually the HEAD version unless specified otherwise)
- Ensure valid JSON syntax

### 2. Check other files for merge conflicts
- Search all files for conflict markers using: `grep -r "<<<<<<< HEAD" .`
- Resolve any conflicts in component files, config files, etc.
- Remove all instances of `<<<<<<<`, `=======`, `>>>>>>>` markers

---

## **PRIORITY 2: Fix Package Dependencies**

### 3. Clean package.json
Replace the entire package.json content with:

```json
{
  "name": "poll-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tailwindcss/postcss": "^4.0.0-alpha.0",
    "autoprefixer": "^10.4.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^4.0.0-alpha.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## **PRIORITY 3: Fix PostCSS Configuration**

### 4. Update postcss.config.js
Create or replace postcss.config.js with:

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 5. Update globals.css (for Tailwind v4)
Replace the Tailwind imports in src/app/globals.css with:

```css
@import "tailwindcss";

/* Custom styles below */
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

* {
  box-sizing: border-box;
}
```

---

## **PRIORITY 4: Fix Build Configuration**

### 6. Check/Create next.config.js
Create or update next.config.js:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
```

### 7. Update tailwind.config.js for v4
Create or replace tailwind.config.js:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## **PRIORITY 5: Clean Installation**

### 8. Perform clean install
Execute these commands in order:

```bash
# Remove existing installations
rm -rf node_modules
rm -f package-lock.json

# Fresh install
npm install
```

---

## **PRIORITY 6: Fix TypeScript Issues**

### 9. Check/Create tsconfig.json
Create or replace tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## **PRIORITY 7: Verify File Structure**

### 10. Ensure proper Next.js 13+ app structure
The project should have this structure:

```
project-root/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── components/ (optional)
│   ├── components/ (optional)
│   └── lib/ (optional)
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

### 11. Create missing essential files if needed

**src/app/layout.tsx:**
```tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Polling App',
  description: 'A Next.js polling application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

**src/app/page.tsx:**
```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center">Polling App</h1>
      <p className="text-center mt-4">Welcome to your polling application!</p>
    </main>
  )
}
```

---

## **PRIORITY 8: Test and Validate**

### 12. Run validation commands
Execute these commands to ensure everything works:

```bash
# Check for syntax errors
npm run lint

# Test build process
npm run build

# Start development server
npm run dev
```

### 13. Fix any remaining errors
- If lint errors occur, fix them according to the error messages
- If build errors occur, check for missing dependencies or syntax issues
- If dev server fails, check for port conflicts or configuration issues

---

## **PRIORITY 9: Final Git Operations**

### 14. Commit resolved changes
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Fix merge conflicts, update dependencies, and resolve build issues"

# Push to main branch
git push origin main
```

---

## **Expected Results**

After completing all steps, the repository should:
- ✅ Have no merge conflicts
- ✅ Build successfully with Next.js 15.5.3
- ✅ Have proper Tailwind CSS v4 integration
- ✅ Run without npm errors
- ✅ Start development server on `npm run dev`
- ✅ Pass linting checks
- ✅ Have clean, committed code

---

## **Troubleshooting**

If issues persist:

1. **Still getting merge conflict errors?**
   - Manually search for `<<<<<<<` in all files
   - Use VS Code's merge conflict resolution tools

2. **Dependency issues?**
   - Try `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json` again
   - Run `npm install` again

3. **Build errors?**
   - Check that all import statements are correct
   - Ensure file extensions match (.tsx for React components)
   - Verify all dependencies are installed

4. **Tailwind not working?**
   - Ensure `@import "tailwindcss";` is in globals.css
   - Check that content paths in tailwind.config.js match your file structure
   - Restart the development server after config changes

Execute these instructions step by step, and the polling app will be fully functional and ready for development.