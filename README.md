# 📝 AI-Powered Notes App

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=react-query" alt="React Query" />
</div>

<p align="center">
  <img src="public/app-preview.png" alt="AI Notes App Preview" width="800" />
</p>

A sleek, modern notes application with AI-powered summarization, built with Next.js, TypeScript, Supabase, and React Query.

## ✨ Features

- **🔐 Secure Authentication**

  - Email & Password login
  - Google OAuth integration
  - Protected routes

- **📒 Notes Management**

  - Create, read, update, and delete notes
  - Responsive design for all devices
  - Intuitive user interface with Shadcn UI components

- **🤖 AI Summarization**

  - Generate concise summaries of your notes
  - Powered by DeepSeek AI (or Groq alternative)
  - Preserve summaries with your notes

- **⚡ Modern Tech Stack**
  - Next.js for server-side rendering and API routes
  - TypeScript for type safety
  - React Query for efficient data fetching and caching
  - Tailwind CSS for beautiful responsive design
  - Supabase for authentication and database

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- DeepSeek API key (or Groq alternative)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-notes-app.git
cd ai-notes-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# DeepSeek API Key (or Groq alternative)
DEEPSEEK_API_KEY=your-deepseek-api-key

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

## 📦 Project Structure

```
ai-notes-app/
├── app/                  # Next.js 14 App Router
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── notes/            # Notes pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/             # Auth components
│   ├── notes/            # Notes components
│   ├── ui/               # Shadcn UI components
│   ├── Header.tsx        # Header component
│   ├── Footer.tsx        # Footer component
│   └── Providers.tsx     # React Query provider
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase clients
│   ├── hooks/            # Custom React hooks
│   └── utils.ts          # Helper functions
├── types/                # TypeScript types
├── public/               # Static assets
├── .env.local            # Environment variables
└── README.md             # Project documentation
```

## 🛠️ Database Setup

The application uses Supabase with the following tables:

### Profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT NOT NULL
);
```

### Notes Table

```sql
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL
);
```

## 🚢 Deployment

The app can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

## 🧪 Running Tests

```bash
npm run test
# or
yarn test
```

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [DeepSeek AI](https://www.deepseek.com/)
