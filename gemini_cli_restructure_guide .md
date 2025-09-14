# Gemini CLI Guide: Restructure ALX Polly Repository

This guide will help you use Gemini CLI to restructure your repository, moving the `alx-polly/` subfolder to become the main project and replacing the current poll app directory structure.

## 🎯 Goal
Move contents from `alx-polly/` subdirectory to root level and clean up the repository structure to have ALX Polly as the main project.

## 📋 Prerequisites

Before starting, ensure you have:
- Gemini CLI installed and configured
- Git repository cloned locally
- Backup of your current work (just in case)

## 🚀 Step-by-Step Instructions

### Step 1: Analyze Current Repository Structure

First, let's understand what we're working with:

```bash
# Navigate to your repository
cd ALX_AIDEV_Polling_App

# Check current structure
ls -la

# Look at the alx-polly subdirectory
ls -la alx-polly/

# Check git status
git status
```

### Step 2: Create Gemini CLI Prompts

Use these prompts with Gemini CLI to guide the restructuring process:

#### **Prompt 1: Analyze Repository Structure**
```bash
gemini "Analyze this repository structure and help me understand the best way to move the alx-polly subfolder to become the main project. Here's what I see in my current directory:"

# Then show Gemini your directory listing
ls -la > temp_structure.txt
gemini "$(cat temp_structure.txt)"
```

#### **Prompt 2: Plan the Migration Strategy**
```bash
gemini "I need to restructure my Git repository. Currently I have:
- Root directory with some old polling app files
- alx-polly/ subdirectory with the Next.js app I want to promote
- I want alx-polly/ contents to become the root level project

What's the safest Git approach to:
1. Move alx-polly/* to root level
2. Remove old files that aren't needed
3. Preserve Git history
4. Update any configuration files that reference paths

Please provide specific Git commands."
```

### Step 3: Execute the Restructuring

Based on Gemini's recommendations, here's the typical process:

#### **Option A: Git Subtree Approach (Recommended)**

```bash
# Create a backup branch first
git checkout -b backup-before-restructure
git push origin backup-before-restructure

# Switch back to main
git checkout main

# Move alx-polly contents to a temporary location
mkdir ../temp-alx-polly
cp -r alx-polly/* ../temp-alx-polly/
cp alx-polly/.* ../temp-alx-polly/ 2>/dev/null || true

# Remove everything from current directory (except .git)
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# Move the alx-polly contents to root
cp -r ../temp-alx-polly/* .
cp ../temp-alx-polly/.* . 2>/dev/null || true

# Clean up temp directory
rm -rf ../temp-alx-polly

# Check what we have now
ls -la
```

#### **Option B: Git Filter-Branch Approach**

Ask Gemini CLI for help with this more advanced approach:

```bash
gemini "I need to use git filter-branch to move alx-polly/* to root level while preserving history. My repository structure is:

$(tree -a -I '.git')

Provide the exact git filter-branch command to:
1. Move alx-polly/* to root level
2. Remove the old polling app files
3. Preserve commit history for the alx-polly directory"
```

### Step 4: Update Configuration Files

Use Gemini CLI to help update configuration files:

#### **Prompt for Package.json Updates**
```bash
gemini "I just moved my Next.js project from alx-polly/ to root level. Help me update these configuration files if needed:

package.json:
$(cat package.json)

Check if any scripts or paths need updating now that the project is at root level."
```

#### **Prompt for Other Config Files**
```bash
gemini "Review these configuration files and suggest updates needed after moving project to root:

1. .gitignore:
$(cat .gitignore 2>/dev/null || echo 'No .gitignore found')

2. README.md references:
$(head -20 README.md 2>/dev/null || echo 'No README.md found')

3. Any TypeScript/Next.js config files:
$(ls *.config.* 2>/dev/null || echo 'No config files found')

Suggest specific changes needed for root-level project."
```

### Step 5: Update README and Documentation

```bash
gemini "I've moved my ALX Polly project to root level. Help me update the README.md to reflect the new structure. The project is now:

- Next.js 14 polling application
- Located at repository root
- Uses Supabase for backend
- Built for ALX AI Development program

Create a comprehensive README.md that reflects this is now the main project, not a subfolder."
```

### Step 6: Commit and Push Changes

```bash
# Stage all changes
git add .

# Use Gemini CLI to help write a good commit message
gemini "Help me write a comprehensive git commit message for restructuring my repository. I:
1. Moved alx-polly/ contents to root level
2. Made ALX Polly the main project
3. Removed old polling app files
4. Updated configuration files

Write a clear, professional commit message following conventional commits format."

# Commit with the suggested message
git commit -m "feat: restructure repository - promote alx-polly to main project

- Move alx-polly/* to root level
- Remove legacy polling app files  
- Update configuration files for new structure
- ALX Polly is now the primary project

BREAKING CHANGE: Repository structure completely changed"

# Push changes
git push origin main
```

### Step 7: Verify the Restructuring

Use Gemini CLI to help verify everything is working:

```bash
# Check if Next.js app works
npm install
npm run dev

# Ask Gemini to review the structure
gemini "Review my restructured Next.js project structure:

$(tree -I 'node_modules|.next|.git' -a)

1. Is this a proper Next.js 14 project structure?
2. Are there any missing files or folders?
3. Should I create any additional configuration files?
4. Any recommendations for improving the project structure?"
```

### Step 8: Update GitHub Repository Settings

```bash
gemini "Now that my repository structure has changed, help me:

1. Update the GitHub repository description
2. Write a new repository README that reflects this is a Next.js polling app
3. Set up appropriate GitHub topics/tags
4. Configure any GitHub Actions if needed

My project is: ALX Polly - A Next.js 14 polling application with Supabase backend, real-time voting, and user authentication."
```

## 🔍 Troubleshooting Common Issues

### If Git History is Lost

```bash
gemini "I think I lost some git history during the restructuring. My git log now shows:

$(git log --oneline -10)

How can I:
1. Verify if history is actually lost
2. Recover it if possible
3. Prevent this in future restructuring operations"
```

### If Dependencies Don't Work

```bash
gemini "After restructuring, my Next.js app won't start. I'm getting this error:

$(npm run dev 2>&1)

The project structure is now:
$(ls -la)

What steps should I take to fix the dependencies and get the app running?"
```

### If Path References are Broken

```bash
gemini "Some import paths in my code are broken after moving to root level. Help me:

1. Find all files with relative imports that might be broken
2. Update import paths systematically  
3. Check for any hardcoded paths in configuration

Here's a sample of the errors I'm seeing:
[paste your specific errors here]"
```

## ✅ Final Verification Checklist

Use this checklist with Gemini CLI to ensure everything is working:

- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts the development server
- [ ] All pages load correctly in browser
- [ ] Git history is preserved (check with `git log`)
- [ ] README.md reflects new structure
- [ ] All import paths work correctly
- [ ] Environment variables are properly configured
- [ ] Supabase integration still works
- [ ] GitHub repository looks professional

## 🚀 Next Steps

Once restructuring is complete:

1. **Test the Application**: Ensure all features work
2. **Update Documentation**: Use the previous documentation guide
3. **Deploy**: Set up deployment from the new structure
4. **Share**: Post about your restructured project on LinkedIn

## 💡 Pro Tips

- **Always create a backup branch** before major restructuring
- **Test thoroughly** after moving files
- **Update all documentation** to reflect new structure
- **Use Gemini CLI iteratively** - ask follow-up questions as issues arise
- **Commit frequently** during the process to track changes

Remember: Gemini CLI is most helpful when you provide specific context about your current situation and clear questions about what you want to achieve!