# Fullstack Learning Management System

A modern, production-ready full-stack learning management system (LMS) built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Perfect for showcasing senior full-stack engineering skills in your portfolio.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## 🚀 Features

### Student Features
- **Course Catalog**: Browse courses with filters (category, level, price), search, and sorting
- **Course Details**: View course overview, curriculum, instructor info, and preview lessons
- **Enrollment**: Enroll in free courses or purchase paid courses via Stripe
- **Learning Experience**: 
  - Interactive lesson player with video/text content
  - Progress tracking with completion status
  - Quiz system with multiple choice and true/false questions
  - Course progress visualization
- **My Courses**: Dashboard showing enrolled courses with progress bars
- **Profile**: View learning statistics and certificates

### Instructor Features
- **Dashboard**: Overview of courses, students, and earnings
- **Course Management**: 
  - Create, edit, and delete courses
  - Upload thumbnails and videos
  - Set pricing and categories
- **Lesson Management**: 
  - Add video or text-based lessons
  - Organize lessons with ordering
  - Set free preview lessons
- **Quiz Management**: 
  - Create quizzes with multiple questions
  - Set passing scores and time limits
  - Multiple choice and true/false question types

### Admin Features
- **User Management**: View all users, their roles, and statistics
- **Course Approval**: Approve or reject courses before publication
- **System Management**: Full access to all features

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router, React Server Components, Server Actions, Partial Prerendering)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4+ with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk.dev (Google + Email/Password + role-based access)
- **Payments**: Stripe (checkout, subscriptions stub)
- **Video Player**: React Player
- **Rich Text**: Tiptap (for future lesson content editing)
- **State Management**: Zustand (client-side state)
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns

## 📁 Project Structure

```
├── app/
│   ├── (public)/          # Public/student routes
│   │   ├── page.tsx       # Home page
│   │   ├── courses/       # Course catalog & detail
│   │   ├── my-courses/    # Enrolled courses
│   │   ├── learn/         # Lesson player
│   │   ├── quiz/          # Quiz pages
│   │   └── profile/       # User profile
│   ├── (instructor)/     # Instructor routes (protected)
│   │   ├── dashboard/     # Instructor dashboard
│   │   └── courses/       # Course CRUD
│   ├── (admin)/           # Admin routes (protected)
│   │   ├── users/         # User management
│   │   └── courses/       # Course approval
│   └── api/               # API routes (webhooks)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── course/            # Course-related components
│   ├── lesson/            # Lesson components
│   ├── quiz/              # Quiz components
│   ├── instructor/        # Instructor components
│   └── admin/             # Admin components
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Authentication utilities
│   └── utils.ts           # Utility functions
├── actions/               # Server Actions
│   ├── courses.ts         # Course actions
│   ├── enrollments.ts     # Enrollment actions
│   ├── progress.ts        # Progress tracking
│   ├── quizzes.ts         # Quiz actions
│   └── lessons.ts         # Lesson actions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
└── middleware.ts          # Auth & role-based middleware
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ 
- PostgreSQL database (local or cloud: Supabase/Neon/Vercel Postgres)
- Clerk.dev account (for authentication)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fullstack-learning-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: From Clerk dashboard
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` & `STRIPE_SECRET_KEY`: From Stripe dashboard
   - `STRIPE_WEBHOOK_SECRET`: From Stripe webhook settings
   - `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., `http://localhost:3000`)

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed the database** (optional)
   ```bash
   npm run db:seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing the Application

### 1. Register as a Student
- Sign up with email/password or Google
- Browse courses on the home page
- View course details and enroll in free courses

### 2. Create an Instructor Account
- Sign up and update your role to `INSTRUCTOR` in the database:
  ```sql
  UPDATE "User" SET role = 'INSTRUCTOR' WHERE email = 'your-email@example.com';
  ```
- Access `/instructor/dashboard`
- Create a new course at `/instructor/courses/new`
- Add lessons and quizzes to your course

### 3. Test Admin Features
- Update a user's role to `ADMIN`:
  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
  ```
- Access `/admin/users` and `/admin/courses`
- Approve pending courses

### 4. Test Learning Flow
- Enroll in a course (free or paid via Stripe)
- Navigate to `/my-courses`
- Start learning at `/learn/[courseSlug]/[lessonSlug]`
- Mark lessons as complete
- Take quizzes at `/quiz/[courseSlug]/[quizId]`

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Set up Database**
   - Use Vercel Postgres or connect to Supabase/Neon
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma db push`

4. **Configure Clerk**
   - Add your Vercel domain to Clerk dashboard
   - Update redirect URLs

5. **Configure Stripe Webhooks**
   - Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 📚 Database Schema

The application uses Prisma with the following main models:
- **User**: Students, instructors, and admins
- **Course**: Course information, pricing, and metadata
- **Lesson**: Individual lessons (video or text)
- **Quiz**: Quizzes with questions
- **Question**: Quiz questions (multiple choice or true/false)
- **Enrollment**: Student course enrollments
- **Progress**: Lesson completion tracking
- **QuizSubmission**: Quiz attempt records
- **Category**: Course categories

## 🔐 Authentication & Authorization

- **Authentication**: Handled by Clerk.dev
- **Roles**: `STUDENT`, `INSTRUCTOR`, `ADMIN`
- **Middleware**: Role-based route protection
- **Server Actions**: Role checks for sensitive operations

## 💳 Payments

- **Stripe Integration**: Checkout sessions for paid courses
- **Webhook**: Handles payment completion and enrollment
- **Free Courses**: Direct enrollment without payment

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Supported via Tailwind CSS
- **Loading States**: Skeleton loaders for better UX
- **Toast Notifications**: User feedback with Sonner
- **Accessible**: ARIA labels and keyboard navigation
- **SEO**: Metadata for public pages

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 🙏 Acknowledgments

- Inspired by platforms like Udemy and Coursera
- Built with modern Next.js 15 best practices
- Uses shadcn/ui for beautiful, accessible components

## 📧 Contact

- telegram: https://t.me/ledeking
- twitter:  https://x.com/ledeking_
