# ALX Polly - A Next.js Polling Application

Welcome to ALX Polly, a full-stack polling application built with Next.js 14, TypeScript, and Supabase. This project allows users to create, share, and vote on polls in real-time, featuring a secure authentication system and a user-friendly dashboard.

This repository is the main project for the ALX AI Development program, showcasing modern web development practices.

## 🚀 Features

-   **User Authentication**: Secure sign-up and login functionality powered by Supabase Auth.
-   **Poll Creation & Management**: Authenticated users can create, view, and delete their own polls.
-   **Real-time Voting**: A dynamic voting system for casting and viewing votes instantly.
-   **User Dashboard**: A personalized space for users to manage their polls and see results.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Supabase](https://supabase.io/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)

## ⚙️ Getting Started

To get the application running on your local machine, follow these steps.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Supabase](https://supabase.io/) account.

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and add your Supabase project URL and anon key:

```bash
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

You will also need to run the SQL schema provided in `supabase-schema.sql` in your Supabase SQL editor to set up the necessary tables and policies.

### 4. Running the Development Server

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📂 Repository Structure

The project is now located at the root of the repository, following a standard Next.js App Router structure.

-   `app/`: Contains all the routes, pages, and core application logic.
-   `components/`: Shared UI components.
-   `lib/`: Contains Supabase client setup and server actions.
-   `public/`: Static assets.